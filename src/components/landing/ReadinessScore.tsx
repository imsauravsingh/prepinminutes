import { PrepSection } from "./journey/PrepSection";
import { RevealOnView } from "./RevealOnView";
import { ReadinessDial } from "./motion/ReadinessDial";

export function ReadinessScore() {
  return (
    <PrepSection
      step={4}
      kicker="The scoreboard"
      title="Know where you stand before the interview"
      intro="No more gut feelings. Your Readiness Score shows exactly how close you are. Drag the ring to see how each skill moves with it."
    >
      <RevealOnView className="w-full">
        <ReadinessDial />
      </RevealOnView>
    </PrepSection>
  );
}
