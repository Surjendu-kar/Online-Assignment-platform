"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  FileText,
  Send,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { formatDuration } from "@/lib/format-duration";
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
          <AlertDescription>Failed to load exam. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalMarks = examData.questions.reduce((sum, q) => sum + q.marks, 0);
  const questionTypeCounts = examData.questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "mcq":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">MCQ</Badge>;
      case "saq":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">SAQ</Badge>;
      case "coding":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Coding</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: navigating ? 0 : 1,
        y: navigating ? 20 : 0,
        filter: navigating ? "blur(8px)" : "blur(0px)",
        scale: navigating ? 0.95 : 1,
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="container mx-auto p-6"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <CardTitle>Exam Overview</CardTitle>
                </div>
                <CardDescription>{examData.exam.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Clock className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-semibold">{formatDuration(examData.exam.duration)}</p>
                      <p className="text-sm text-muted-foreground">Time Limit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <FileText className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-semibold">{examData.questions.length}</p>
                      <p className="text-sm text-muted-foreground">Questions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <BookOpen className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="font-semibold">{totalMarks}</p>
                      <p className="text-sm text-muted-foreground">Total Points</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <h3 className="font-semibold">Instructions:</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {examData.exam.description}
                  </p>
                  <div className="py-3 px-3 bg-muted/50 rounded-lg">
                    <ul className="list-disc list-inside space-y-1 text-sm">
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
                  <h3 className="font-semibold mb-3">Question Types:</h3>
                  <div className="space-y-2">
                    {Object.entries(questionTypeCounts).map(([type, count]) => (
                      <div
                        key={type}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {getQuestionTypeIcon(type)}
                          <span className="text-sm font-medium">
                            {type === "mcq"
                              ? "Multiple Choice"
                              : type === "saq"
                              ? "Short Answer"
                              : type === "coding"
                              ? "Coding"
                              : type}
                          </span>
                        </div>
                        <Badge variant="secondary">{count} questions</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="gap-2">
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{formatDuration(examData.exam.duration)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Questions:</span>
                  <span className="font-medium">{examData.questions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Points:</span>
                  <span className="font-medium">{totalMarks}</span>
                </div>
                
              </CardContent>
            </Card>

            <Card className="gap-3">
              <CardHeader>
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  size="lg"
                  className="w-full cursor-pointer"
                  onClick={handleStartExam}
                  disabled={navigating}
                >
                  {navigating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Starting Exam...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Start Exam
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => router.push("/student/exams")}
                  disabled={navigating}
                >
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    );
}
