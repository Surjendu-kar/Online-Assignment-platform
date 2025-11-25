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

  // Show the NEXT ACTION icon (Industry Standard - Option A)
  // Icon represents what will happen when you click, not current state
  if (theme === "system") {
    return (
      <motion.div
        className="relative flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Monitor className="size-4 text-slate-600 drop-shadow-[0_0_8px_rgba(71,85,105,0.8)] dark:text-slate-300 dark:drop-shadow-[0_0_12px_rgba(203,213,225,0.9)] relative z-10" />
        <motion.div
          className="absolute inset-0 rounded-full bg-slate-400 dark:bg-slate-300"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ filter: 'blur(8px)' }}
        />
      </motion.div>
    );
  } else if (theme === "dark") {
    // Dark mode active → Show SUN (click to go to light mode)
    return (
      <motion.div
        className="relative flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sun className="size-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] dark:text-yellow-400 dark:drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] relative z-10" />
        <motion.div
          className="absolute inset-0 rounded-full bg-amber-400 dark:bg-yellow-400"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ filter: 'blur(8px)' }}
        />
      </motion.div>
    );
  } else {
    // Light mode active → Show MOON (click to go to dark mode)
    return (
      <motion.div
        className="relative flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Moon className="size-4 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] dark:text-blue-300 dark:drop-shadow-[0_0_12px_rgba(147,197,253,0.9)] relative z-10" />
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-400 dark:bg-blue-300"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ filter: 'blur(8px)' }}
        />
      </motion.div>
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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        data-slot="theme-toggler-button"
        className={cn(
          buttonVariants({ variant, size, className }),
          "relative overflow-visible !bg-transparent hover:!bg-transparent transition-all duration-300 cursor-pointer"
        )}
        disabled
        {...props}
      >
        <Sun className="size-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] dark:text-yellow-400 dark:drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
      </button>
    );
  }

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
            "relative overflow-visible !bg-transparent hover:!bg-transparent transition-all duration-300 cursor-pointer"
          )}
          onClick={(e) => {
            onClick?.(e);
            toggleTheme(getNextTheme(effective, modes));
          }}
          {...props}
        >
          {getIcon(effective, resolved, modes)}
        </button>
      )}
    </ThemeTogglerPrimitive>
  );
}

export { ThemeTogglerButton, type ThemeTogglerButtonProps };
