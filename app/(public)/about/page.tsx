"use client";

import { useEffect } from "react";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import MissionVisionSection from "@/components/about/MissionVisionSection";
import CoreValuesSection from "@/components/about/CoreValuesSection";
import WhyChooseUsSection from "@/components/about/WhyChooseUsSection";
import CTASection from "@/components/CTASection";

function AboutPage() {
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
      <AboutHeroSection />
      <MissionVisionSection />
      <CoreValuesSection />
      <WhyChooseUsSection />
      <CTASection />
    </>
  );
}

export default AboutPage;
