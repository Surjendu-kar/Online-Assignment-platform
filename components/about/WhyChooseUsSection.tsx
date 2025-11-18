"use client";

import React from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Rocket,
  Shield,
  HeadphonesIcon,
  TrendingUp,
  Award,
} from "lucide-react";

const reasons = [
  {
    icon: Rocket,
    title: "Quick Setup & Onboarding",
    description:
      "Get started in minutes with our intuitive setup wizard. Create your first exam within 15 minutes of signing up.",
    features: [
      "No technical knowledge required",
      "Guided tour included",
      "Ready-made templates",
    ],
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description:
      "Bank-level encryption, advanced proctoring, and comprehensive audit trails ensure your exams are secure and compliant.",
    features: [
      "End-to-end encryption",
      "ISO 27001 compliant",
      "Regular security audits",
    ],
  },
  {
    icon: TrendingUp,
    title: "Scalable Architecture",
    description:
      "From 10 to 10,000 students, our platform scales seamlessly. Handle concurrent exams without performance degradation.",
    features: [
      "Auto-scaling infrastructure",
      "99.9% uptime SLA",
      "CDN-powered delivery",
    ],
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description:
      "Our dedicated support team is always available to help. Get assistance via chat, email, or phone whenever you need it.",
    features: [
      "Live chat support",
      "Comprehensive documentation",
      "Training webinars",
    ],
  },
  {
    icon: Award,
    title: "Proven Track Record",
    description:
      "Trusted by leading universities and institutions worldwide. Join the thousands who've modernized their assessment process.",
    features: [
      "98% customer satisfaction",
      "Award-winning platform",
      "Case studies available",
    ],
  },
  {
    icon: CheckCircle2,
    title: "Continuous Innovation",
    description:
      "We release new features monthly based on user feedback. Stay ahead with AI-powered grading, analytics, and more.",
    features: [
      "Regular updates",
      "Beta program access",
      "Feature voting system",
    ],
  },
];

export default function WhyChooseUsSection() {
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
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Why Choose
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              Our Platform?
            </span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-3xl mx-auto">
            More than just software — a complete solution backed by expertise,
            reliability, and continuous innovation
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full rounded-lg md:rounded-2xl p-5 md:p-8 bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-md dark:shadow-[0_10px_10px_-1px_rgba(255,255,255,0.1),0_2px_4px_-2px_rgba(255,255,255,0.1)] hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-[0_10px_15px_-3px_rgba(255,255,255,0.15),0_4px_6px_-4px_rgba(255,255,255,0.1)]">
                  {/* Icon */}
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-4  md:mb-6 group-hover:border-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">
                    {reason.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 leading-relaxed">
                    {reason.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2">
                    {reason.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-xs md:text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 md:mt-16 text-center"
        >
          <div className="inline-block px-6 py-3 md:px-8 md:py-4 rounded-lg md:rounded-2xl bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 border border-primary/20">
            <p className="text-sm md:text-lg font-medium text-foreground">
              Ready to see the difference?{" "}
              <span className="text-primary">Start your free trial today</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
