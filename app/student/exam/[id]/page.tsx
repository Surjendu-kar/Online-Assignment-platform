"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { ExamDetailsSkeleton } from "@/components/ExamDetailsSkeleton";

interface Question {
  id: string;
  type: "mcq" | "saq" | "coding";
  question_text: string;
  options?: string[];
  correct_option?: number;
  marks: number;
  question_order: number;
  starter_code?: string;
  language?: string;
  grading_guidelines?: string;
}

interface ExamData {
  exam: {
    id: string;
    title: string;
    description: string;
    duration: number;
    startTime: string | null;
    endTime: string | null;
    requireWebcam: boolean;
    maxViolations: number;
    showResultsImmediately: boolean;
    teacherName: string;
  };
  session: {
    id: string;
    status: string;
    startTime: string;
    remainingTime: number;
    violationsCount: number;
  } | null;
  questions: Question[];
  savedAnswers: Record<string, string | number>;
}

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);

  const fetchExamData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student/exam/${examId}`);
      const data = await response.json();

      if (response.ok) {
        setExamData(data);
      } else {
        toast.error(data.error || "Failed to load exam");
        if (response.status === 403) {
          setTimeout(() => router.push("/student/exams"), 2000);
        }
      }
    } catch (error) {
      console.error("Error fetching exam:", error);
      toast.error("Failed to load exam");
    } finally {
      setLoading(false);
    }
  }, [examId, router]);

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
    fetchExamData();
  }, [fetchExamData]);

  const handleStartExam = async () => {
    try {
      setNavigating(true);

      const response = await fetch(`/api/student/exam/${examId}/start`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Exam started! Good luck!");
        setTimeout(() => {
          router.push(`/student/exam/${examId}/start`);
        }, 500);
      } else {
        toast.error(data.error || "Failed to start exam");
        setNavigating(false);
      }
    } catch (error) {
      console.error("Error starting exam:", error);
      toast.error("Failed to start exam");
      setNavigating(false);
    }
  };

  if (loading) {
    return <ExamDetailsSkeleton />;
  }

  if (!examData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load exam. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalMarks = examData.questions.reduce((sum, q) => sum + q.marks, 0);
  const questionTypeCounts = examData.questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Format duration with full hours and minutes display
  const formatFullDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h 0m`;
    } else {
      return `${mins}m`;
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "mcq":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-500 border-blue-500/20"
          >
            MCQ
          </Badge>
        );
      case "saq":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-500 border-green-500/20"
          >
            SAQ
          </Badge>
        );
      case "coding":
        return (
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-500 border-purple-500/20"
          >
            Coding
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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
        animate={{
          opacity: navigating ? 0 : 1,
          filter: navigating ? "blur(8px)" : "blur(0px)",
          scale: navigating ? 0.95 : 1,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="container mx-auto relative z-10"
      >
        <div className="grid gap-6 lg:grid-cols-3 p-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="shadow-none backdrop-blur-sm bg-background/80 border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg font-bold capitalize">
                      {examData.exam.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs bg-muted">
                      by {examData.exam.teacherName}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {examData.exam.description ||
                      "Read all questions carefully before answering. Ensure you have a stable internet connection throughout the exam. Good luck!"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-sm">Instructions:</h3>
                    </div>
                    <div className="py-3 px-3 bg-muted/50 rounded-lg">
                      <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                        <li>Once started, the timer cannot be paused</li>
                        <li>Your answers are auto-saved every 30 seconds</li>
                        <li>You can navigate between questions freely</li>
                        <li>Make sure to submit before time runs out</li>
                        {examData.exam.requireWebcam && (
                          <li>Webcam monitoring is enabled for this exam</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-sm">
                      Question Types:
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(questionTypeCounts).map(
                        ([type, count]) => (
                          <motion.div
                            key={type}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg flex-1 min-w-[150px] hover:scale-105 transition-transform duration-200"
                          >
                            {getQuestionTypeIcon(type)}
                            <Badge variant="secondary">{count}</Badge>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="gap-1 shadow-none backdrop-blur-sm bg-background/80 border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-sm">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {formatFullDuration(examData.exam.duration)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Questions:</span>
                    <span className="font-medium">
                      {examData.questions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Points:</span>
                    <span className="font-medium">{totalMarks}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="gap-3 shadow-none backdrop-blur-sm bg-background/80 border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-sm">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    size="lg"
                    className="w-full cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                    onClick={handleStartExam}
                    disabled={navigating}
                  >
                    {navigating ? (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Starting Exam...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm">
                        <Send className="h-4 w-4" />
                        Start Exam
                      </div>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                    onClick={() => router.push("/student/exams")}
                    disabled={navigating}
                  >
                    Back to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
