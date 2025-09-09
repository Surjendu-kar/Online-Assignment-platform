"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-7">
        <div className="size-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 relative overflow-hidden hover:bg-accent/50 transition-all duration-300"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <AnimatePresence mode="wait">
        {theme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              duration: 0.3,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="size-4 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] dark:text-blue-300 dark:drop-shadow-[0_0_12px_rgba(147,197,253,0.9)]" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              duration: 0.3,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="size-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] dark:text-yellow-400 dark:drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glowing background effect */}
      <motion.div
        className={`absolute inset-0 rounded-md opacity-20 blur-sm transition-all duration-500 ${
          theme === "dark"
            ? "bg-blue-400 dark:bg-blue-300"
            : "bg-amber-400 dark:bg-yellow-400"
        }`}
        animate={{
          scale: [0.8, 1.1, 0.8],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
