"use client";

import React from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

export function PlatformPreview() {
  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-[#020618] from-0% via-[#20222a] via-50% to-[#020618] to-90%" data-scroll-section>
      <div data-scroll data-scroll-speed="0.5">
        <MacbookScroll
          title={
            <span>
              Experience seamless online exams. <br />
              Built for educators and students.
            </span>
          }
          src={`/exam-platform-screenshot.png`}
          showGradient={true}
        />
      </div>
    </div>
  );
}
