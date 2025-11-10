import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StatsSection from "@/components/StatsSection";
import { PlatformPreview } from "@/components/PlatformPreview";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";

function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      {/* <StatsSection /> */}
      <PlatformPreview />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}

export default HomePage;
