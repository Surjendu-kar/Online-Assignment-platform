"use client";
import LightRays from "@/components/ui/LightRays";
import { SparklesCore } from "@/components/ui/sparkles";
import React, { useState, useEffect } from "react";

export default function HeroSection() {
  const [rayLength, setRayLength] = useState(1.4);

  useEffect(() => {
    const updateRayLength = () => {
      // sm breakpoint is 640px in Tailwind
      if (window.innerWidth < 640) {
        setRayLength(3);
      } else {
        setRayLength(1.4);
      }
    };

    // Set initial value
    updateRayLength();

    // Update on resize
    window.addEventListener("resize", updateRayLength);
    return () => window.removeEventListener("resize", updateRayLength);
  }, []);

  return (
    <div className="w-full min-h-screen relative bg-background" data-scroll-section>
      {/* Background Light Rays */}
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={rayLength}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="absolute inset-0"
      />

      {/* Hero Content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4" data-scroll data-scroll-speed="0.2">
        <div className="flex flex-col items-center justify-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 mb-4" data-scroll data-scroll-speed="0.5">
            Transform How Your Institution
            <br />
            Conducts Exams
          </h1>

          {/* Subheading */}
          <p className="text-muted-foreground text-base md:text-md text-center max-w-2xl mb-8 relative z-20">
            Streamline exam creation, proctoring, and grading with our advanced
            platform
          </p>

          {/* Sparkles Effect Container */}
          <div className="w-full max-w-2xl h-5 relative">
            {/* Gradient Lines */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-px w-3/4" />
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bg-gradient-to-r from-transparent via-primary/70 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bg-gradient-to-r from-transparent via-primary to-transparent h-px w-1/4" />

            {/* Sparkles Core */}
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={900}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />

            {/* Gradient Mask - Fades left and right edges */}
            <div className="absolute inset-0 w-full h-full [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]"></div>
          </div>

          {/* CTA Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-4 relative z-20">
            <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 rounded-lg border border-border bg-background/50 backdrop-blur-sm font-semibold hover:bg-accent transition-colors">
              Learn More
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
