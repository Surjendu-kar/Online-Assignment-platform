"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section
      className="w-full py-20 md:py-32 bg-gray-50 dark:bg-background relative overflow-hidden"
      data-scroll-section
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-2 md:px-0 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-center"
          data-scroll
          data-scroll-speed="0.3"
        >
          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Ready to Transform Your
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Exam Process?
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-muted-foreground text-sm md:text-lg mb-10 max-w-2xl mx-auto">
            Join leading institutions in modernizing education with our
            comprehensive exam management platform
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* Primary CTA */}
            <Link href="/auth/signin">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group px-4 py-3 md:px-8 md:py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm md:text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 min-w-[200px] justify-center"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            {/* Secondary CTA */}
            <Link href="mailto:contact@example.com">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group px-4 py-3 md:px-10 md:py-4 rounded-lg bg-card border-2 border-border text-foreground font-semibold text-sm md:text-lg hover:border-primary hover:bg-card/80 transition-all flex items-center gap-2 min-w-[200px] justify-center"
              >
                <Mail className="w-5 h-5" />
                Contact Sales
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
