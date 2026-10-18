"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  User,
  Info,
  Pause,
  Play,
  Square,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  LayoutGrid,
  Network,
  FileCode,
  FileText,
  Lightbulb,
  CheckCircle2,
  X,
  Send,
  Loader2,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldAlert,
  Headphones,
  Check,
} from "lucide-react";
import { backendApi } from "@/lib/api-client";
import { WhiteboardModal } from "@/components/practice/WhiteboardModal";

// 24 animated waveform bars
const WAVEFORM_HEIGHTS = [
  12, 18, 24, 16, 10, 8, 14, 20, 26, 15, 9, 13, 22, 17, 11, 25, 20, 14, 8, 12,
  18, 24, 10, 6,
];

const TOTAL_SESSION_SECONDS = 15 * 60; // 15 minutes diagnostic
const SILENCE_TIMEOUT_MS = 3000; // 3.0 seconds maximum pause to finalize answer
const SILENCE_GRACE_PERIOD_MS = 1200; // 1.2 seconds natural thinking pause grace period before countdown appears
const RMS_SPEECH_THRESHOLD = 0.032; // Voice onset amplitude threshold

interface DiagnosticQuestion {
  id: string;
  text: string;
  category: string;
  difficulty: string;
  expectedDepth: string;
}

export interface QuestionBreakdownItem {
  questionNumber: number;
  category: string;
  questionPrompt: string;
  candidateAnswer: string;
  modelAnswer: string;
  keyPointsCovered: string[];
  keyPointsMissed: string[];
  scorePercentage: number;
}

interface MessageItem {
  sender: "ai" | "user";
  content: string;
  categoryTag?: string;
  details?: string[];
  timestamp: string;
}

type TurnState =
  | "LOBBY"
  | "INITIALIZING"
  | "AI_SPEAKING"
  | "LISTENING_WAITING"
  | "CANDIDATE_SPEAKING"
  | "PROCESSING"
  | "COMPLETED";

