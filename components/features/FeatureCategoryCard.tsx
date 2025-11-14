"use client";

import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Category {
  title: string;
  icon: LucideIcon;
  color: string;
  features: Feature[];
}

interface FeatureCategoryCardProps {
  category: Category;
  index: number;
}

export default function FeatureCategoryCard({
  category,
  index,
}: FeatureCategoryCardProps) {
  const CategoryIcon = category.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative"
    >
      {/* Category Header */}
      <div
        className={cn(
          "flex items-center gap-4 mb-8",
          isEven ? "justify-start" : "md:justify-end"
        )}
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={cn(
            "relative w-12 h-12 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
            category.color
          )}
        >
          <CategoryIcon className="w-6 h-6 md:w-10 md:h-10 text-white" />
        </motion.div>
        <div className={cn(isEven ? "text-left" : "md:text-right")}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            {category.title}
          </h2>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {category.features.map((feature, featureIndex) => {
          const FeatureIcon = feature.icon;
          return (
            <motion.div
              key={featureIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: 0.4 + featureIndex * 0.1,
              }}
              whileHover={{ scale: 1.03 }}
              className="group relative cursor-pointer"
            >
              <div className="relative h-full rounded-xl p-4 md:p-6 bg-card border border-border transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-md group-hover:shadow-primary/10">
                {/* Icon */}
                <div className="flex items-start gap-4 ">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-md md:rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/20 transition-all duration-300">
                    <FeatureIcon className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pl-14 md:pl-16">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Divider Line (except for last item) */}
      {index < 5 && (
        <div className="mt-24 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      )}
    </motion.div>
  );
}
