"use client";

import React from "react";
import { motion } from "motion/react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const testimonials = [
  {
    quote:
      "This platform has completely transformed how we conduct exams. The proctoring features give us confidence in exam integrity, and the automated grading saves us countless hours.",
    name: "Dr. Sarah Johnson",
    title: "Dean of Academic Affairs, Springfield University",
  },
  {
    quote:
      "The coding question support with Judge0 integration is phenomenal. Our computer science department can now create comprehensive programming exams with real-time code execution.",
    name: "Prof. Michael Chen",
    title: "Department Head, Computer Science, Tech Institute of Excellence",
  },
  {
    quote:
      "Managing multiple departments was a nightmare before. Now with this platform, we can easily organize exams across all our schools and get instant insights into student performance.",
    name: "Amanda Rodriguez",
    title: "IT Administrator, Metropolitan Education Network",
  },
  {
    quote:
      "The real-time proctoring and violation tracking ensure exam integrity without being intrusive. Our students appreciate the clear guidelines and fair assessment process.",
    name: "Dr. Robert Williams",
    title: "Professor of Engineering, Riverside Technical College",
  },
  {
    quote:
      "Setting up exams is incredibly intuitive. The multi-question type support means we can create comprehensive assessments that truly test our students' understanding.",
    name: "Lisa Thompson",
    title: "Associate Professor, Digital Arts Institute",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      className="w-full py-20 md:py-32 bg-gray-50 dark:bg-background"
      style={{
        fontFamily: '"Ubuntu", sans-serif',
      }}
      data-scroll-section
    >
      <div className="container mx-auto px-2 md:px-0 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
          data-scroll
          data-scroll-speed="0.1"
        >
          <h2
            className="text-3xl md:text-5xl font-extrabold mb-4 pb-1 leading-tight"
            style={{
              fontFamily: '"Ubuntu", sans-serif',
              fontWeight: 700,
            }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Loved by
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Educators
            </span>
          </h2>
          <p className="text-muted-foreground text-md md:text-lg  max-w-2xl mx-auto">
            Hear what our users have to say about transforming their exam
            process
          </p>
        </motion.div>

        {/* Infinite Moving Cards */}

        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="fast"
          pauseOnHover={true}
        />
      </div>
    </section>
  );
}
