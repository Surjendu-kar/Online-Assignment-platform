"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ExamDetailsSkeleton() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        fontFamily: '"Ubuntu", sans-serif',
      }}
    >
      {/* Decorative Floating Orbs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-[10%] w-72 h-72 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-[15%] w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto relative z-10"
      >
        <div className="grid gap-6 lg:grid-cols-3 p-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-none backdrop-blur-sm bg-background/80 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Skeleton className="h-4 w-28 mb-2" />
                  <div className="py-3 px-3 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-5 w-full" />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Skeleton className="h-4 w-32 mb-3" />
                  <div className="flex flex-wrap gap-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 flex-1 min-w-[150px]" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Quick Stats Skeleton */}
            <Card className="shadow-none backdrop-blur-sm bg-background/80 border-primary/20">
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions Skeleton */}
            <Card className="shadow-none backdrop-blur-sm bg-background/80 border-primary/20">
              <CardHeader>
                <Skeleton className="h-4 w-12" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
