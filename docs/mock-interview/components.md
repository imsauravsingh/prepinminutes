# Mock Interview — Component Contracts & Interfaces

This document specifies the primary component contracts in `src/components/mock-interview/`.

---

## 1. Component List & Props

### `InterviewConfigurationForm`
```tsx
interface InterviewConfigurationFormProps {
  config: InterviewConfiguration;
  onChange: (updated: InterviewConfiguration) => void;
}
```
- Manages type selector, target role dropdown, difficulty level pills, duration selector, and focus area tags.

### `ConfigurationPreviewCard`
```tsx
interface ConfigurationPreviewCardProps {
  config: InterviewConfiguration;
}
```
- Sticky on desktop (`lg:sticky lg:top-6`), naturally stacked on mobile.

### `HowTheInterviewWorksSection`
- Renders responsive 5-stage workflow diagram (vertical timeline on mobile with `ArrowDown`, horizontal with `ArrowRight` on desktop).

### `MockInterviewSessionWorkspace`
```tsx
export function MockInterviewSessionWorkspace(): JSX.Element;
```
- Manages 45-minute countdown, audio waveform dock, inline text form, whiteboard launcher, interview tips, and end confirmation modal.

### `MockSystemDesignEvaluationWorkspace`
```tsx
export function MockSystemDesignEvaluationWorkspace(): JSX.Element;
```
- Renders overall score gauge (84/100), readiness growth (+6%), 6-dimension scoring grid, qualitative strengths and weaknesses, milestone progression, and follow-up drill cards.
