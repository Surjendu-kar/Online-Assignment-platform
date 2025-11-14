"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserCog, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const useCases = [
  {
    role: "Admin",
    icon: UserCog,
    color: "from-blue-500 to-cyan-500",
    persona: {
      name: "Dr. Sarah Mitchell",
      title: "IT Director at Springfield University",
      avatar: "SM",
    },
    scenario:
      "Dr. Mitchell needs to set up the exam platform for the entire university with multiple departments.",
    steps: [
      {
        step: 1,
        title: "Create Institution",
        description:
          "Dr. Mitchell logs in and creates 'Springfield University' with basic information and branding.",
        highlight: "2 minutes",
      },
      {
        step: 2,
        title: "Add Departments",
        description:
          "She adds departments like Computer Science, Mathematics, and Engineering with specific settings.",
        highlight: "5 minutes",
      },
      {
        step: 3,
        title: "Invite Teachers",
        description:
          "Using bulk email invitations, she invites 50+ teachers to join their respective departments.",
        highlight: "3 minutes",
      },
      {
        step: 4,
        title: "Configure Settings",
        description:
          "She sets institution-wide exam policies, proctoring requirements, and access controls.",
        highlight: "5 minutes",
      },
    ],
    outcome:
      "In just 15 minutes, the entire university is set up with role-based access and ready for exam creation.",
  },
  {
    role: "Teacher",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    persona: {
      name: "Prof. James Chen",
      title: "Computer Science Professor",
      avatar: "JC",
    },
    scenario:
      "Prof. Chen wants to create a comprehensive final exam with multiple question types for his 200 students.",
    steps: [
      {
        step: 1,
        title: "Start Exam Creation",
        description:
          "Prof. Chen uses the exam wizard to set title, duration (2 hours), and schedule (next Friday 9 AM).",
        highlight: "3 minutes",
      },
      {
        step: 2,
        title: "Add Questions",
        description:
          "He adds 20 MCQs from his question bank, 5 short answer questions, and 3 coding challenges in Python.",
        highlight: "15 minutes",
      },
      {
        step: 3,
        title: "Configure Proctoring",
        description:
          "He enables webcam monitoring, tab switching detection, and sets max violations to 3.",
        highlight: "2 minutes",
      },
      {
        step: 4,
        title: "Invite Students",
        description:
          "Using the class roster, he sends email invitations to all 200 students with exam links.",
        highlight: "2 minutes",
      },
    ],
    outcome:
      "Exam ready in 22 minutes. After completion, MCQs are auto-graded instantly, saving hours of manual work.",
  },
  {
    role: "Student",
    icon: GraduationCap,
    color: "from-green-500 to-emerald-500",
    persona: {
      name: "Emily Rodriguez",
      title: "3rd Year CS Student",
      avatar: "ER",
    },
    scenario:
      "Emily has received an email invitation for her Database Systems final exam.",
    steps: [
      {
        step: 1,
        title: "Access Exam",
        description:
          "Emily clicks the exam link from her email, logs in, and sees the exam instructions and webcam check.",
        highlight: "1 minute",
      },
      {
        step: 2,
        title: "Start Exam",
        description:
          "After granting webcam permission and confirming she's ready, the exam starts with a visible countdown timer.",
        highlight: "30 seconds",
      },
      {
        step: 3,
        title: "Answer Questions",
        description:
          "She navigates through 20 MCQs, answers 5 essay questions, and writes code for 3 programming challenges in the Monaco editor.",
        highlight: "1 hour 45 min",
      },
      {
        step: 4,
        title: "Submit & Review",
        description:
          "She reviews all answers using the progress tracker, submits the exam, and gets instant MCQ results.",
        highlight: "5 minutes",
      },
    ],
    outcome:
      "Seamless exam experience with immediate feedback on auto-graded sections. Full results available after teacher grades essays.",
  },
];

export default function UseCasesSection() {
  const [activeCase, setActiveCase] = useState(0);

  return (
    <section className="w-full py-20 bg-gray-50 dark:bg-[#020618]">
      <div className="container mx-auto px-2 md:px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Real-World
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Use Cases
            </span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-3xl mx-auto">
            See how educators and students use our platform daily to transform
            the examination process
          </p>
        </motion.div>

        {/* Role Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            const isActive = activeCase === index;

            return (
              <motion.button
                key={index}
                onClick={() => setActiveCase(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl border-2 transition-all duration-300",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <Icon className="md:w-5 md:h-5 w-4 h-4" />
                <span className="text-sm md:text-base font-semibold">
                  {useCase.role}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Use Case Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            {/* Persona Card */}
            <div className="mb-4 md:mb-8 p-4 md:p-6 rounded-lg md:rounded-2xl bg-card border border-border">
              <div className="flex items-start gap-4 md:gap-6">
                <div
                  className={cn(
                    "flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-base md:text-2xl font-bold shadow-lg",
                    useCases[activeCase].color
                  )}
                >
                  {useCases[activeCase].persona.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-base md:text-2xl font-bold text-foreground md:mb-1">
                    {useCases[activeCase].persona.name}
                  </h3>
                  <p className="text-xs md:text-base text-muted-foreground mb-4">
                    {useCases[activeCase].persona.title}
                  </p>
                  <div className="p-2 md:p-4 rounded-md md:rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-xs md:text-sm text-foreground">
                      <span className="font-semibold">Scenario:</span>{" "}
                      {useCases[activeCase].scenario}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4 md:space-y-6 mb-8">
              {useCases[activeCase].steps.map((step, stepIndex) => (
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: stepIndex * 0.1 }}
                  className="relative"
                >
                  {/* Connecting Line */}
                  {stepIndex < useCases[activeCase].steps.length - 1 && (
                    <div className="absolute left-[20px] md:left-[23px] top-[30px] md:top-[50px] w-0.5 h-[calc(100%+1.5rem)] bg-border" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Step Number */}
                    <div
                      className={cn(
                        "relative z-10 flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg",
                        useCases[activeCase].color
                      )}
                    >
                      {step.step}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 p-4 rounded-lg md:rounded-xl bg-card border border-border">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="text-sm md:text-lg font-bold text-foreground">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Outcome */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="p-4 md:p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-bold text-foreground mb-1 md:mb-2">
                    Outcome
                  </h4>
                  <p className="text-foreground text-xs md:text-base">
                    {useCases[activeCase].outcome}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
