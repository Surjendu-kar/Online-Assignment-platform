"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Calendar,
  FileText,
  Play,
  Trophy,
  Sparkles,
} from "lucide-react";
import { formatDuration } from "@/lib/format-duration";
import { ExamsListSkeleton } from "@/components/ExamsListSkeleton";

interface Exam {
  id: string;
  title: string;
  department: string;
  startTime: string | null;
  endTime: string | null;
  duration: number;
  totalQuestions: number;
  status: "pending" | "in-progress" | "completed" | "expired" | "upcoming";
  score?: number | null;
  sessionId?: string | null;
}

export default function ExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigatingExamId, setNavigatingExamId] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "completed" | "expired"
  >("all");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !document.getElementById("ubuntu-font-global")
    ) {
      // Preconnect to Google Fonts
      const preconnect1 = document.createElement("link");
      preconnect1.rel = "preconnect";
      preconnect1.href = "https://fonts.googleapis.com";
      if (
        !document.querySelector('link[href="https://fonts.googleapis.com"]')
      ) {
        document.head.appendChild(preconnect1);
      }

      const preconnect2 = document.createElement("link");
      preconnect2.rel = "preconnect";
      preconnect2.href = "https://fonts.gstatic.com";
      preconnect2.setAttribute("crossorigin", "anonymous");
      if (!document.querySelector('link[href="https://fonts.gstatic.com"]')) {
        document.head.appendChild(preconnect2);
      }

      // Load Ubuntu font
      const link = document.createElement("link");
      link.id = "ubuntu-font-global";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/student/assigned-exams");
      const data = await response.json();

      if (response.ok) {
        setExams(data);
      } else {
        console.error("Error fetching exams:", data.error);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "upcoming":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  const startExam = (examId: string) => {
    setNavigatingExamId(examId);
    router.push(`/student/exam/${examId}`);
  };

  const filteredExams = exams.filter((exam) => {
    if (filter === "all") return true;
    if (filter === "pending")
      return exam.status === "pending" || exam.status === "upcoming";
    if (filter === "completed") return exam.status === "completed";
    if (filter === "expired") return exam.status === "expired";
    return true;
  });

  return (
    <div
      className="relative h-full overflow-hidden"
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col gap-6 p-6 h-full"
      >
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="h-8 w-8 text-primary" />
            </motion.div>
            <h1
              className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-purple-600 dark:from-primary dark:via-blue-400 dark:to-purple-400"
              style={{
                fontFamily: '"Ubuntu", sans-serif',
                fontWeight: 700,
              }}
            >
              Your Exams
            </h1>
          </div>
          <p
            className="text-muted-foreground text-base"
            style={{
              fontFamily: '"Ubuntu", sans-serif',
              fontWeight: 400,
            }}
          >
            View your upcoming and past exams
          </p>
        </motion.div>

        {/* Enhanced Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-2 flex-wrap"
        >
          {[
            { key: "all", label: "All", count: exams.length },
            {
              key: "pending",
              label: "Pending",
              count: exams.filter(
                (e) => e.status === "pending" || e.status === "upcoming"
              ).length,
            },
            {
              key: "completed",
              label: "Completed",
              count: exams.filter((e) => e.status === "completed").length,
            },
            {
              key: "expired",
              label: "Expired",
              count: exams.filter((e) => e.status === "expired").length,
            },
          ].map((tab, index) => (
            <motion.div
              key={tab.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={filter === tab.key ? "default" : "outline"}
                onClick={() =>
                  setFilter(
                    tab.key as "all" | "pending" | "completed" | "expired"
                  )
                }
                size="sm"
                className="relative overflow-hidden"
                style={{
                  fontFamily: '"Ubuntu", sans-serif',
                  fontWeight: 500,
                }}
              >
                {filter === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 text-[13px]">
                  {tab.label} ({tab.count})
                </span>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid gap-6 flex-1"
        >
          {loading ? (
            <Card className="border-none p-0 backdrop-blur-sm bg-background/80 border-primary/20 shadow-none">
              <CardContent className="border-none p-0">
                <ExamsListSkeleton />
              </CardContent>
            </Card>
          ) : filteredExams.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-muted-foreground"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
                </motion.div>
                <p
                  className="text-lg"
                  style={{
                    fontFamily: '"Ubuntu", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  No exams found
                </p>
              </motion.div>
            </div>
          ) : (
            <Card className="border-none p-0 shadow-none bg-transition">
              <CardContent className="border-none p-0">
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {filteredExams.map((exam, index) => (
                      <motion.div
                        key={exam.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.05,
                          layout: { duration: 0.3 },
                        }}
                        className="flex items-center justify-between rounded-lg border border-primary/20 p-5 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg dark:hover:shadow-[0_10px_20px_-5px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3
                              className="font-semibold text-base capitalize"
                              style={{
                                fontFamily: '"Ubuntu", sans-serif',
                                fontWeight: 500,
                              }}
                            >
                              {exam.title}
                            </h3>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.2 + index * 0.05,
                                type: "spring",
                                stiffness: 200,
                              }}
                            >
                              <Badge className={getStatusColor(exam.status)}>
                                {getStatusLabel(exam.status)}
                              </Badge>
                            </motion.div>
                          </div>
                          <p
                            className="text-xs text-muted-foreground mb-3"
                            style={{
                              fontFamily: '"Ubuntu", sans-serif',
                              fontWeight: 400,
                            }}
                          >
                            {exam.department}
                          </p>
                          <div className="flex items-center gap-6 text-xs text-muted-foreground flex-wrap">
                            <motion.div
                              className="flex items-center gap-1"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Clock className="h-3 w-3" />
                              <span>{formatDuration(exam.duration)}</span>
                            </motion.div>
                            <motion.div
                              className="flex items-center gap-1"
                              whileHover={{ scale: 1.05 }}
                            >
                              <FileText className="h-3 w-3" />
                              <span>{exam.totalQuestions} questions</span>
                            </motion.div>
                            {exam.endTime && (
                              <motion.div
                                className="flex items-center gap-1"
                                whileHover={{ scale: 1.05 }}
                              >
                                <Calendar className="h-3 w-3" />
                                <span>
                                  Due:{" "}
                                  {new Date(exam.endTime).toLocaleDateString()}
                                </span>
                              </motion.div>
                            )}
                            {exam.score !== null &&
                              exam.score !== undefined && (
                                <motion.div
                                  className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400"
                                  whileHover={{ scale: 1.1 }}
                                  animate={{
                                    y: [0, -3, 0],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                >
                                  <Trophy className="h-3 w-3" />
                                  <span className="font-semibold">
                                    {exam.score}%
                                  </span>
                                </motion.div>
                              )}
                          </div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          {exam.status === "upcoming" && (
                            <Button
                              onClick={() => startExam(exam.id)}
                              disabled
                              className="cursor-pointer text-xs"
                              style={{
                                fontFamily: '"Ubuntu", sans-serif',
                                fontWeight: 400,
                              }}
                            >
                              <Play className="h-4 w-4" />
                              Not Started
                            </Button>
                          )}
                          {exam.status === "pending" && (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                onClick={() => startExam(exam.id)}
                                className="cursor-pointer relative overflow-hidden text-xs"
                                disabled={navigatingExamId === exam.id}
                                style={{
                                  fontFamily: '"Ubuntu", sans-serif',
                                  fontWeight: 400,
                                }}
                              >
                                {navigatingExamId === exam.id ? (
                                  <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Loading...
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4" />
                                    View Details
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          )}
                          {exam.status === "in-progress" && (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                onClick={() => {
                                  setNavigatingExamId(exam.id);
                                  router.push(`/student/exam/${exam.id}/start`);
                                }}
                                disabled={navigatingExamId === exam.id}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                                style={{
                                  fontFamily: '"Ubuntu", sans-serif',
                                  fontWeight: 500,
                                }}
                              >
                                {navigatingExamId === exam.id ? (
                                  <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Loading...
                                  </>
                                ) : (
                                  <div className="flex items-center gap-1 text-white">
                                    <Play className="h-4 w-4" />
                                    Continue
                                  </div>
                                )}
                              </Button>
                            </motion.div>
                          )}

                          {exam.status === "expired" && (
                            <Button
                              disabled
                              variant="outline"
                              style={{
                                fontFamily: '"Ubuntu", sans-serif',
                                fontWeight: 500,
                              }}
                            >
                              Expired
                            </Button>
                          )}
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
