# Voice AI Agent Architecture — Deepgram Nova-2 & Cartesia Sonic-3.6

This document specifies the real-time voice pipeline connecting the frontend workspace (`/ai-assessment/session` & `/mock-interview/interview-session`) to the Cloudflare Workers / Node backend services.

---

## 1. Provider Credentials & Configurations

### A. Deepgram (Speech-to-Text — STT)
- **Model**: `nova-2`
- **Friendly Name**: `Jim`
- **Project ID**: `93a7057e-3816-4945-9fda-8f3b1952e5ef`
- **Secret / API Key**: Configured in `.env` as `DEEPGRAM_API_KEY`
- **Capabilities**:
  - Sub-80ms real-time streaming WebSocket (`wss://api.deepgram.com/v1/listen?model=nova-2`)
  - Direct REST buffer transcription endpoint (`/api/voice/transcribe`)
  - Automatic punctuation, formatting, and high-accuracy technical vocabulary recognition

### B. Cartesia (Text-to-Speech — TTS)
- **Model**: `sonic-3.6` (Upgraded from deprecated `sonic-english`)
- **API Key**: Configured in `.env` as `CARTESIA_API_KEY`
- **Interviewer Persona**: `Sarah • Staff Engineer` (Voice ID: `694f9389-aac1-45b6-b726-9d9369183238`)
- **Output Container**: `wav` (linear16 PCM, 24kHz sample rate)
  - Enables instant browser-native playback via `URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }))`
- **Latency**: Sub-60ms Time-to-First-Byte (TTFB)

---

## 2. Bi-Directional Conversational Loop

```
[Candidate Voice] ──► [Browser MediaRecorder / Web Audio]
                             │
                             ▼
                    POST /api/voice/transcribe
                             │
                             ▼
                    [Deepgram Nova-2 STT]
                             │
                             ▼ (Accurate text + confidence score)
                 [AI Assessor Prompt & Evaluator]
                             │
                             ▼ (Sarah's conversational response)
                    POST /api/voice/synthesize
                             │
                             ▼
                   [Cartesia Sonic-3.6 TTS]
                             │
                             ▼ (audio/wav bytes)
             [Browser Audio Playback + Animated Waveform]
```

---

## 3. Sub-100ms Turn-Taking & Barge-In Controller

When candidate begins speaking while Sarah is speaking:
1. Client audio detection immediately triggers `audio.pause()`.
2. Backend `VoiceTurnController` transitions state from `AI_SPEAKING` to `CANDIDATE_SPEAKING` within `<15ms`.
3. Outbound audio buffers are flushed, preventing audio overlapping and delivering an authentic conversational human interviewer experience.

---

## 4. Autonomous Hands-Free Voice State Machine

The `/ai-assessment/session` workspace operates on a zero-click autonomous loop:

1. **Lobby Handshake**: Single click on *"Connect Voice & Start Assessment"* activates browser `AudioContext` and grants microphone permissions with hardware `echoCancellation`, `noiseSuppression`, and `autoGainControl`.
2. **Spoken Turn**: Sarah speaks her opening greeting + diagnostic questions aloud via Cartesia Sonic-3.6.
3. **Auto-Listening Handover**: On `audio.onended`, the microphone automatically transitions to listening mode. Zero buttons are clicked.
4. **VAD Silence Detection**: An `AudioContext.createAnalyser()` tracks vocal Root Mean Square (RMS). When the candidate speaks, the waveform bounces to their voice. When candidate finishes speaking, a **1.8-second silence timer** automatically finalizes the recording and sends it to Deepgram Nova-2.
5. **Spacebar Instant Handover**: Pressing `Spacebar` while speaking triggers an immediate handover to Sarah without waiting for the 1.8s silence.
6. **Conversational Clarifications**: If candidate says *"Can you repeat the question?"*, Sarah detects this intent and re-reads the question without penalty.


