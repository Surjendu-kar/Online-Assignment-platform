"use client";

import React from "react";
import { motion } from "motion/react";
import MagicBento from "../MagicBento";

export default function CoreValuesSection() {
  return (
    <section
      className="w-full py-20 md:py-32 bg-gray-50 dark:bg-[#020618]"
      style={{
        fontFamily: '"Ubuntu", sans-serif',
      }}
    >
      <div className="container mx-auto px-2 md:px-0 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Our
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Core Values
            </span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg  max-w-3xl mx-auto">
            The principles that guide every decision we make and every feature
            we build
          </p>
        </motion.div>

        {/* Magic Bento Grid */}
        <div className="flex justify-center">
          <MagicBento
            textAutoHide={false}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="132, 0, 255"
          />
        </div>
      </div>
    </section>
  );
}
