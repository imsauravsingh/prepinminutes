# Mock Interview — State Machine & Session Lifecycle

This document defines the state transitions across the 4 mock interview phases.

---

## 1. Mock Interview Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> CONFIGURING: User visits /mock-interview/configure
    CONFIGURING --> BRIEFING: User clicks "Continue to Briefing"
    BRIEFING --> IN_INTERVIEW: User clicks "Start Interview"

    state IN_INTERVIEW {
        [*] --> RECORDING_ACTIVE
        RECORDING_ACTIVE --> RECORDING_PAUSED: User clicks Pause
        RECORDING_PAUSED --> RECORDING_ACTIVE: User clicks Resume
        RECORDING_ACTIVE --> TEXT_TYPING: User clicks switch to text
        TEXT_TYPING --> RECORDING_ACTIVE: User submits message
    }

    IN_INTERVIEW --> CONFIRM_END: User clicks "End Interview" or timer reaches 45m
    CONFIRM_END --> IN_INTERVIEW: User cancels
    CONFIRM_END --> EVALUATING: User confirms "End Now & View Report"

    EVALUATING --> EVALUATED: Evaluation report renders at /mock-interview/system-design/evaluation
```

---

## 2. Timer & Audio Waveform Rules

- **Total Duration**: Initialized to 45:00 (`45 * 60` seconds).
- **Elapsed Counter**: Increments every 1000ms via `setInterval` when `!isPaused`.
- **Waveform Animation**: 24 animated frequency bars (`WAVEFORM_HEIGHTS`) transitioning dynamically; bars flatten to `4px` with `0.4` opacity when paused.
- **Audio Dock Container**: Bounded with `overflow-hidden` and `shrink-0` on bars to prevent mobile horizontal blowout.
