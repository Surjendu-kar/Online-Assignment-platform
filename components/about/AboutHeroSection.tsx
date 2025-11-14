"use client";

import React from "react";
import { motion } from "motion/react";

export default function AboutHeroSection() {
  return (
    <section className="w-full min-h-screen flex items-center bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto pl-3 pr-1 md:px-0 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-5xl font-bold mb-4 md:mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Transforming Education Through
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
               Smart Assessment Solutions
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground text-sm md:text-lg max-w-5xl mx-auto mb-8 leading-relaxed"
          >
            We&apos;re on a mission to revolutionize online education by providing
            secure, efficient, and comprehensive exam management solutions that
            empower institutions, teachers, and students worldwide.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
