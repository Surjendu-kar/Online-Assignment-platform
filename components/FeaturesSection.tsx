"use client";

import React from "react";
import { motion } from "motion/react";
import { HoverEffect } from "@/components/ui/card-hover-effect";

const features = [
  {
    title: "Multi-Question Types",
    description:
      "Support for Multiple Choice Questions (MCQ), Short Answer Questions (SAQ), and advanced Coding challenges. Create diverse exams that truly test student knowledge.",
    link: "#",
  },
  {
    title: "AI-Powered Proctoring",
    description:
      "Advanced webcam monitoring with violation tracking ensures exam integrity. Real-time alerts and comprehensive proctoring logs keep exams secure.",
    link: "#",
  },
  {
    title: "Multi-Institution Support",
    description:
      "Manage multiple institutions, departments, and user roles seamlessly. Perfect for educational networks and large organizations.",
    link: "#",
  },
  {
    title: "Real-Time Grading",
    description:
      "Instant auto-grading for MCQs and streamlined manual grading workflows for essays and coding questions. Get results faster than ever.",
    link: "#",
  },
  {
    title: "Code Execution Engine",
    description:
      "Integrated Judge0 API supports 8+ programming languages including Python, Java, C++, JavaScript. Real-time code testing with custom test cases.",
    link: "#",
  },
  {
    title: "Role-Based Access",
    description:
      "Comprehensive access control for Admins, Teachers, and Students. Each role has tailored dashboards and permissions for seamless management.",
    link: "#",
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="w-full pt-0 pb-10 md:py-32 bg-gray-50 dark:bg-background"
      data-scroll-section
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-2"
          data-scroll
          data-scroll-speed="0.1"
        >
          <h2 className="text-3xl md:text-5xl  font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Powerful Features for
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Modern Education
            </span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-[15px] max-w-2xl mx-auto">
            Everything you need to create, manage, and grade exams efficiently
          </p>
        </motion.div>

        {/* Features Grid */}
        <HoverEffect items={features} className="max-w-7xl mx-auto" />
      </div>
    </section>
  );
}
