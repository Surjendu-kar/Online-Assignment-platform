"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";

// Custom hook to get current breakpoint
function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState("");

  React.useEffect(() => {
    function updateBreakpoint() {
      const width = window.innerWidth;
      if (width >= 1024) {
        setBreakpoint("lg");
      } else if (width >= 768) {
        setBreakpoint("md");
      } else {
        setBreakpoint("sm");
      }
    }

    // Set initial breakpoint immediately
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}

interface LoadingAnimationProps {
  onComplete: () => void;
}

export function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [count, setCount] = React.useState(0);
  const [loadingComplete, setLoadingComplete] = React.useState(false);
  const breakpoint = useBreakpoint();

  // Loading counter animation
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setLoadingComplete(true);
          // Call onComplete after a short delay to show the completion
          setTimeout(() => {
            onComplete();
          }, 3000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  const initialWidths = {
    lg: "80%",
    md: "80%",
    sm: "85%",
  };

  const initialHeights = {
    lg: "80vh",
    md: "80vh",
    sm: "85vh",
  };

  const getDimension = (dimensions: Record<string, string>) => {
    if (!breakpoint) return dimensions.sm;
    if (breakpoint === "lg") return dimensions.lg;
    if (breakpoint === "md") return dimensions.md;
    return dimensions.sm;
  };

  // Font sizes for each breakpoint
  const initialFontSizes = {
    lg: "5rem",
    md: "4.5rem",
    sm: "3.5rem",
  };
  const animateFontSizes = {
    lg: "6rem",
    md: "5rem",
    sm: "4rem",
  };

  const initialLineHeights = {
    lg: "5rem",
    md: "3.5rem",
    sm: "3rem",
  };
  const animateLineHeights = {
    lg: "6rem",
    md: "4rem",
    sm: "3.5rem",
  };

  const getFontSize = (sizes: Record<string, string>) => {
    if (!breakpoint) return sizes.sm;
    if (breakpoint === "lg") return sizes.lg;
    if (breakpoint === "md") return sizes.md;
    return sizes.sm;
  };

  // Don't render until breakpoint is determined
  if (!breakpoint) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-screen bg-black flex items-center justify-center"
      />
    );
  }

  // Text array for online assignment platform
  const getTextArray = () => {
    if (breakpoint === "sm") {
      return ["online", "assignment", "platform"];
    } else {
      return ["online assignment", "platform"];
    }
  };

  const textArray = getTextArray();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: loadingComplete ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, delay: loadingComplete ? 2.5 : 0 }}
      className="fixed inset-0 z-50 w-full h-screen bg-black flex items-center justify-center"
    >
      <motion.div
        initial={{
          width: getDimension(initialWidths),
          height: getDimension(initialHeights),
          borderRadius: "15px",
          opacity: 0.7,
        }}
        animate={{
          width: loadingComplete ? "100%" : getDimension(initialWidths),
          height: loadingComplete ? "100vh" : getDimension(initialHeights),
          borderRadius: loadingComplete ? "0px" : "15px",
          opacity: 1,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-1 overflow-hidden border border-slate-700/50"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/30 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/30 rounded-full"
          />
        </div>

        {/* Text Structure */}
        <div className="textstructure mt-52 lg:mt-40 px-5 lg:px-14 relative z-10">
          {textArray.map((text, index) => (
            <div className="masker" key={index}>
              <div className="w-fit flex items-center gap-3">
                {/* Logo/Icon for "online assignment" or "online" */}
                {((breakpoint === "sm" && text === "online") ||
                  (breakpoint !== "sm" && text === "online assignment")) && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                      width: loadingComplete ? "8rem" : 0,
                      opacity: loadingComplete ? 1 : 0,
                    }}
                    transition={{
                      duration: 1,
                      ease: [0.76, 0, 0.24, 1],
                      delay: loadingComplete ? 1 : 0,
                    }}
                    className="overflow-hidden relative top-1 left-1 lg:top-2 h-[3.2rem] md:h-[4rem] lg:h-[5.8rem] lg:w-[4rem] rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                  />
                )}
                <motion.h1
                  initial={{
                    fontSize: getFontSize(initialFontSizes),
                    lineHeight: getFontSize(initialLineHeights),
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    fontSize: getFontSize(animateFontSizes),
                    lineHeight: getFontSize(animateLineHeights),
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.2 + index * 0.3,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className="font-bold uppercase bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent antialiased"
                >
                  {text}
                </motion.h1>
              </div>
            </div>
          ))}
        </div>

        {/* Loading UI */}
        <AnimatePresence>
          {!loadingComplete ? (
            <motion.div
              key="loading-ui"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full bottom-0"
            >
              <div className="flex justify-between items-center px-4 py-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-slate-400 text-[14px] lg:text-[16px]"
                >
                  Initializing platform...
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-slate-300 text-3xl lg:text-4xl font-semibold"
                >
                  {count}%
                </motion.div>
              </div>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${count}%` }}
                className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </motion.div>
          ) : (
            <motion.div
              key="completion-ui"
              className="absolute bottom-0 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="border-t-[1px] border-slate-600"
              />
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
                className="flex flex-col md:flex-row items-center justify-between py-4 px-5 lg:px-14"
              >
                <div className="text-[14px] md:text-[16px] lg:text-[17px] leading-6 text-slate-300">
                  Welcome to your assignment platform
                </div>
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-green-400 text-xl mt-2 md:mt-0"
                >
                  ✅ Ready
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
