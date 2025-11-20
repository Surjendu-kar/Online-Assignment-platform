"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  if (!mounted) return null;

  return (
    <div
      className="w-full min-h-screen relative bg-background overflow-hidden flex items-center justify-center"
      style={{
        fontFamily: '"Ubuntu", sans-serif',
      }}
    >
      {/* Decorative Floating Orbs - Same as HeroSection */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-1/3 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-3xl mx-auto px-6 text-center">
        {/* Animated 404 Number */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          className="mb-8"
        >
          <motion.h1
            className="text-[120px] md:text-[180px] font-extrabold leading-none"
            style={{
              fontFamily: '"Ubuntu", sans-serif',
              fontWeight: 700,
            }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">
              404
            </span>
          </motion.h1>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{
            fontFamily: '"Ubuntu", sans-serif',
            fontWeight: 700,
          }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Page Not Found
          </span>
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-muted-foreground text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed"
        >
          Oops! The page you&apos;re looking for seems to have vanished into the
          digital void. Let&apos;s get you back on track.
        </motion.p>

        {/* Auto-redirect Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-8"
        >
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </motion.div>
            <span>Redirecting to home in {countdown} seconds...</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
