import { NavBar } from "@/components/landing/NavBar";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AiCoach } from "@/components/landing/AiCoach";
import { FeaturesBento } from "@/components/landing/FeaturesBento";
import { ReadinessScore } from "@/components/landing/ReadinessScore";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <NavBar />
      <Hero />
      <Problem />
      <HowItWorks />
      <AiCoach />
      <FeaturesBento />
      <ReadinessScore />
      <FinalCta />
      <Footer />
    </div>
  );
}
