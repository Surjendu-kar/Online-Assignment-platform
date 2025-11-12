"use client";

import React from "react";
import { motion } from "motion/react";
import MagicBento from "../MagicBento";

export default function CoreValuesSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Our Core Values
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
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
