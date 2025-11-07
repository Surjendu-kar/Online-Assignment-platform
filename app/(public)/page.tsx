import HeroSection from "@/components/HeroSection";
import { PlatformPreview } from "@/components/PlatformPreview";

function HomePage() {
  return (
    <>
      <HeroSection />
      <PlatformPreview />
      <div className="min-h-screen"></div>
    </>
  );
}

export default HomePage;
