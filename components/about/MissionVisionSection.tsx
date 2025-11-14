"use client";

import React from "react";
import { motion } from "motion/react";
import { Target, Telescope, Heart } from "lucide-react";

const cards = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To democratize access to high-quality online examination tools by providing educational institutions with a secure, efficient, and user-friendly platform that simplifies exam creation, delivery, and grading while maintaining academic integrity.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Telescope,
    title: "Our Vision",
    description:
      "To become the global standard for online exam management, empowering educators worldwide to focus on teaching while we handle the complexity of assessments. We envision a future where technology seamlessly enhances educational outcomes.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Heart,
    title: "Our Commitment",
    description:
      "We're committed to continuous innovation, unwavering data security, and exceptional customer support. Every feature we build is designed with educators and students in mind, ensuring that assessments are fair, accessible, and meaningful.",
    gradient: "from-orange-500 to-red-500",
  },
];

export default function MissionVisionSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl  font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Who
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              We Are
            </span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-3xl mx-auto">
            Built by educators and technologists who understand the challenges
            of modern education
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full rounded-lg md:rounded-2xl p-6 md:p-8 bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-2xl bg-gradient-to-br ${card.gradient} p-0.5 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="w-full h-full rounded-lg md:rounded-2xl bg-background flex items-center justify-center">
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2 md:mb-4">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
