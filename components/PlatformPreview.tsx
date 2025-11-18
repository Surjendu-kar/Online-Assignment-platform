"use client";

import React, { useState, useEffect } from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { useTheme } from "next-themes";

export function PlatformPreview() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine image source based on theme
  const screenshotImage = mounted && theme === "light" ? "/Admin_page_light.webp" : "/exam-platform-screenshot.png";

  return (
    <div className="w-full overflow-hidden bg-gray-100 dark:bg-[#020618]" style={{
        fontFamily: '"Ubuntu", sans-serif',
      }} data-scroll-section>
      <div data-scroll data-scroll-speed="0.5">
        <MacbookScroll
          title={
            <span
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold"
              style={{
                fontFamily: '"Ubuntu", sans-serif',
                fontWeight: 700,
              }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                Experience Seamless
              </span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
                Online Exams
              </span>
              <br />
              <span className="text-muted-foreground text-lg md:text-xl mt-4 block">
                Built for educators and students
              </span>
            </span>
          }
          src={screenshotImage}
          showGradient={true}
        />
      </div>
    </div>
  );
}
