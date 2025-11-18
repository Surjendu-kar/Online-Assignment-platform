"use client";

import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import { PlatformPreview } from "@/components/PlatformPreview";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";

function HomePage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('ubuntu-font-global')) {
      // Preconnect to Google Fonts
      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';
      if (!document.querySelector('link[href="https://fonts.googleapis.com"]')) {
        document.head.appendChild(preconnect1);
      }

      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.setAttribute('crossorigin', 'anonymous');
      if (!document.querySelector('link[href="https://fonts.gstatic.com"]')) {
        document.head.appendChild(preconnect2);
      }

      // Load Ubuntu font
      const link = document.createElement('link');
      link.id = 'ubuntu-font-global';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap';
      document.head.appendChild(link);
    }
  }, []);

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
