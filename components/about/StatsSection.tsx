"use client";

import React from "react";
import { motion } from "motion/react";
import { Building2, Users, FileCheck, Globe } from "lucide-react";

const stats = [
  {
    icon: Building2,
    value: "500+",
    label: "Institutions",
    description: "Educational institutions trust our platform",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    value: "50K+",
    label: "Active Users",
    description: "Teachers and students using our platform",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: FileCheck,
    value: "1M+",
    label: "Exams Conducted",
    description: "Successful exams delivered securely",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Globe,
    value: "45+",
    label: "Countries",
    description: "Global reach across continents",
    color: "from-orange-500 to-red-500",
  },
];

export default function StatsSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Our Impact in Numbers
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
            Trusted by institutions worldwide to deliver secure and efficient
            online examinations
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="relative h-full rounded-2xl p-8 bg-card border border-border transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10">
                  {/* Icon with Gradient Background */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                  </div>

                  {/* Value */}
                  <div
                    className={`text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-br ${stat.color}`}
                  >
                    {stat.value}
                  </div>

                  {/* Label */}
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground text-lg">
            <span className="font-semibold text-foreground">
              Growing every day
            </span>{" "}
            — Join thousands of educators who&apos;ve already transformed their exam
            process
          </p>
        </motion.div>
      </div>
    </section>
  );
}
