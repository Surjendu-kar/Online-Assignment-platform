"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExamDetailsSkeleton } from "@/components/ExamDetailsSkeleton";
import {
  mockExamSessions,
  type ExamSession,
} from "@/lib/mock-data/exam-sessions";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Play,
  FileText,
  Target,
  Home,
  Loader2,
} from "lucide-react";

export default function StudentExamOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [examSession, setExamSession] = useState<ExamSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    const session = mockExamSessions[examId];
    if (session) {
      setExamSession({
        ...session,
        totalPoints: session.questions.reduce((sum, q) => sum + q.points, 0),
      });
    }
    setLoading(false);
  }, [examId]);

  const startExam = () => {
    setNavigating(true);

    // Add delay for smooth transition effect
    setTimeout(() => {
      router.push(`/student/exam/${examId}/start`);
    }, 800);
  };

  if (loading) {
    return <ExamDetailsSkeleton />;
  }

  if (!examSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Exam Not Found</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The exam you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button
              className="w-full mt-4"
              onClick={() => router.push("/student")}
            >
              <Home className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "mcq":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "saq":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "coding":
        return <Target className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const questionTypeCounts = examSession.questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: navigating ? 0 : 1,
        filter: navigating ? "blur(8px)" : "blur(0px)",
        scale: navigating ? 0.95 : 1,
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="space-y-6"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Exam Overview</span>
              </CardTitle>
              <CardDescription>
                {examSession.title} - {examSession.subject}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-semibold">
                      {examSession.timeLimit} minutes
                    </p>
                    <p className="text-sm text-muted-foreground">Time Limit</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-semibold">
                      {examSession.totalQuestions}
                    </p>
                    <p className="text-sm text-muted-foreground">Questions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                  <Target className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="font-semibold">{examSession.totalPoints}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Points
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Instructions:</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {examSession.instructions}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Question Types:</h3>
                  <div className="space-y-2">
                    {Object.entries(questionTypeCounts).map(([type, count]) => (
                      <div
                        key={type}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded"
                      >
                        <div className="flex items-center space-x-2">
                          {getQuestionTypeIcon(type)}
                          <span className="capitalize text-sm">
                            {type === "mcq"
                              ? "Multiple Choice"
                              : type === "saq"
                              ? "Short Answer"
                              : type === "coding"
                              ? "Coding"
                              : type.replace("-", " ")}
                          </span>
                        </div>
                        <Badge variant="outline">{count} questions</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">
                    {examSession.timeLimit} min
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Questions:</span>
                  <span className="font-medium">
                    {examSession.totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Points:</span>
                  <span className="font-medium">{examSession.totalPoints}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Passing Score:</span>
                  <span className="font-medium">
                    {examSession.passingScore}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full hover:scale-105 transition-all duration-200"
                onClick={startExam}
                disabled={navigating}
              >
                {navigating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Starting Exam...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Exam
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/student")}
                disabled={navigating}
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={examSession.teacher} />
                  <AvatarFallback>
                    {examSession.teacher
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{examSession.teacher}</p>
                  <p className="text-sm text-muted-foreground">
                    {examSession.subject} Instructor
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
