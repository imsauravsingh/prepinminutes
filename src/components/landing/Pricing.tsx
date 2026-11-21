import { PrepSection } from "./journey/PrepSection";
import { PricingPlans } from "./pricing/PricingPlans";

export function Pricing() {
  return (
    <PrepSection
      id="pricing"
      step={5}
      kicker="Pick your plan"
      title="Simple pricing for every stage of your prep"
      intro="Start free, then upgrade when you want more voice practice and mock interviews. No hidden fees."
    >
      <PricingPlans />
    </PrepSection>
  );
}
