"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordToggleProps {
  showPassword: boolean;
  onToggle: () => void;
  hasValue: boolean;
}

export function PasswordToggle({
  showPassword,
  onToggle,
  hasValue,
}: PasswordToggleProps) {
  return (
    <AnimatePresence>
      {hasValue && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={onToggle}
        >
          <motion.div
            key={showPassword ? "hide" : "show"}
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.3 }}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-blue-400 dark:text-blue-300" />
            ) : (
              <Eye className="h-4 w-4 text-blue-400 dark:text-blue-300" />
            )}
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
