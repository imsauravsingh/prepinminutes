# Practice Module — Session State Machine & Timers

This document specifies the lifecycle states, timer ticks, and submission flow for interactive practice drills.

---

## 1. Practice Session State Machine

```mermaid
stateDiagram-v2
    [*] --> TOPIC_SELECTED: User clicks topic
    TOPIC_SELECTED --> SESSION_ACTIVE: Workspace loads
    
    state SESSION_ACTIVE {
        [*] --> RECORDING_LISTENING
        RECORDING_LISTENING --> RECORDING_PAUSED: User clicks Pause
        RECORDING_PAUSED --> RECORDING_LISTENING: User clicks Resume
        RECORDING_LISTENING --> TEXT_MODE: User switches to text
        TEXT_MODE --> RECORDING_LISTENING: User switches to voice
    }
    
    SESSION_ACTIVE --> WHITEBOARD_OPEN: User launches Whiteboard
    WHITEBOARD_OPEN --> SESSION_ACTIVE: User closes Whiteboard
    
    SESSION_ACTIVE --> CONFIRM_END: User clicks "End Session" / Stop
    CONFIRM_END --> SESSION_ACTIVE: User clicks "Continue Session"
    CONFIRM_END --> SUBMITTING_EVAL: User clicks "End Now & View Report"
    
    SUBMITTING_EVAL --> EVALUATION_DISPLAYED: Report loaded
```

---

## 2. Timer Management & Session Resume

- **Elapsed Timer**: Runs every 1000ms using `setInterval` while `!isPaused`.
- **Display**: Formatted via `formatTimer(secondsElapsed) / 45:00` with pulsing red dot when active.
- **Persistence**: Periodically stores `practice_session_seconds` to sessionStorage so that an accidental browser refresh does not reset elapsed interview time.
