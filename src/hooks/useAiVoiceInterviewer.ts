"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { backendApi } from "@/lib/api-client";

export const WAVEFORM_HEIGHTS = [
  12, 18, 24, 16, 10, 8, 14, 20, 26, 15, 9, 13, 22, 17, 11, 25, 20, 14, 8, 12,
  18, 24, 10, 6,
];

const SILENCE_TIMEOUT_MS = 2800; // 2.8s pause to auto-commit spoken answer
const SILENCE_GRACE_PERIOD_MS = 1200; // 1.2s grace period before countdown
const RMS_SPEECH_THRESHOLD = 0.028; // Voice onset amplitude threshold

export type VoiceTurnState =
  | "LOBBY"
  | "INITIALIZING"
  | "AI_SPEAKING"
  | "LISTENING_WAITING"
  | "CANDIDATE_SPEAKING"
  | "PROCESSING"
  | "PAUSED"
  | "COMPLETED";

export interface VoiceMessageItem {
  sender: "ai" | "user";
  content: string;
  details?: string[];
  timestamp?: string;
}

export interface UseAiVoiceInterviewerOptions {
  topicSlug: string;
  questionId?: string;
  initialPrompt?: string;
  initialHints?: string[];
  candidateRole?: string;
  autoStart?: boolean;
  onTurnComplete?: (result: {
    replyText: string;
    coveredRubricAtoms: string[];
    remainingRubricAtoms: string[];
  }) => void;
}

