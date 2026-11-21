import { NavBar } from "@/components/landing/NavBar";
import { HeroScene } from "@/components/landing/scene/HeroScene";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AiCoach } from "@/components/landing/AiCoach";
import { ReadinessScore } from "@/components/landing/ReadinessScore";
import { Pricing } from "@/components/landing/Pricing";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";
import { JourneyRail } from "@/components/landing/journey/JourneyRail";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <NavBar overlay />
      <HeroScene />
      <JourneyRail>
        <Problem />
        <HowItWorks />
        <AiCoach />
        <ReadinessScore />
        <Pricing />
        <FinalCta />
      </JourneyRail>
      <Footer />
    </div>
  );
}
