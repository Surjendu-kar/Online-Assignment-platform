"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { VariantProps } from "class-variance-authority";
import { motion } from "motion/react";

import {
  ThemeToggler as ThemeTogglerPrimitive,
  type ThemeTogglerProps as ThemeTogglerPrimitiveProps,
  type ThemeSelection,
  type Resolved,
} from "@/components/animate-ui/primitives/effects/theme-toggler";
import { buttonVariants } from "@/components/animate-ui/components/buttons/icon";
import { cn } from "@/lib/utils";

const getIcon = (
  effective: ThemeSelection,
  resolved: Resolved,
  modes: ThemeSelection[]
) => {
  const theme = modes.includes("system") ? effective : resolved;

  if (theme === "system") {
    return (
      <Monitor className="size-4 text-slate-600 drop-shadow-[0_0_8px_rgba(71,85,105,0.8)] dark:text-slate-300 dark:drop-shadow-[0_0_12px_rgba(203,213,225,0.9)]" />
    );
  } else if (theme === "dark") {
    return (
      <Moon className="size-4 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] dark:text-blue-300 dark:drop-shadow-[0_0_12px_rgba(147,197,253,0.9)]" />
    );
  } else {
    return (
      <Sun className="size-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] dark:text-yellow-400 dark:drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
    );
  }
};

const getNextTheme = (
  effective: ThemeSelection,
  modes: ThemeSelection[]
): ThemeSelection => {
  const i = modes.indexOf(effective);
  if (i === -1) return modes[0];
  return modes[(i + 1) % modes.length];
};

type ThemeTogglerButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    modes?: ThemeSelection[];
    onImmediateChange?: ThemeTogglerPrimitiveProps["onImmediateChange"];
    direction?: ThemeTogglerPrimitiveProps["direction"];
  };

function ThemeTogglerButton({
  variant = "default",
  size = "default",
  modes = ["light", "dark", "system"],
  direction = "ltr",
  onImmediateChange,
  onClick,
  className,
  ...props
}: ThemeTogglerButtonProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <ThemeTogglerPrimitive
      theme={theme as ThemeSelection}
      resolvedTheme={resolvedTheme as Resolved}
      setTheme={setTheme}
      direction={direction}
      onImmediateChange={onImmediateChange}
    >
      {({ effective, resolved, toggleTheme }) => (
        <button
          data-slot="theme-toggler-button"
          className={cn(
            buttonVariants({ variant, size, className }),
            "relative overflow-hidden hover:bg-accent/50 transition-all duration-300"
          )}
          onClick={(e) => {
            onClick?.(e);
            toggleTheme(getNextTheme(effective, modes));
          }}
          {...props}
        >
          {getIcon(effective, resolved, modes)}

          {/* Glowing background effect */}
          <motion.div
            className={`absolute cursor-pointer inset-0 rounded-md opacity-20 blur-sm transition-all duration-500 ${
              resolved === "dark"
                ? "bg-blue-400 dark:bg-blue-300"
                : resolved === "light"
                ? "bg-amber-400 dark:bg-yellow-400"
                : "bg-slate-400 dark:bg-slate-300"
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
        </button>
      )}
    </ThemeTogglerPrimitive>
  );
}

export { ThemeTogglerButton, type ThemeTogglerButtonProps };