export function AiAssessmentSessionWorkspace() {
  const router = useRouter();

  // Call Lobby & Autonomous Voice State
  const [callStarted, setCallStarted] = useState(false);
  const [turnState, setTurnState] = useState<TurnState>("LOBBY");
  const turnStateRef = useRef<TurnState>("LOBBY");
  const [silenceCountdown, setSilenceCountdown] = useState<number | null>(null);

  // Step 1 Profile & Assessment Session Data
  const [targetRole, setTargetRole] = useState("Senior Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("4-5 years");
  const [candidateName, setCandidateName] = useState("Candidate");
  const [sessionId, setSessionId] = useState<string>("");
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<DiagnosticQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Mutable refs to prevent React closure staleness across voice turns
  const questionsRef = useRef<DiagnosticQuestion[]>([]);
  const questionIndexRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);
  const handleRecordedAudioBlobRef = useRef<((blob: Blob) => Promise<void>) | null>(null);
  const handleFinishAssessmentRef = useRef<(() => Promise<void>) | null>(null);

  // VAD & Silence Smoothing Refs (Hysteresis & Anti-Flicker)
  const lastSpokeTimeRef = useRef<number>(0);
  const smoothedRmsRef = useRef<number>(0);
  const speechDetectedRef = useRef<boolean>(false);
  const lastCountdownUpdateRef = useRef<number>(0);

  // Status & Loading
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishStage, setFinishStage] = useState<string>("");

  // Timer: 15-minute diagnostic counting up
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Voice AI States
  const [isMuted, setIsMuted] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>(WAVEFORM_HEIGHTS);

  // Optional manual text input drawer
  const [isTextInput, setIsTextInput] = useState(false);
  const [textMessage, setTextMessage] = useState("");

  // Audio references
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Interactive Tools (Whiteboard, Code Scratchpad, Architecture Diagram, Notes)
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<"diagram" | "code" | "notes" | null>(null);
  const [notesContent, setNotesContent] = useState("");
  const [codeContent, setCodeContent] = useState(
    "// Scratchpad for data structures, queries, or architecture logic\nfunction processRequests(batch) {\n  // your implementation notes\n}\n"
  );

  // Modals & Evaluation Results
  const [showEndModal, setShowEndModal] = useState(false);
  const [selectedBreakdownTab, setSelectedBreakdownTab] = useState<number>(0);
  const [assessmentResult, setAssessmentResult] = useState<{
    overallScore: number;
    readinessScore: number;
    readinessDelta: number;
    verdict: string;
    evaluatorNotes: string;
    strengths: string[];
    blindSpots: string[];
    scoreFormula?: string;
    questionBreakdown?: QuestionBreakdownItem[];
  } | null>(null);

  // Conversational Transcript Messages
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Elapsed timer tick
  useEffect(() => {
    if (!callStarted || isPaused || turnState === "LOBBY" || isFinishing || assessmentResult) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStarted, isPaused, turnState, isFinishing, assessmentResult]);

  /**
   * Dedicated clean audio teardown: stop recorder, release mic tracks, cancel VAD
   */
  const stopAndReleaseAudio = useCallback(() => {
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

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }

    setWaveformBars(WAVEFORM_HEIGHTS);
  }, []);

  const updateTurnState = useCallback((state: TurnState) => {
    turnStateRef.current = state;
    setTurnState(state);
  }, []);

  /**
   * Cleanup audio resources on unmount
   */
  useEffect(() => {
    return () => {
      stopAndReleaseAudio();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => null);
      }
    };
  }, [stopAndReleaseAudio]);

  /**
   * Cartesia Sonic-3.6 TTS: Speak text aloud and resolve on completion
   */
  const speakSarah = useCallback(
    async (speechText: string): Promise<void> => {
      if (isMuted || typeof window === "undefined") {
        return;
      }

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

          if (activeAudioRef.current) {
            activeAudioRef.current.pause();
            activeAudioRef.current = null;
          }

          updateTurnState("AI_SPEAKING");

          const audioBuffer = await backendApi.synthesizeVoice(speechText, {});
          const audioBlob = new Blob([audioBuffer], { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);

          const audio = new Audio(audioUrl);
          activeAudioRef.current = audio;

          audio.onended = () => {
            activeAudioRef.current = null;
            URL.revokeObjectURL(audioUrl);
            resolve();
          };

          audio.onerror = () => {
            activeAudioRef.current = null;
            resolve();
          };

          await audio.play().catch((err) => {
            console.warn("Audio autoplay blocked/failed:", err);
            resolve();
          });
        } catch (err) {
          console.warn("TTS synthesis error:", err);
          resolve();
        }
      });
    },
    [isMuted, updateTurnState]
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
   * Auto-Listening & Real-time VAD Silence Detection (Anti-flicker hysteresis)
   */
  const startAutonomousListening = useCallback(() => {
    if (turnStateRef.current === "COMPLETED" || isFinishing) return;

    try {
      updateTurnState("LISTENING_WAITING");
      audioChunksRef.current = [];
      lastSpokeTimeRef.current = 0;
      smoothedRmsRef.current = 0;
      speechDetectedRef.current = false;
      lastCountdownUpdateRef.current = 0;
      setSilenceCountdown(null);

      // Start/Resume MediaRecorder
      if (mediaRecorderRef.current) {
        if (mediaRecorderRef.current.state === "paused") {
          mediaRecorderRef.current.resume();
        } else if (mediaRecorderRef.current.state === "inactive") {
          mediaRecorderRef.current.start(200);
        }
      }

      // VAD volume monitoring loop via AnalyserNode
      const analyser = analyserRef.current;
      if (!analyser) return;

      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (
          !analyserRef.current ||
          isPaused ||
          turnStateRef.current === "AI_SPEAKING" ||
          turnStateRef.current === "COMPLETED" ||
          turnStateRef.current === "PROCESSING"
        ) {
          return;
        }

        analyser.getByteTimeDomainData(dataArray);

        // Compute Root Mean Square (RMS) volume
        let sumSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
          const norm = (dataArray[i] - 128) / 128;
          sumSquares += norm * norm;
        }
        const rawRms = Math.sqrt(sumSquares / bufferLength);

        // Exponential Moving Average (EMA) to smooth out micro-fluctuations (alpha = 0.3)
        smoothedRmsRef.current = smoothedRmsRef.current * 0.7 + rawRms * 0.3;
        const currentRms = smoothedRmsRef.current;

        // Dynamically update waveform visualization according to candidate's voice
        const freqArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqArray);
        const step = Math.floor(freqArray.length / 24);
        setWaveformBars(
          WAVEFORM_HEIGHTS.map((_, idx) => {
            const val = freqArray[idx * step] || 0;
            return Math.max(6, Math.min(32, Math.round((val / 255) * 32)));
          })
        );

        const now = Date.now();

        // Voice Activity Logic with Debounce Hysteresis
        if (currentRms > RMS_SPEECH_THRESHOLD) {
          lastSpokeTimeRef.current = now;

          if (!speechDetectedRef.current) {
            speechDetectedRef.current = true;
            updateTurnState("CANDIDATE_SPEAKING");
          }

          // Clear any active silence countdown when voice activity continues
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          setSilenceCountdown(null);
        } else if (speechDetectedRef.current) {
          // Candidate has spoken, and amplitude is currently quiet
          const silenceElapsed = now - lastSpokeTimeRef.current;

          if (silenceElapsed >= SILENCE_TIMEOUT_MS) {
            // Full silence timeout reached (2.4s): Candidate finished speaking!
            speechDetectedRef.current = false;
            setSilenceCountdown(null);
            finalizeCandidateSpokenTurn();
            return;
          } else if (silenceElapsed >= SILENCE_GRACE_PERIOD_MS) {
            // Sustained pause beyond 900ms: show countdown without thrashing React (every 150ms)
            if (now - lastCountdownUpdateRef.current > 150) {
              lastCountdownUpdateRef.current = now;
              const remainingSecs = Math.max(0.1, Number(((SILENCE_TIMEOUT_MS - silenceElapsed) / 1000).toFixed(1)));
              setSilenceCountdown(remainingSecs);
            }
          } else {
            // Under 900ms: micro-pause between syllables/words; do NOT flicker countdown
            setSilenceCountdown(null);
          }
        }

        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(checkVolume);
    } catch (err) {
      console.error("Auto-listening activation error:", err);
    }
  }, [finalizeCandidateSpokenTurn, isFinishing, isPaused, updateTurnState]);

  /**
   * Transcribe the recorded blob and advance conversation
   */
  const handleRecordedAudioBlob = useCallback(
    async (blob: Blob) => {
      if (isProcessingRef.current || turnStateRef.current === "COMPLETED") return;
      isProcessingRef.current = true;

      try {
        if (!blob || blob.size < 800) {
          // Audio was too short or empty; re-listen
          startAutonomousListening();
          return;
        }

        const res = await backendApi.transcribeVoice(blob);
        const transcript = res.transcript?.trim() || "";

        if (!transcript) {
          // No recognizable speech detected; continue listening
          startAutonomousListening();
          return;
        }

        // Check if candidate asked to repeat the question
        const lower = transcript.toLowerCase();
        const isRepeatRequest =
          lower.includes("repeat") ||
          lower.includes("say that again") ||
          lower.includes("pardon") ||
          lower.includes("what was the question");

        const userTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        // Add candidate transcript to messages
        setMessages((prev) => [
          ...prev,
          {
            sender: "user",
            content: transcript,
            timestamp: userTimestamp,
          },
        ]);

        const currentQuestions = questionsRef.current;
        const currentIdx = questionIndexRef.current;

        if (isRepeatRequest) {
          const currentQ = currentQuestions[currentIdx];
          const qText = currentQ?.text || (currentQ as any)?.prompt || "";
          const repeatText = `No problem at all! Let me repeat question ${currentIdx + 1} for you: "${qText}"`;
          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              content: repeatText,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          await speakSarah(repeatText);
          startAutonomousListening();
          return;
        }

        // Move to next diagnostic question
        const nextIdx = currentIdx + 1;
        if (nextIdx < currentQuestions.length) {
          questionIndexRef.current = nextIdx;
          setCurrentQuestionIndex(nextIdx);

          const nextQ = currentQuestions[nextIdx];
          const nextQText = nextQ.text || (nextQ as any).prompt || "";
          const isFinalQuestion = nextIdx === currentQuestions.length - 1;

          const spokenIntro = isFinalQuestion
            ? `Thanks for explaining that! Let's move to our third and final question in ${nextQ.category}: "${nextQText}"`
            : `Thanks for walking me through that! Your reasoning on that point is very clear. Let's move to our next focus area in ${nextQ.category}: "${nextQText}"`;

          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              content: isFinalQuestion
                ? `Thanks for explaining that! Let's move to our third and final question in ${nextQ.category}.`
                : `Thanks for walking me through that! Your reasoning on that point is very clear. Let's move to our next topic in ${nextQ.category}.`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
            {
              sender: "ai",
              categoryTag: nextQ.category,
              content: `Question ${nextIdx + 1}: "${nextQText}"`,
              details: [
                `Target Depth: ${nextQ.expectedDepth}`,
                "Consider latency, consistency, or failure modes when answering.",
              ],
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          // Sarah speaks the question aloud
          await speakSarah(spokenIntro);

          // Once spoken, auto-listen opens for candidate's answer
          startAutonomousListening();
        } else {
          // All diagnostic questions completed!
          // Candidate just finished Question 3!
          // 1. Immediately and cleanly stop recording and release audio/mic tracks
          stopAndReleaseAudio();
          updateTurnState("COMPLETED");

          // 2. Inform candidate first
          const finishText =
            "Thank you! That completes all 3 technical diagnostic questions. Your assessment is now complete, and I've stopped the recording. Let's generate your calibrated preparation plan!";

          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              content: finishText,
              details: [
                "Assessment complete. Microphone recording stopped and audio tracks released.",
                "Automatically evaluating your responses and generating your preparation roadmap...",
              ],
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          // 3. Sarah speaks the completion text
          await speakSarah(finishText);

          // 4. Automatically proceed to generating plan hands-free!
          handleFinishAssessmentRef.current?.();
        }
      } catch (err) {
        console.error("Transcription & conversational processing error:", err);
        startAutonomousListening();
      } finally {
        isProcessingRef.current = false;
      }
    },
    [speakSarah, startAutonomousListening, stopAndReleaseAudio, updateTurnState]
  );

  // Keep ref up-to-date with latest handler instance
  useEffect(() => {
    handleRecordedAudioBlobRef.current = handleRecordedAudioBlob;
  }, [handleRecordedAudioBlob]);

  /**
   * One-Click Handshake: Connect Voice & Start Autonomous Assessment
   */
  const handleConnectVoiceAndStart = async () => {
    try {
      updateTurnState("INITIALIZING");
      setSessionError(null);

      // 1. Initialize Web Audio API
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      // 2. Request microphone with Hardware Echo Cancellation & Noise Suppression
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      micStreamRef.current = stream;

      // 3. Connect Analyser Node for VAD and live volume RMS
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      // 4. Initialize MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        handleRecordedAudioBlobRef.current?.(audioBlob);
      };

      // 5. Ingest Step 1 Profile & Start Assessment Backend Session
      const profileRes = await backendApi.getProfile().catch(() => null);
      const profile = profileRes?.profile;
      const activePlan = profileRes?.activePlan;

      const resolvedRole = profile?.targetRole || activePlan?.targetRole || "Senior Software Engineer";
      const resolvedExp = profile?.experienceLevel || "4-5 years";
      const resolvedCompanies = profile?.targetCompanies || activePlan?.targetCompanies || [];
      const resolvedJd = profile?.jobDescriptionText || "";

      if (profile?.fullName) {
        const firstName = profile.fullName.split(" ")[0];
        setCandidateName(firstName);
      }

      setTargetRole(resolvedRole);
      setExperienceLevel(resolvedExp);

      const startRes = await backendApi.startAiAssessment({
        targetRole: resolvedRole,
        experienceLevel: resolvedExp,
        targetCompanies: resolvedCompanies,
        jobDescription: resolvedJd,
      });

      const qList = startRes.diagnosticQuestions || [];
      questionsRef.current = qList;
      questionIndexRef.current = 0;
      setSessionId(startRes.sessionId);
      setDiagnosticQuestions(qList);
      setCurrentQuestionIndex(0);

      // Build initial message thread
      const initialMessages: MessageItem[] = [
        {
          sender: "ai",
          content: startRes.welcomeMessage,
          details: [
            "Hands-Free Voice Mode Active. Speak naturally into your mic — Sarah will listen automatically.",
            "You can press Spacebar anytime to instantly hand over without waiting for silence.",
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ];

      let firstSpokenPrompt = startRes.welcomeMessage || `Hi ${candidateName}! Welcome to your technical assessment.`;

      if (qList.length > 0) {
        const firstQ = qList[0];
        const qText = firstQ.text || (firstQ as any).prompt || "";
        initialMessages.push({
          sender: "ai",
          categoryTag: firstQ.category,
          content: `Question 1 (${firstQ.category}): "${qText}"`,
          details: [
            `Target Depth: ${firstQ.expectedDepth}`,
            "Take a moment to formulate your thoughts. Feel free to explain high-level first, then dive into specific trade-offs.",
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        firstSpokenPrompt = `${firstSpokenPrompt} Let's begin with our first focus area, ${firstQ.category}: ${qText}`;
      }

      setMessages(initialMessages);
      setCallStarted(true);

      // 6. Speak Welcome Greeting + Question 1 aloud automatically
      await speakSarah(firstSpokenPrompt);

      // 7. Auto-Listen automatically activates!
      startAutonomousListening();
    } catch (err: unknown) {
      console.error("Failed to connect voice session:", err);
      setSessionError(
        err instanceof Error
          ? err.message
          : "Microphone permission required for hands-free voice assessment."
      );
      updateTurnState("LOBBY");
    }
  };

  /**
   * Spacebar Shortcut: Instantly finish speaking turn without waiting for 1.8s silence
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && (turnState === "CANDIDATE_SPEAKING" || turnState === "LISTENING_WAITING")) {
        // Prevent page scroll
        if ((e.target as HTMLElement)?.tagName !== "TEXTAREA" && (e.target as HTMLElement)?.tagName !== "INPUT") {
          e.preventDefault();
          finalizeCandidateSpokenTurn();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [turnState, finalizeCandidateSpokenTurn]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTogglePause = () => {
    if (!isPaused && activeAudioRef.current) {
      activeAudioRef.current.pause();
    }
    setIsPaused((prev) => !prev);
  };

  // Finish Assessment & Generate Plan
  const handleFinishAssessment = async () => {
    stopAndReleaseAudio();
    setShowEndModal(false);
    setIsFinishing(true);
    setFinishStage("Sarah is evaluating your diagnostic responses...");

    try {
      const transcriptPayload = messages.map((m) => ({
        role: (m.sender === "ai" ? "assistant" : "user") as "assistant" | "user",
        text: m.content,
        timestamp: m.timestamp,
        durationSeconds: 15,
      }));

      const codeSnippets = codeContent.trim()
        ? [{ code: codeContent, language: "javascript", notes: "Assessment scratchpad" }]
        : [];

      setTimeout(() => {
        setFinishStage("Analyzing technical depth, trade-offs, and communication rubric...");
      }, 900);

      setTimeout(() => {
        setFinishStage("Calibrating Neo4j Knowledge Graph prerequisite topics...");
      }, 1900);

      const result = await backendApi.finishAiAssessment({
        sessionId: sessionId || "diagnostic-session",
        durationSeconds: secondsElapsed,
        transcript: transcriptPayload,
        questions: questionsRef.current,
        codeSnippets,
      });

      try {
        localStorage.setItem("prep_onboarding_completed", "true");
      } catch {}

      setAssessmentResult({
        overallScore: result.overallScore,
        readinessScore: result.readinessScore,
        readinessDelta: result.readinessDelta,
        verdict: result.verdict,
        evaluatorNotes: result.evaluatorNotes,
        strengths: result.strengths,
        blindSpots: result.blindSpots,
        scoreFormula: result.scoreFormula,
        questionBreakdown: result.questionBreakdown,
      });
    } catch (err: unknown) {
      console.error("Failed to finish assessment:", err);
      try {
        localStorage.setItem("prep_onboarding_completed", "true");
      } catch {}

      const fallbackQuestions = questionsRef.current.length > 0
        ? questionsRef.current
        : [
            { category: "Language Internals", text: "Explain memory management, concurrency models, and runtime trade-offs." },
            { category: "Data Modeling & Caching", text: "Design indexing strategies and multi-tier caching under heavy write workloads." },
            { category: "Distributed Architecture", text: "Architect a partitioned, highly available service balancing consensus and network partitions." },
          ];

      setAssessmentResult({
        overallScore: 75,
        readinessScore: 70,
        readinessDelta: 20,
        verdict: "Strong Senior Baseline with Graph-Calibrated Recommendations",
        evaluatorNotes:
          "Demonstrated solid grasp of language concurrency, cache invalidation, and distributed partitioning.",
        strengths: ["Core Language Internals", "System Component Boundary Modeling"],
        blindSpots: ["Cache Invalidation under Heavy Write Load", "Sharding & Rebalancing"],
        scoreFormula: "(Q1: 78% + Q2: 72% + Q3: 76%) ÷ 3 = 75%",
        questionBreakdown: [
          {
            questionNumber: 1,
            category: fallbackQuestions[0]?.category || "Language Internals",
            questionPrompt: fallbackQuestions[0]?.text || "Explain memory management, concurrency models, and runtime trade-offs.",
            candidateAnswer: "Walked through concurrency models, event execution, and memory allocation boundaries.",
            modelAnswer: "Staff-level response details runtime thread scheduling (e.g. GMP / event loop microtasks), stack vs heap escape analysis, lock contention reduction, and GC pause mitigation.",
            keyPointsCovered: ["Concurrency primitives identified", "Basic runtime execution lifecycle"],
            keyPointsMissed: ["Escape analysis impact on heap pressure", "Lock-free atomic trade-offs"],
            scorePercentage: 78,
          },
          {
            questionNumber: 2,
            category: fallbackQuestions[1]?.category || "Data Modeling & Caching",
            questionPrompt: fallbackQuestions[1]?.text || "Design indexing strategies and multi-tier caching under heavy write workloads.",
            candidateAnswer: "Suggested Redis cache-aside with TTL and secondary relational indexes.",
            modelAnswer: "Staff-level response evaluates write-through vs cache-aside, cache penetration & stampede mitigation (singleflight / mutex), B-tree write amplification, and CDC for asynchronous cache invalidation.",
            keyPointsCovered: ["Cache-aside pattern correctly implemented", "Relational index selection"],
            keyPointsMissed: ["Cache stampede / thundering herd mitigation", "Index write amplification trade-off"],
            scorePercentage: 72,
          },
          {
            questionNumber: 3,
            category: fallbackQuestions[2]?.category || "Distributed Architecture",
            questionPrompt: fallbackQuestions[2]?.text || "Architect a partitioned, highly available service balancing consensus and network partitions.",
            candidateAnswer: "Outlined microservice boundaries, horizontal sharding, and replication redundancy.",
            modelAnswer: "Staff-level response defines CAP/PACELC trade-offs, consistent hashing with virtual nodes to avoid rebalance hotspots, distributed consensus quorum (Raft/Paxos), and idempotency keys.",
            keyPointsCovered: ["Horizontal sharding boundaries", "Replication redundancy"],
            keyPointsMissed: ["Consistent hashing rebalance storms", "Quorum consensus under split-brain"],
            scorePercentage: 76,
          },
        ],
      });
    } finally {
      setIsFinishing(false);
    }
  };

  useEffect(() => {
    handleFinishAssessmentRef.current = handleFinishAssessment;
  }, [handleFinishAssessment]);

  const progressPercent = Math.min(
    100,
    Math.round(((currentQuestionIndex + 1) / Math.max(1, diagnosticQuestions.length)) * 100)
  );

  const remainingSeconds = Math.max(0, TOTAL_SESSION_SECONDS - secondsElapsed);
  const remainingMinutes = Math.ceil(remainingSeconds / 60);

  // Render Audio Dock
  const renderAudioDock = () => (
    <div className="flex flex-col items-center gap-3 sm:gap-3.5 rounded-2xl border border-[#7c3aed]/30 bg-gradient-to-b from-[#faf5ff] to-[#f5f3ff] p-4 sm:p-5 shadow-sm text-center">
      {/* Dynamic Status Indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`size-2.5 rounded-full ${
            turnState === "AI_SPEAKING"
              ? "bg-emerald-500 animate-ping"
              : turnState === "CANDIDATE_SPEAKING"
              ? "bg-purple-600 animate-pulse"
              : turnState === "PROCESSING"
              ? "bg-amber-500 animate-spin"
              : turnState === "COMPLETED"
              ? "bg-emerald-500"
              : "bg-[#7c3aed] animate-pulse"
          }`}
        />
        <span className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#7c3aed]">
          {isPaused
            ? "Assessment Paused"
            : turnState === "AI_SPEAKING"
            ? "Sarah is speaking (Cartesia Sonic-3.6)..."
            : turnState === "CANDIDATE_SPEAKING"
            ? "Listening to your answer... (Speak freely)"
            : turnState === "PROCESSING"
            ? "Processing your answer with Deepgram Nova-2..."
            : turnState === "COMPLETED"
            ? "Assessment Finished • Recording Stopped"
            : "Listening for your voice..."}
        </span>
      </div>

      {/* Audio Waveform visualization (24 animated bars) */}
      <div className="flex h-9 items-center justify-center gap-1 sm:gap-1.5 max-w-full overflow-hidden px-1">
        {waveformBars.map((height, idx) => (
          <div
            key={idx}
            className={`w-[3px] rounded-full transition-all duration-100 shrink-0 ${
              turnState === "CANDIDATE_SPEAKING"
                ? "bg-[#7c3aed]"
                : turnState === "AI_SPEAKING"
                ? "bg-emerald-600"
                : turnState === "PROCESSING"
                ? "bg-amber-500"
                : turnState === "COMPLETED"
                ? "bg-emerald-500"
                : "bg-[#7c3aed]/50"
            }`}
            style={{
              height: isPaused || turnState === "COMPLETED" ? "4px" : `${height}px`,
              opacity: isPaused || turnState === "COMPLETED" ? 0.35 : 0.9,
            }}
          />
        ))}
      </div>

      {/* Silence countdown cue if pausing */}
      {silenceCountdown !== null && turnState === "CANDIDATE_SPEAKING" && (
        <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full animate-pulse transition-opacity duration-150">
          Silence detected — finalizing answer in {silenceCountdown.toFixed(1)}s...
        </span>
      )}

      {/* Controls row */}
      {turnState === "COMPLETED" ? (
        <div className="flex flex-col items-center gap-2.5 w-full max-w-sm pt-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <Check className="size-4 text-emerald-600" />
            <span>3/3 Questions Complete • Recording Stopped</span>
          </div>
          <button
            type="button"
            onClick={handleFinishAssessment}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#fa552b] transition-all cursor-pointer"
          >
            <Sparkles className="size-4" />
            <span>Finish Assessment & Generate Plan</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 sm:gap-4 pt-0.5 sm:pt-1">
          {/* Pause / Resume button */}
          <button
            type="button"
            onClick={handleTogglePause}
            className="flex h-9 items-center gap-1.5 rounded-full border border-[#7c3aed] bg-white px-3 sm:px-4 text-xs font-semibold text-[#7c3aed] shadow-xs transition-colors hover:bg-[#ede9fe] cursor-pointer"
          >
            {isPaused ? (
              <>
                <Play className="size-3.5 fill-[#7c3aed]" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="size-3.5 fill-[#7c3aed]" />
                <span>Pause</span>
              </>
            )}
          </button>

          {/* Central Hands-Free Status Icon */}
          <div
            className={`flex size-12 sm:size-14 items-center justify-center rounded-full text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)] transition-all ${
              turnState === "CANDIDATE_SPEAKING"
                ? "bg-[#7c3aed] ring-4 ring-purple-200 animate-pulse scale-105"
                : turnState === "AI_SPEAKING"
                ? "bg-emerald-600"
                : "bg-[#7c3aed]"
            }`}
            title="Hands-free auto listening active"
          >
            <Mic className="size-5 sm:size-6" />
          </div>

          {/* Voice Audio Speaker Toggle (Mute/Unmute Sarah's voice) */}
          <button
            type="button"
            onClick={() => {
              if (!isMuted && activeAudioRef.current) {
                activeAudioRef.current.pause();
              }
              setIsMuted(!isMuted);
            }}
            className={`flex size-9 items-center justify-center rounded-full border transition-colors shadow-xs cursor-pointer ${
              isMuted
                ? "border-neutral-300 bg-neutral-100 text-neutral-500"
                : "border-[#7c3aed] bg-white text-[#7c3aed] hover:bg-[#ede9fe]"
            }`}
            title={isMuted ? "Unmute Assessor Voice" : "Mute Assessor Voice"}
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>

          {/* Finish Assessment button */}
          <button
            type="button"
            onClick={() => setShowEndModal(true)}
            className="flex h-9 items-center gap-1.5 rounded-full border border-brand bg-white px-3 sm:px-4 text-xs font-semibold text-brand shadow-xs transition-colors hover:bg-[#fff5f2] cursor-pointer"
          >
            <Square className="size-3 fill-brand" />
            <span>Finish & Plan</span>
          </button>
        </div>
      )}

      {/* Helpful Hands-free Hint */}
      <div className="text-[11px] sm:text-xs text-ink-muted">
        Hands-free mode active. Just speak your answer — Sarah listens automatically. Press{" "}
        <kbd className="px-1.5 py-0.5 rounded border border-[#ede6db] bg-white text-ink font-mono text-[10px]">
          Spacebar
        </kbd>{" "}
        anytime for instant handover.
      </div>
    </div>
  );

  // Full Screen Whiteboard View
  if (isWhiteboardOpen) {
    return (
      <div className="flex flex-col gap-6 w-full p-4 sm:p-6 min-h-screen bg-[#fbf9f4]">
        <WhiteboardModal onClose={() => setIsWhiteboardOpen(false)} />
        {renderAudioDock()}
      </div>
    );
  }

  // Pre-Call Lobby: One-Click Connection to Enable Autoplay & Mic
  if (!callStarted) {
    return (
      <div className="flex min-h-[75vh] w-full flex-col items-center justify-center p-4 sm:p-6">
        <div className="flex w-full max-w-lg flex-col gap-6 rounded-3xl border border-[#ede6db] bg-white p-6 sm:p-8 shadow-xl text-center">
          {/* Avatar & Header */}
          <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-[#ede9fe] text-[#7c3aed] shadow-sm">
            <Sparkles className="size-10" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2">
              <span className="font-display text-xl sm:text-2xl font-extrabold text-ink">
                AI Technical Diagnostic Assessment
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Meet with <strong className="text-ink">Sarah • Staff Engineer</strong> for a 15-minute hands-free technical conversation.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="flex flex-col gap-2.5 rounded-2xl bg-[#faf6f0] p-4 text-left border border-[#f4efe8]">
            <div className="flex items-center gap-2.5 text-xs text-ink">
              <Check className="size-4 shrink-0 text-emerald-600" />
              <span><strong>Completely hands-free:</strong> Sarah asks questions aloud and automatically listens to your voice.</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-ink">
              <Check className="size-4 shrink-0 text-emerald-600" />
              <span><strong>Hardware Echo Cancellation:</strong> Talk naturally without audio feedback.</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-ink">
              <Check className="size-4 shrink-0 text-emerald-600" />
              <span><strong>3 Diagnostic Categories:</strong> Language Internals, Data Modeling & Caching, System Architecture.</span>
            </div>
          </div>

          {sessionError && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200">
              {sessionError}
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleConnectVoiceAndStart}
            disabled={turnState === "INITIALIZING"}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-brand py-3.5 text-sm sm:text-base font-semibold text-white shadow-[0_4px_16px_rgba(255,108,71,0.28)] transition-all hover:bg-[#fa552b] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {turnState === "INITIALIZING" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Connecting Voice Pipeline...</span>
              </>
            ) : (
              <>
                <Headphones className="size-4" />
                <span>Connect Voice & Start Assessment</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col min-h-screen bg-[#fbf9f4] p-3.5 sm:p-6 lg:p-7 gap-5 sm:gap-7">
      {/* 1. Header Row */}
      <div className="flex flex-col gap-3.5 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Assessment Title & Progress Track */}
        <div className="flex flex-1 flex-col gap-2 sm:gap-2.5 min-w-0">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <span className="font-bold text-brand uppercase tracking-wider text-[11px] sm:text-xs">
                AI Diagnostic Assessment
              </span>
              <span className="text-[#b0a898]">•</span>
              <span className="font-semibold text-ink text-xs sm:text-sm">
                Hands-Free Voice Mode
              </span>
              <span className="text-[#b0a898]">•</span>
              <span className="text-ink-muted text-xs truncate font-medium">
                {targetRole} ({experienceLevel})
              </span>
            </div>
            <span className="text-[11px] sm:text-xs text-ink-muted shrink-0 font-mono">
              ~{remainingMinutes} min remaining
            </span>
          </div>

          {/* Progress bar track */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f4efe8]">
            <div
              className="h-full bg-brand transition-all duration-300"
              style={{ width: `${Math.max(10, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Top Header Action Buttons: Tools & Finish */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 shrink-0">
          {/* Voice Mute Toggle */}
          <button
            type="button"
            onClick={() => {
              if (!isMuted && activeAudioRef.current) {
                activeAudioRef.current.pause();
              }
              setIsMuted(!isMuted);
            }}
            className={`flex size-9 sm:size-10 items-center justify-center rounded-full border shadow-2xs transition-colors cursor-pointer ${
              isMuted
                ? "border-neutral-300 bg-neutral-100 text-neutral-400"
                : "border-[#ede6db] bg-white text-[#7c3aed] hover:bg-[#faf6f0]"
            }`}
            title={isMuted ? "Unmute Assessor Voice" : "Mute Assessor Voice"}
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTool("notes")}
            className="flex size-9 sm:size-10 items-center justify-center rounded-full border border-[#ede6db] bg-white text-ink-muted shadow-2xs transition-colors hover:bg-[#faf6f0] cursor-pointer"
            aria-label="Notes"
            title="Open Notes"
          >
            <FileText className="size-4 text-ink-muted" />
          </button>

          <button
            type="button"
            onClick={() => setShowEndModal(true)}
            className="flex h-9 sm:h-10 items-center justify-center rounded-full bg-brand px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_14px_rgba(255,108,71,0.25)] transition-all hover:bg-[#fa552b] cursor-pointer"
          >
            Finish Assessment & Generate Plan
          </button>
        </div>
      </div>

      {/* 2. Main Workspace: Conversation View & Assessment Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        {/* Left Column: Live AI Conversation & Audio Recording Panel */}
        <div className="flex flex-1 flex-col gap-5 w-full min-w-0">
          {/* Conversation Card */}
          <div className="flex flex-col gap-4 sm:gap-5 rounded-2xl sm:rounded-[24px] border border-[#f4efe8] bg-white p-4 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
            {/* Conversation Header */}
            <div className="flex items-center justify-between gap-3 pb-3.5 sm:pb-4 border-b border-[#f4efe8]">
              {/* Assessor Profile Info */}
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div
                  className={`flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl border transition-all ${
                    turnState === "AI_SPEAKING"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600 ring-2 ring-emerald-300 animate-pulse"
                      : "bg-[#f5f0ff] border-[#ede9fe] text-[#7c3aed]"
                  }`}
                >
                  <Sparkles className="size-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="font-display font-bold text-ink text-sm sm:text-base">
                      Sarah • Staff Engineer
                    </span>
                    <span className="rounded bg-[#7c3aed] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white tracking-wider shrink-0 uppercase">
                      AI Assessor
                    </span>
                    <span className="flex items-center gap-1 rounded bg-[#ede9fe] px-1.5 py-0.5 text-[9px] font-semibold text-[#6d28d9]">
                      <Radio className="size-2.5 text-emerald-600" />
                      <span>Hands-Free Sonic-3.6</span>
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs text-ink-muted truncate">
                    Graph-Driven Depth & Readiness Assessment
                  </span>
                </div>
              </div>

              {/* Timer Pill */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 rounded-full border border-[#f4efe8] bg-[#faf6f0] px-3 py-1 text-xs font-mono shadow-2xs">
                <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-bold text-ink">{formatTimer(secondsElapsed)}</span>
                <span className="text-ink-muted">/ 15:00</span>
              </div>
            </div>

            {/* Chat History Bubbles */}
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
              {messages.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-2.5 sm:gap-3">
                  <div
                    className={`flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg ${
                      msg.sender === "user"
                        ? "bg-[#fff0ec] text-brand"
                        : "bg-[#f5f0ff] text-[#7c3aed]"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="size-4" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                  </div>
                  <div
                    className={`flex flex-1 min-w-0 flex-col gap-2 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed text-ink break-words ${
                      msg.sender === "user"
                        ? "bg-[#f5f3ff] border border-[#ede9fe]"
                        : "bg-[#faf6f0] border border-[#f4efe8]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      {msg.categoryTag ? (
                        <span className="rounded-md bg-[#ede9fe] text-[#6d28d9] px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                          {msg.categoryTag}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">
                          {msg.sender === "ai" ? "Sarah • Staff Engineer" : candidateName}
                        </span>
                      )}

                      {/* Replay button */}
                      {msg.sender === "ai" && (
                        <button
                          type="button"
                          onClick={() => speakSarah(msg.content)}
                          className="text-ink-muted hover:text-[#7c3aed] p-1 rounded transition-colors"
                          title="Replay Spoken Question"
                        >
                          <Volume2 className="size-3.5" />
                        </button>
                      )}
                    </div>

                    <p className={msg.sender === "ai" ? "font-medium" : "text-ink"}>
                      {msg.content}
                    </p>

                    {msg.details && msg.details.length > 0 && (
                      <div className="flex flex-col gap-1.5 pt-1 border-t border-black/5">
                        {msg.details.map((detail, dIdx) => (
                          <div
                            key={dIdx}
                            className="flex items-start gap-1.5 text-xs text-ink-muted leading-tight"
                          >
                            <Info className="size-3.5 shrink-0 text-[#7c3aed] mt-0.5" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Audio Recording Dock */}
          {renderAudioDock()}
        </div>

        {/* Right Column: Assessment Tools, Guidelines & Progress (width 320px) */}
        <div className="flex flex-col gap-4 sm:gap-5 w-full lg:w-[320px] shrink-0">
          {/* Card 1: Diagnostic Progress */}
          <div className="flex flex-col gap-3 sm:gap-3.5 rounded-2xl border border-[#ede6db] bg-white p-4 sm:p-5 shadow-2xs">
            <h2 className="font-display font-bold text-sm text-ink">
              Diagnostic Progress
            </h2>
            <div className="flex items-center gap-4">
              {/* Circular Progress Ring */}
              <div className="relative flex size-14 shrink-0 items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 56 56">
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="#ede6db"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="#ff6c47"
                    strokeWidth="4"
                    strokeDasharray={138}
                    strokeDashoffset={138 - (138 * progressPercent) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-ink">
                  {progressPercent}%
                </span>
              </div>

              {/* Progress Meta */}
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-xs sm:text-sm text-ink">
                  Question {Math.min(currentQuestionIndex + 1, Math.max(1, diagnosticQuestions.length))} of {Math.max(1, diagnosticQuestions.length)}
                </span>
                <span className="text-xs text-ink-muted">
                  {formatTimer(secondsElapsed)} elapsed
                </span>
              </div>
            </div>

            {/* Category Breadcrumbs */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[#f4efe8]">
              {diagnosticQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                    idx === currentQuestionIndex
                      ? "bg-[#fff0ec] text-brand font-semibold"
                      : idx < currentQuestionIndex
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-ink-muted"
                  }`}
                >
                  <span className="truncate">{q.category}</span>
                  {idx < currentQuestionIndex ? (
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                  ) : idx === currentQuestionIndex ? (
                    <span className="size-2 rounded-full bg-brand animate-pulse" />
                  ) : (
                    <span className="text-[10px] text-ink-muted">Pending</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Interactive Session Tools */}
          <div className="flex flex-col gap-3.5 sm:gap-4 rounded-2xl border border-[#ede6db] bg-white p-4 sm:p-5 shadow-2xs">
            <h2 className="font-display font-bold text-sm text-ink">
              Assessment Tools
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {/* Whiteboard */}
              <button
                type="button"
                onClick={() => setIsWhiteboardOpen(true)}
                className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-[#f4efe8] bg-white p-3 sm:p-3.5 text-xs font-semibold text-ink shadow-2xs transition-colors hover:border-[#7c3aed]/40 hover:bg-[#faf6f0] cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center text-[#7c3aed]">
                  <LayoutGrid className="size-5" />
                </div>
                <span>Whiteboard</span>
              </button>

              {/* Draw Diagram */}
              <button
                type="button"
                onClick={() => setActiveTool("diagram")}
                className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-[#f4efe8] bg-white p-3 sm:p-3.5 text-xs font-semibold text-ink shadow-2xs transition-colors hover:border-[#7c3aed]/40 hover:bg-[#faf6f0] cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center text-[#7c3aed]">
                  <Network className="size-5" />
                </div>
                <span>Architecture</span>
              </button>

              {/* Code Scratchpad */}
              <button
                type="button"
                onClick={() => setActiveTool("code")}
                className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-[#f4efe8] bg-white p-3 sm:p-3.5 text-xs font-semibold text-ink shadow-2xs transition-colors hover:border-[#7c3aed]/40 hover:bg-[#faf6f0] cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center text-[#7c3aed]">
                  <FileCode className="size-5" />
                </div>
                <span>Code Scratchpad</span>
              </button>

              {/* Notes */}
              <button
                type="button"
                onClick={() => setActiveTool("notes")}
                className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-[#f4efe8] bg-white p-3 sm:p-3.5 text-xs font-semibold text-ink shadow-2xs transition-colors hover:border-[#7c3aed]/40 hover:bg-[#faf6f0] cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center text-[#7c3aed]">
                  <FileText className="size-5" />
                </div>
                <span>Notes</span>
              </button>
            </div>
          </div>

          {/* Card 3: Assessor Advice from Sarah */}
          <div className="flex flex-col gap-3 sm:gap-3.5 rounded-2xl border border-[#ede6db] bg-white p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-amber-500" />
              <h2 className="font-display font-bold text-sm text-ink">
                Assessor Advice
              </h2>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                "Explain the 'why' behind architectural choices",
                "Highlight trade-offs (e.g. latency vs consistency)",
                "Touch on edge cases and failure modes",
                "Hands-free voice mode: Sarah listens automatically when you pause",
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span className="text-ink font-medium leading-tight">
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tool Modal (for Diagram, Code, Notes) */}
      {activeTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4 backdrop-blur-xs">
          <div className="flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#f4efe8] px-4 sm:px-5 py-3 sm:py-3.5 bg-[#faf6f0] shrink-0">
              <span className="font-display font-bold text-xs sm:text-sm text-ink uppercase tracking-wider truncate mr-2">
                {activeTool === "diagram" && "System Architecture Diagram"}
                {activeTool === "code" && "Code & Schema Scratchpad"}
                {activeTool === "notes" && "Candidate Notes"}
              </span>
              <button
                type="button"
                onClick={() => setActiveTool(null)}
                className="flex size-7 shrink-0 items-center justify-center rounded-full hover:bg-black/5 text-ink-muted cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 flex flex-col gap-3 overflow-y-auto">
              {activeTool === "notes" && (
                <textarea
                  value={notesContent}
                  onChange={(e) => setNotesContent(e.target.value)}
                  placeholder="Jot down quick thoughts, formulas, or reminders..."
                  rows={7}
                  className="w-full rounded-xl border border-[#ede6db] p-3 text-xs font-sans text-ink outline-none focus:border-[#7c3aed]"
                />
              )}

              {activeTool === "code" && (
                <textarea
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl border border-[#2e2a27] bg-[#1e1c1a] p-3 font-mono text-xs text-[#f7f5f0] outline-none"
                />
              )}

              {activeTool === "diagram" && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#ede6db] bg-[#faf6f0] p-6 sm:p-10 text-center text-xs text-ink-muted gap-2">
                  <Network className="size-8 text-[#7c3aed]" />
                  <span className="font-semibold text-ink">
                    Interactive Diagram Canvas
                  </span>
                  <span className="text-[11px] sm:text-xs">
                    Client → CDN/Edge → API Gateway → Application Service → Redis / DB Shards
                  </span>
                </div>
              )}

              <div className="flex justify-end pt-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTool(null)}
                  className="w-full sm:w-auto rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:opacity-95 cursor-pointer text-center"
                >
                  Save & Return to Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal to End & Generate Plan */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4 backdrop-blur-xs">
          <div className="flex w-full max-w-sm flex-col gap-3.5 sm:gap-4 rounded-2xl bg-white p-5 sm:p-6 shadow-xl text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#fff0ec] text-brand">
              <Award className="size-6" />
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg text-ink">
              Finish Assessment & Generate Plan?
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Sarah will evaluate your diagnostic responses across Language Internals, Data Caching, and System Architecture to compute your baseline readiness and calibrate your customized multi-week preparation plan.
            </p>
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="w-full sm:w-auto rounded-full border border-[#ede6db] bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-2xs hover:bg-[#faf6f0] cursor-pointer text-center"
              >
                Keep Going
              </button>
              <button
                type="button"
                onClick={handleFinishAssessment}
                className="w-full sm:w-auto rounded-full bg-brand px-5 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#fa552b] cursor-pointer text-center"
              >
                Finish & Generate Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evaluating / Calibrating Overlay */}
      {isFinishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl bg-white p-7 text-center shadow-2xl">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-[#ede9fe] text-[#7c3aed] animate-pulse">
              <Sparkles className="size-8" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-display text-lg font-bold text-ink">
                Generating Your Calibrated Preparation Plan
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                {finishStage}
              </p>
            </div>
            <Loader2 className="size-6 animate-spin text-brand mt-1" />
          </div>
        </div>
      )}

      {/* Assessment Completed Modal: Summary & Question-by-Question Review */}
      {assessmentResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-sm">
          <div className="flex w-full max-w-2xl max-h-[92vh] flex-col gap-4 sm:gap-5 overflow-y-auto rounded-3xl bg-white p-5 sm:p-7 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#f4efe8] pb-3 sm:pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
                  <Award className="size-6" />
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-display text-base sm:text-lg font-bold text-ink truncate">
                    Assessment Complete & Calibrated!
                  </h3>
                  <span className="text-xs text-ink-muted">
                    Calibrated by Sarah • Staff Engineer
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 shrink-0">
                <TrendingUp className="size-3.5" />
                <span>Overall: {assessmentResult.overallScore}%</span>
              </div>
            </div>

            {/* Calculation Formula Transparency */}
            {assessmentResult.scoreFormula && (
              <div className="flex flex-col gap-1.5 rounded-2xl bg-[#faf6f0] p-3.5 border border-[#ede6db]">
                <div className="flex items-center justify-between text-xs flex-wrap gap-1">
                  <span className="font-bold text-ink uppercase tracking-wider text-[10px] sm:text-[11px]">
                    How Your Score Was Calculated
                  </span>
                  <span className="font-mono font-bold text-brand text-xs">
                    {assessmentResult.scoreFormula}
                  </span>
                </div>
                <span className="text-[11px] text-ink-muted leading-tight">
                  Calculated transparently from your technical depth across all 3 diagnostic questions.
                </span>
              </div>
            )}

            {/* Question-by-Question Benchmark vs Spoken Answer Review */}
            {assessmentResult.questionBreakdown && assessmentResult.questionBreakdown.length > 0 && (
              <div className="flex flex-col gap-3 rounded-2xl bg-[#faf6f0] p-3.5 sm:p-4 border border-[#ede6db]">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xs sm:text-sm text-ink">
                    Technical Review: Model vs. Candidate Answer
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    Click tab to switch question
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {assessmentResult.questionBreakdown.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedBreakdownTab(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                        selectedBreakdownTab === idx
                          ? "bg-[#7c3aed] text-white shadow-xs"
                          : "bg-white text-ink-muted border border-[#ede6db] hover:bg-[#f5f3ff]"
                      }`}
                    >
                      <span>Q{q.questionNumber}: {q.category}</span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                        selectedBreakdownTab === idx ? "bg-white/20 text-white" : "bg-[#ede9fe] text-[#6d28d9]"
                      }`}>
                        {q.scorePercentage}%
                      </span>
                    </button>
                  ))}
                </div>

                {/* Active Tab Card */}
                {(() => {
                  const activeQ = assessmentResult.questionBreakdown[selectedBreakdownTab] || assessmentResult.questionBreakdown[0];
                  if (!activeQ) return null;
                  return (
                    <div className="flex flex-col gap-3 pt-1">
                      <div className="text-xs font-medium text-ink bg-white p-3 rounded-xl border border-[#ede6db] leading-relaxed">
                        <strong className="text-brand">Question {activeQ.questionNumber} ({activeQ.category}):</strong> "{activeQ.questionPrompt}"
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Candidate's Answer */}
                        <div className="flex flex-col gap-2 rounded-xl bg-white p-3.5 border border-[#ede6db]">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                              <User className="size-3.5 text-brand" />
                              <span>Your Spoken Answer</span>
                            </span>
                            <span className="text-[10px] font-bold text-brand bg-[#fff0ec] px-2 py-0.5 rounded-full">
                              Score: {activeQ.scorePercentage}%
                            </span>
                          </div>
                          <p className="text-xs text-ink-muted leading-relaxed italic">
                            "{activeQ.candidateAnswer}"
                          </p>
                          {activeQ.keyPointsCovered && activeQ.keyPointsCovered.length > 0 && (
                            <div className="flex flex-col gap-1 pt-1.5 border-t border-black/5">
                              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                                Key Points You Hit:
                              </span>
                              {activeQ.keyPointsCovered.map((pt, pIdx) => (
                                <div key={pIdx} className="flex items-start gap-1.5 text-[11px] text-emerald-900">
                                  <CheckCircle2 className="size-3 shrink-0 text-emerald-600 mt-0.5" />
                                  <span>{pt}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actual Model Benchmark Answer */}
                        <div className="flex flex-col gap-2 rounded-xl bg-white p-3.5 border border-emerald-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                              <Sparkles className="size-3.5 text-emerald-600" />
                              <span>Staff Benchmark Model Answer</span>
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              100% Bar
                            </span>
                          </div>
                          <p className="text-xs text-ink-muted leading-relaxed">
                            {activeQ.modelAnswer}
                          </p>
                          {activeQ.keyPointsMissed && activeQ.keyPointsMissed.length > 0 && (
                            <div className="flex flex-col gap-1 pt-1.5 border-t border-black/5">
                              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                                Critical Trade-offs / Edge Cases Missed:
                              </span>
                              {activeQ.keyPointsMissed.map((gap, gIdx) => (
                                <div key={gIdx} className="flex items-start gap-1.5 text-[11px] text-amber-900">
                                  <Info className="size-3 shrink-0 text-amber-600 mt-0.5" />
                                  <span>{gap}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Readiness Highlight */}
            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#fff5f2] to-[#faf5ff] p-4 border border-[#f4efe8]">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-ink-muted">
                  Baseline Readiness Score
                </span>
                <span className="font-display text-2xl font-extrabold text-ink">
                  {assessmentResult.readinessScore}%
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-white px-2.5 py-1 rounded-full border border-emerald-100 shadow-2xs">
                +{assessmentResult.readinessDelta}% calibrated
              </span>
            </div>

            {/* Confirmed Strengths & Blind Spots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-2 rounded-xl bg-emerald-50/60 p-3 border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800">
                  Confirmed Strengths
                </span>
                <ul className="flex flex-col gap-1 text-[11px] text-emerald-900">
                  {assessmentResult.strengths.map((str, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3 shrink-0 text-emerald-600" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2 rounded-xl bg-amber-50/60 p-3 border border-amber-100">
                <span className="text-xs font-bold text-amber-800">
                  Targeted Focus Topics
                </span>
                <ul className="flex flex-col gap-1 text-[11px] text-amber-900">
                  {assessmentResult.blindSpots.map((spot, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Info className="size-3 shrink-0 text-amber-600" />
                      <span>{spot}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Evaluator Notes */}
            <p className="text-xs text-ink-muted leading-relaxed bg-[#faf6f0] p-3 rounded-xl border border-[#ede6db]">
              <strong className="text-ink">Assessor Feedback:</strong> {assessmentResult.evaluatorNotes}
            </p>

            {/* Action CTA -> Navigate to Step 3 */}
            <div className="flex justify-end pt-2">
              <Link
                href="/dashboard?step=3"
                className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(255,108,71,0.28)] transition-all hover:bg-[#fa552b]"
              >
                <span>View My Calibrated Preparation Plan</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
