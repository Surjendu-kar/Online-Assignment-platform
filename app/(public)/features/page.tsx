"use client";

import { useEffect } from "react";
import DetailedFeaturesSection from "@/components/features/DetailedFeaturesSection";
import CTASection from "@/components/CTASection";
import { motion } from "motion/react";

export default function FeaturesPage() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !document.getElementById("ubuntu-font-global")
    ) {
      // Preconnect to Google Fonts
      const preconnect1 = document.createElement("link");
      preconnect1.rel = "preconnect";
      preconnect1.href = "https://fonts.googleapis.com";
      if (
        !document.querySelector('link[href="https://fonts.googleapis.com"]')
      ) {
        document.head.appendChild(preconnect1);
      }

      const preconnect2 = document.createElement("link");
      preconnect2.rel = "preconnect";
      preconnect2.href = "https://fonts.gstatic.com";
      preconnect2.setAttribute("crossorigin", "anonymous");
      if (!document.querySelector('link[href="https://fonts.gstatic.com"]')) {
        document.head.appendChild(preconnect2);
      }

      // Load Ubuntu font
      const link = document.createElement("link");
      link.id = "ubuntu-font-global";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        className="min-h-screen flex flex-col justify-center items-center w-full bg-gray-50 dark:bg-[#020618] px-2 md:px-0"
        style={{
          fontFamily: '"Ubuntu", sans-serif',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Powerful Features for
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Modern Education
            </span>
          </h1>
          <p className="text-muted-foreground text-md md:text-lg max-w-3xl mx-auto mb-8">
            Everything you need to create, deliver, and grade comprehensive
            online exams with security, efficiency, and ease.
          </p>
        </motion.div>
      </section>

      <DetailedFeaturesSection />
      <CTASection />
    </>
  );
}
