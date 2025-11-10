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
      className="w-full py-20 md:py-32 bg-background"
      data-scroll-section
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-2"
          data-scroll
          data-scroll-speed="0.1"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Four simple steps from setup to results
          </p>
        </motion.div>

        {/* Stepper Container */}
        <div data-scroll data-scroll-speed="0.2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <div key={index} className="relative cursor-pointer">
                  {/* Connecting Line - Desktop Only */}
                  {!isLast && (
                    <div className="hidden lg:block absolute top-[calc(50%)] left-[calc(50%+3rem)] w-[calc(100%-3rem)] h-0.5 bg-border z-0">
                      <motion.div
                        className="h-full bg-primary origin-left"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                      />
                    </div>
                  )}

                  {/* Step Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative h-full"
                  >
                    <div
                      className={cn(
                        "relative h-full rounded-2xl p-6 bg-card border border-border transition-all duration-300",
                        hoveredIndex === index &&
                          "border-primary/50 shadow-lg shadow-primary/10"
                      )}
                    >
                      {/* Step Number and Icon */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="relative">
                          <div
                            className={cn(
                              "w-24 h-24 rounded-full bg-primary/10 border-2 border-border flex items-center justify-center transition-all duration-300",
                              hoveredIndex === index &&
                                "border-primary bg-primary/20 scale-110"
                            )}
                          >
                            <Icon className="w-10 h-10 text-primary" />
                          </div>
                          {/* <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-lg">
                            {step.number}
                          </div> */}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-foreground mb-3">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
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
