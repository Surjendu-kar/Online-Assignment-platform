"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { UserCog, FileEdit, GraduationCap, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: 1,
    icon: UserCog,
    title: "Admin Setup",
    description:
      "Create your institution, set up departments, and invite teachers. Configure exam settings and manage user roles with ease.",
  },
  {
    number: 2,
    icon: FileEdit,
    title: "Exam Creation",
    description:
      "Teachers design comprehensive exams with MCQs, short answer questions, and coding challenges. Build question banks and reuse templates.",
  },
  {
    number: 3,
    icon: GraduationCap,
    title: "Students Take Exams",
    description:
      "Students take proctored exams in a secure environment. Real-time violation tracking and webcam monitoring ensure integrity.",
  },
  {
    number: 4,
    icon: Award,
    title: "Instant Results",
    description:
      "Auto-graded MCQs provide immediate results. Teachers can review and grade essays and coding submissions with streamlined workflows.",
  },
];

export default function HowItWorksSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      className="w-full pt-20 pb-0 md:py-32 bg-gray-50 dark:bg-background"
      style={{
        fontFamily: '"Ubuntu", sans-serif',
      }}
      data-scroll-section
    >
      <div className="container mx-auto px-4 md:px-0 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-0 md:mb-8"
          data-scroll
          data-scroll-speed="0.1"
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4"
            style={{
              fontFamily: '"Ubuntu", sans-serif',
              fontWeight: 700,
            }}
          >
            How
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              {""} It Works
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-lg max-w-2xl mx-auto">
            Four simple steps from setup to results
          </p>
        </motion.div>

        {/* Stepper Container */}
        <div data-scroll data-scroll-speed="0.2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;

              // Sequential animation timing
              const cardDelay = index * 0.8; // Each card appears 0.8s after the previous
              const lineDelay = cardDelay + 0.5; // Line starts 0.5s after card appears

              return (
                <div key={index} className="relative cursor-pointer">
                  {/* Connecting Line - Desktop Only */}
                  {!isLast && (
                    <div className="hidden lg:block absolute top-[calc(50%)] -right-10 w-[40px] h-0.5 bg-border z-0">
                      <motion.div
                        className="h-full bg-primary origin-left"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                          duration: 0.5,
                          delay: lineDelay,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  )}

                  {/* Step Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.5,
                      delay: cardDelay,
                      ease: "easeOut",
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative h-full"
                  >
                    <div
                      className={cn(
                        "relative h-full rounded-2xl p-4 md:p-6 bg-card border border-border transition-all duration-300",
                        hoveredIndex === index &&
                          "border-primary/50 shadow-lg shadow-primary/10"
                      )}
                    >
                      {/* Step Number and Icon */}
                      <div className="flex items-center justify-center mb-2 md:mb-4">
                        <div className="relative">
                          <div
                            className={cn(
                              "w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 border-2 border-border flex items-center justify-center transition-all duration-300",
                              hoveredIndex === index &&
                                "border-primary bg-primary/20 scale-110"
                            )}
                          >
                            <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                          </div>
                          {/* <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-lg">
                            {step.number}
                          </div> */}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className="text-md md:text-lg font-bold text-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
