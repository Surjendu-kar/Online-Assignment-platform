"use client";

import React from "react";
import { motion } from "motion/react";
import { Building2, FileText, Users, CheckCircle2 } from "lucide-react";

const stats = [
  {
    icon: Building2,
    number: "100+",
    label: "Institutions",
    description: "Trusted by leading educational organizations",
  },
  {
    icon: FileText,
    number: "50K+",
    label: "Exams Conducted",
    description: "Secure and proctored assessments",
  },
  {
    icon: Users,
    number: "1M+",
    label: "Students Enrolled",
    description: "Empowering learners worldwide",
  },
  {
    icon: CheckCircle2,
    number: "10M+",
    label: "Questions Graded",
    description: "Fast, accurate, and automated",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function StatsSection() {
  return (
    <section
      className="w-full py-20 md:py-24 bg-gradient-to-b from-background to-accent/20"
      data-scroll-section
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          data-scroll
          data-scroll-speed="0.3"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Trusted by Educators Worldwide
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Join thousands of institutions transforming their examination process
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                data-scroll
                data-scroll-speed="0.2"
              >
                {/* Icon */}
                <div className="mb-4 inline-flex p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-8 h-8 text-primary" />
                </div>

                {/* Number */}
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/70">
                  {stat.number}
                </div>

                {/* Label */}
                <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
