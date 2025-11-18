"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import CardSwap, { Card } from "./CardSwap";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";

const features = [
  "Multi-question type support (MCQ, SAQ, Coding)",
  "Real-time proctoring & violation tracking",
  "Automated grading with instant results",
];

export default function HeroSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine image sources based on theme
  const adminImage =
    mounted && theme === "light"
      ? "/Admin_page_light.webp"
      : "/Admin_page.webp";
  const studentImage =
    mounted && theme === "light"
      ? "/Student_page_light.png"
      : "/Student_page.webp";
  const teacherImage =
    mounted && theme === "light"
      ? "/Teacher_page_light.webp"
      : "/Teacher_page.webp";

  return (
    <div
      className="w-full min-h-screen relative bg-background overflow-hidden  max-w-[1500px] mx-auto"
      data-scroll-section
      style={{
        fontFamily: '"Ubuntu", sans-serif',
      }}
    >
      {/* Background Light Rays */}
      {/* <LightRays
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
      /> */}

      {/* Decorative Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-1/3 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Content - Left Side */}
      <div
        className="absolute top-1/2 left-0 pl-3 pr-1 md:px-0 md:left-16 lg:left-24 -translate-y-1/2 max-w-2xl z-20"
        data-scroll
        data-scroll-speed="0.2"
      >
        <div className="flex flex-col items-start">
          {/* Main Heading with Staggered Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl font-extrabold text-left relative z-20 mb-6 leading-[1.1]"
            style={{
              fontFamily: '"Ubuntu", sans-serif',
              fontWeight: 700,
            }}
            data-scroll
            data-scroll-speed="0.1"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Transform How Your
            </span>

            <p className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Institution Conducts Exams
            </p>
          </motion.h1>

          {/* Subheading with Animation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground text-sm pr-4 md:pr-0 md:text-base text-left max-w-xl mb-4 relative z-20 leading-relaxed"
          >
            Streamline exam creation, proctoring, and grading with our advanced
            platform powered by AI-driven insights and real-time monitoring.
          </motion.p>

          {/* Features List with Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8 space-y-1"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-1 text-muted-foreground"
              >
                <svg
                  className="w-4 h-4 text-primary flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-[13px] md:text-[14px]">{feature}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <div className="flex gap-4 relative z-20">
            <button
              style={{ fontWeight: 500 }}
              className="cursor-pointer text-sm md:text-md px-4 md:px-8 py-3 md:py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </button>
            <button
              style={{ fontWeight: 500 }}
              className="cursor-pointer text-sm md:text-md px-4 md:px-8 py-3  md:py-4 rounded-lg border border-border bg-background/50 backdrop-blur-sm hover:bg-card transition-all hover:scale-105"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute hidden bottom-5 left-1/2 -translate-x-1/2 z-20 md:flex flex-col items-center gap-2 cursor-pointer"
        data-scroll
        data-scroll-speed="0.5"
      >
        <span className="text-xs text-muted-foreground font-medium">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-1 shadow-[0_8px_10px_-6px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_15px_-6px_rgba(255,255,255,0.25)]"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>

      {/* Card Swap - Dashboard Previews - Right Side */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block h-[450px] w-[700px] pointer-events-none z-10"
        data-scroll
        data-scroll-speed="0.2"
      >
        <CardSwap
          width={700}
          height={450}
          cardDistance={60}
          verticalDistance={70}
          delay={3000}
          pauseOnHover={true}
          easing="elastic"
        >
          <Card customClass="shadow-2xl border-border overflow-hidden bg-card flex flex-col">
            <div className="bg-card px-4 py-3 border-b border-border ">
              <h3 className="text-foreground font-bold text-md">
                Admin Dashboard
              </h3>
            </div>
            <div className="relative flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={adminImage}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={adminImage}
                    alt="Admin Dashboard Preview"
                    fill
                    className="object-cover object-top-left"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
          <Card customClass="shadow-2xl border-border overflow-hidden bg-card flex flex-col">
            <div className="bg-card px-4 py-3 border-b border-border">
              <h3 className="text-foreground font-bold text-md">
                Student Dashboard
              </h3>
            </div>
            <div className="relative flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={studentImage}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={studentImage}
                    alt="Student Dashboard Preview"
                    fill
                    className="object-cover object-top-left"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
          <Card customClass="shadow-2xl border-border overflow-hidden bg-card flex flex-col">
            <div className="bg-#020618 px-4 py-3 border-b border-border">
              <h3 className="text-foreground font-bold text-md">
                Teacher Dashboard
              </h3>
            </div>
            <div className="relative flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={teacherImage}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={teacherImage}
                    alt="Teacher Dashboard Preview"
                    fill
                    className="object-cover object-top-left"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </CardSwap>
      </div>
    </div>
  );
}