export function useAiVoiceInterviewer(options: UseAiVoiceInterviewerOptions) {
  const {
    topicSlug,
    questionId,
    initialPrompt,
    initialHints,
    candidateRole = "Senior Software Engineer",
    autoStart = false,
    onTurnComplete,
  } = options;

  // Turn & Session State
  const [turnState, setTurnState] = useState<VoiceTurnState>("LOBBY");
  const turnStateRef = useRef<VoiceTurnState>("LOBBY");
  const [isCallActive, setIsCallActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [silenceCountdown, setSilenceCountdown] = useState<number | null>(null);

  // Audio & Waveform Visualization
  const [waveformBars, setWaveformBars] = useState<number[]>(WAVEFORM_HEIGHTS);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const speechGenIdRef = useRef<number>(0);
  const speakIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // VAD & Silence Smoothing Refs
  const lastSpokeTimeRef = useRef<number>(0);
  const smoothedRmsRef = useRef<number>(0);
  const speechDetectedRef = useRef<boolean>(false);
  const lastCountdownUpdateRef = useRef<number>(0);

  // Conversation Transcript & Rubrics
  const [messages, setMessages] = useState<VoiceMessageItem[]>([]);
  const [coveredRubricAtoms, setCoveredRubricAtoms] = useState<string[]>([]);
  const [remainingRubricAtoms, setRemainingRubricAtoms] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Text mode fallback
  const [isTextInput, setIsTextInput] = useState(false);
  const [textMessage, setTextMessage] = useState("");

  const updateTurnState = useCallback((state: VoiceTurnState) => {
    turnStateRef.current = state;
    setTurnState(state);
  }, []);

  // Pre-seed chat transcript with initial prompt before call connects
  useEffect(() => {
    if (!isCallActive && initialPrompt) {
      setMessages([
        {
          sender: "ai",
          content: initialPrompt,
          details: initialHints && initialHints.length > 0 ? initialHints : undefined,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  }, [initialPrompt, initialHints, isCallActive]);

  /**
   * Hard Kill Active Audio: Unloads the audio buffer, aborts any in-flight TTS synthesis,
   * stops speech waveform intervals, and completely silences the browser immediately.
   */
  const hardKillActiveAudio = useCallback(() => {
    speechGenIdRef.current += 1;

    if (speakIntervalRef.current) {
      clearInterval(speakIntervalRef.current);
      speakIntervalRef.current = null;
    }

    if (activeAudioRef.current) {
      const audio = activeAudioRef.current;
      audio.onended = null;
      audio.onerror = null;
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.removeAttribute("src");
        audio.src = "";
        audio.load();
      } catch {}
      activeAudioRef.current = null;
    }

    setWaveformBars(WAVEFORM_HEIGHTS);
  }, []);

  /**
   * Dedicated clean audio teardown: stop recorder, release mic tracks, cancel VAD
   */
  const stopAndReleaseAudio = useCallback(() => {
    hardKillActiveAudio();

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setSilenceCountdown(null);
    lastSpokeTimeRef.current = 0;
    smoothedRmsRef.current = 0;
    speechDetectedRef.current = false;
    lastCountdownUpdateRef.current = 0;

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.ondataavailable = null;
      if (mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
      mediaRecorderRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
  }, [hardKillActiveAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAndReleaseAudio();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => null);
      }
    };
  }, [stopAndReleaseAudio]);

  /**
   * Sarah TTS Audio Synthesis: Speak text aloud and resolve on completion
   */
  const speakSarah = useCallback(
    async (speechText: string): Promise<void> => {
      if (isMuted || typeof window === "undefined") {
        return;
      }

      // Hard kill any prior playing audio before synthesizing new speech
      hardKillActiveAudio();
      const currentGenId = speechGenIdRef.current;

      return new Promise<void>(async (resolve) => {
        try {
          // Acoustic isolation: pause VAD analysis and recording while Sarah speaks
          if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
          }
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          setSilenceCountdown(null);

          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            try {
              mediaRecorderRef.current.pause();
            } catch {}
          }

          updateTurnState("AI_SPEAKING");

          // Animate waveform during Sarah speaking
          if (speakIntervalRef.current) clearInterval(speakIntervalRef.current);
          speakIntervalRef.current = setInterval(() => {
            if (turnStateRef.current !== "AI_SPEAKING") {
              if (speakIntervalRef.current) clearInterval(speakIntervalRef.current);
              return;
            }
            setWaveformBars(
              WAVEFORM_HEIGHTS.map((h) =>
                Math.max(6, Math.min(32, Math.round(h * (0.6 + Math.random() * 0.8))))
              )
            );
          }, 100);

          const audioBuffer = await backendApi.synthesizeVoice(speechText, {});

          // Invalidation check: Did candidate click skip or barge-in while synthesizing?
          if (speechGenIdRef.current !== currentGenId) {
            if (speakIntervalRef.current) clearInterval(speakIntervalRef.current);
            resolve();
            return;
          }

          const audioBlob = new Blob([audioBuffer], { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);

          const audio = new Audio(audioUrl);
          activeAudioRef.current = audio;

          audio.onended = () => {
            if (speakIntervalRef.current) clearInterval(speakIntervalRef.current);
            activeAudioRef.current = null;
            URL.revokeObjectURL(audioUrl);
            resolve();
          };

          audio.onerror = () => {
            if (speakIntervalRef.current) clearInterval(speakIntervalRef.current);
            activeAudioRef.current = null;
            resolve();
          };

          if (speechGenIdRef.current !== currentGenId) {
            hardKillActiveAudio();
            resolve();
            return;
          }

          await audio.play().catch((err) => {
            if (speakIntervalRef.current) clearInterval(speakIntervalRef.current);
            console.warn("Audio autoplay blocked/failed:", err);
            resolve();
          });
        } catch (err) {
          if (speakIntervalRef.current) clearInterval(speakIntervalRef.current);
          console.warn("TTS synthesis error:", err);
          resolve();
        }
      });
    },
    [isMuted, updateTurnState, hardKillActiveAudio]
  );

  /**
   * Finalize candidate spoken answer, transcribe with Deepgram, and trigger Sarah's reply
   */
  const finalizeCandidateSpokenTurn = useCallback(async () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setSilenceCountdown(null);
    speechDetectedRef.current = false;

    updateTurnState("PROCESSING");

    // Stop recorder to compile full speech blob
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, [updateTurnState]);

  /**
   * Start Autonomous Listening & Real-time VAD Silence Detection
   */
  const startAutonomousListening = useCallback(() => {
    if (turnStateRef.current === "COMPLETED") return;

    try {
      updateTurnState("LISTENING_WAITING");
      audioChunksRef.current = [];
      lastSpokeTimeRef.current = 0;
      smoothedRmsRef.current = 0;
      speechDetectedRef.current = false;
      lastCountdownUpdateRef.current = 0;
      setSilenceCountdown(null);

      // Start/Resume MediaRecorder cleanly
      if (micStreamRef.current) {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
          const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus"
            : "audio/webm";
          const recorder = new MediaRecorder(micStreamRef.current, { mimeType });
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };

          recorder.onstop = async () => {
            const fullBlob = new Blob(audioChunksRef.current, {
              type: recorder.mimeType || "audio/webm",
            });
            audioChunksRef.current = [];
            await handleRecordedAudioBlob(fullBlob);
          };

          recorder.start(250);
        } else if (mediaRecorderRef.current.state === "paused") {
          mediaRecorderRef.current.resume();
        }
      }

      // VAD Analysis Loop
      if (!analyserRef.current) return;
      const analyser = analyserRef.current;
      const timeDomainData = new Float32Array(analyser.fftSize);

      const vadLoop = () => {
        if (
          turnStateRef.current !== "LISTENING_WAITING" &&
          turnStateRef.current !== "CANDIDATE_SPEAKING"
        ) {
          return;
        }

        analyser.getFloatTimeDomainData(timeDomainData);
        let sumSquares = 0;
        for (let i = 0; i < timeDomainData.length; i++) {
          sumSquares += timeDomainData[i] * timeDomainData[i];
        }
        const rms = Math.sqrt(sumSquares / timeDomainData.length);
        smoothedRmsRef.current = smoothedRmsRef.current * 0.7 + rms * 0.3;

        const now = Date.now();
        const isSpeakingNow = smoothedRmsRef.current >= RMS_SPEECH_THRESHOLD;

        // Waveform dynamics
        setWaveformBars(
          WAVEFORM_HEIGHTS.map((baseHeight) => {
            const boost = isSpeakingNow ? Math.min(3.2, 1 + smoothedRmsRef.current * 40) : 1;
            return Math.max(4, Math.min(32, Math.round(baseHeight * boost)));
          })
        );

        if (isSpeakingNow) {
          lastSpokeTimeRef.current = now;
          if (!speechDetectedRef.current) {
            speechDetectedRef.current = true;
            updateTurnState("CANDIDATE_SPEAKING");
          }
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          if (silenceCountdown !== null) {
            setSilenceCountdown(null);
          }
        } else if (speechDetectedRef.current && lastSpokeTimeRef.current > 0) {
          const silentMs = now - lastSpokeTimeRef.current;
          if (silentMs >= SILENCE_GRACE_PERIOD_MS) {
            const remainingMs = Math.max(0, SILENCE_TIMEOUT_MS - silentMs);
            const remainingSec = Math.ceil(remainingMs / 1000);

            if (now - lastCountdownUpdateRef.current > 200) {
              setSilenceCountdown(remainingSec);
              lastCountdownUpdateRef.current = now;
            }

            if (silentMs >= SILENCE_TIMEOUT_MS) {
              finalizeCandidateSpokenTurn();
              return;
            }
          }
        }

        animFrameRef.current = requestAnimationFrame(vadLoop);
      };

      animFrameRef.current = requestAnimationFrame(vadLoop);
    } catch (err) {
      console.warn("Autonomous listening error:", err);
    }
  }, [finalizeCandidateSpokenTurn, silenceCountdown, updateTurnState]);

  /**
   * Process recorded audio blob: Deepgram STT -> submit turn -> Sarah responds aloud
   */
  const handleRecordedAudioBlob = useCallback(
    async (blob: Blob) => {
      if (blob.size < 1000) {
        startAutonomousListening();
        return;
      }

      setIsProcessing(true);
      try {
        const { transcript } = await backendApi.transcribeVoice(blob);
        const cleanText = transcript?.trim();

        if (!cleanText || cleanText.length < 2) {
          startAutonomousListening();
          return;
        }

        // Add candidate transcript to messages
        const updatedTranscript = [
          ...messages,
          { sender: "user" as const, content: cleanText, timestamp: new Date().toLocaleTimeString() },
        ];
        setMessages(updatedTranscript);

        // Submit turn to AI interviewer engine
        const turnResponse = await backendApi.submitPracticeSessionTurn({
          topicSlug,
          questionId,
          candidateMessage: cleanText,
          transcriptHistory: updatedTranscript.map((m) => ({
            sender: m.sender,
            content: m.content,
          })),
          candidateTargetLevel: candidateRole,
        });

        if (turnResponse && turnResponse.replyText) {
          const aiMessage: VoiceMessageItem = {
            sender: "ai",
            content: turnResponse.replyText,
            timestamp: new Date().toLocaleTimeString(),
          };
          setMessages((prev) => [...prev, aiMessage]);

          if (turnResponse.coveredRubricAtoms) {
            setCoveredRubricAtoms(turnResponse.coveredRubricAtoms);
          }
          if (turnResponse.remainingRubricAtoms) {
            setRemainingRubricAtoms(turnResponse.remainingRubricAtoms);
          }

          if (onTurnComplete) {
            onTurnComplete({
              replyText: turnResponse.replyText,
              coveredRubricAtoms: turnResponse.coveredRubricAtoms || [],
              remainingRubricAtoms: turnResponse.remainingRubricAtoms || [],
            });
          }

          // Speak Sarah's reply aloud
          await speakSarah(turnResponse.replyText);

          // Resume listening autonomously
          startAutonomousListening();
        } else {
          startAutonomousListening();
        }
      } catch (err) {
        console.error("Spoken turn processing failed:", err);
        startAutonomousListening();
      } finally {
        setIsProcessing(false);
      }
    },
    [
      messages,
      topicSlug,
      questionId,
      candidateRole,
      speakSarah,
      startAutonomousListening,
      onTurnComplete,
    ]
  );

  /**
   * Instant Barge-In Interruption: Cut Sarah's audio <10ms and switch to candidate speaking
   */
  const handleBargeIn = useCallback(async () => {
    hardKillActiveAudio();
    updateTurnState("CANDIDATE_SPEAKING");

    try {
      await backendApi.interruptVoiceSession({
        source: "candidate_barge_in",
        timestampMs: Date.now(),
      });
    } catch (err) {
      console.warn("Barge-in signal dispatch failed:", err);
    }

    startAutonomousListening();
  }, [startAutonomousListening, updateTurnState, hardKillActiveAudio]);

  /**
   * Instant Skip Question Audio: Immediately halts previous audio, cancels any silence
   * timers or candidate voice recording, and resets state cleanly to LISTENING_WAITING ("Ready • Speak naturally").
   */
  const handleSkipQuestionAudio = useCallback(
    (nextPromptText?: string) => {
      // 1. Instantly hard-kill any playing audio and invalidate in-flight TTS
      hardKillActiveAudio();

      // 2. Clear any silence countdowns and frame loops
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      setSilenceCountdown(null);
      lastSpokeTimeRef.current = 0;
      smoothedRmsRef.current = 0;
      speechDetectedRef.current = false;
      lastCountdownUpdateRef.current = 0;

      // 3. Clear any buffered speech recordings from skipped question
      audioChunksRef.current = [];

      // 4. Reset turn state directly to Ready (DO NOT set CANDIDATE_SPEAKING)
      updateTurnState(isCallActive ? "LISTENING_WAITING" : "LOBBY");

      // 5. Fire background signal to backend to cancel in-flight audio/turn
      backendApi
        .interruptVoiceSession({
          source: "candidate_skip_question",
          timestampMs: Date.now(),
        })
        .catch(() => {});

      // 6. If call is active and nextPromptText is passed, Sarah speaks the new question prompt aloud
      if (isCallActive && nextPromptText) {
        speakSarah(nextPromptText)
          .then(() => {
            startAutonomousListening();
          })
          .catch(() => {
            startAutonomousListening();
          });
      } else if (isCallActive) {
        startAutonomousListening();
      }
    },
    [isCallActive, speakSarah, startAutonomousListening, updateTurnState, hardKillActiveAudio]
  );

  /**
   * Initialize microphone, AudioContext and start the interview session
   */
  const startSession = useCallback(async () => {
    try {
      updateTurnState("INITIALIZING");
      setIsCallActive(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      micStreamRef.current = stream;

      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Initial prompt greeting
      const greetingText =
        initialPrompt ||
        `Welcome to your practice session for ${topicSlug.replace(/[-_]+/g, " ")}. Walk me through your high-level approach or ask any clarifying questions to start.`;

      const initialAiMessage: VoiceMessageItem = {
        sender: "ai",
        content: greetingText,
        details: initialHints,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([initialAiMessage]);

      // Sarah speaks greeting aloud
      await speakSarah(greetingText);

      // Begin listening for candidate's voice
      startAutonomousListening();
    } catch (err) {
      console.error("Failed to start voice interviewer session:", err);
      updateTurnState("LOBBY");
      setIsCallActive(false);
    }
  }, [initialPrompt, initialHints, topicSlug, speakSarah, startAutonomousListening, updateTurnState]);

  /**
   * Handle text message submission (fallback mode)
   */
  const sendTextMessage = useCallback(
    async (textToSend?: string) => {
      const msg = (textToSend || textMessage).trim();
      if (!msg) return;

      setTextMessage("");
      const userMessage: VoiceMessageItem = {
        sender: "user",
        content: msg,
        timestamp: new Date().toLocaleTimeString(),
      };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      updateTurnState("PROCESSING");
      try {
        const turnResponse = await backendApi.submitPracticeSessionTurn({
          topicSlug,
          questionId,
          candidateMessage: msg,
          transcriptHistory: updatedMessages.map((m) => ({
            sender: m.sender,
            content: m.content,
          })),
          candidateTargetLevel: candidateRole,
        });

        if (turnResponse && turnResponse.replyText) {
          const aiMessage: VoiceMessageItem = {
            sender: "ai",
            content: turnResponse.replyText,
            timestamp: new Date().toLocaleTimeString(),
          };
          setMessages((prev) => [...prev, aiMessage]);

          if (turnResponse.coveredRubricAtoms) {
            setCoveredRubricAtoms(turnResponse.coveredRubricAtoms);
          }
          if (turnResponse.remainingRubricAtoms) {
            setRemainingRubricAtoms(turnResponse.remainingRubricAtoms);
          }

          if (isCallActive) {
            await speakSarah(turnResponse.replyText);
            startAutonomousListening();
          } else {
            updateTurnState("LOBBY");
          }
        }
      } catch (err) {
        console.error("Text turn processing error:", err);
        updateTurnState(isCallActive ? "LISTENING_WAITING" : "LOBBY");
      }
    },
    [
      textMessage,
      messages,
      topicSlug,
      questionId,
      candidateRole,
      isCallActive,
      speakSarah,
      startAutonomousListening,
      updateTurnState,
    ]
  );

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      if (next) {
        if (activeAudioRef.current) activeAudioRef.current.pause();
        updateTurnState("PAUSED");
      } else {
        startAutonomousListening();
      }
      return next;
    });
  }, [startAutonomousListening, updateTurnState]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return {
    turnState,
    isCallActive,
    isPaused,
    isMuted,
    waveformBars,
    silenceCountdown,
    messages,
    coveredRubricAtoms,
    remainingRubricAtoms,
    isProcessing,
    isTextInput,
    textMessage,
    setTextMessage,
    setIsTextInput,
    startSession,
    stopAndReleaseAudio,
    handleBargeIn,
    handleSkipQuestionAudio,
    finalizeCandidateSpokenTurn,
    sendTextMessage,
    togglePause,
    toggleMute,
    setMessages,
  };
}
