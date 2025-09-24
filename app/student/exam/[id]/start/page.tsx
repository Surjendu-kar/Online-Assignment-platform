"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/animate-ui/components/radix/dialog";
import {
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Timer,
  Home,
  Loader2,
} from "lucide-react";
import { GrFlag } from "react-icons/gr";
import { GrFlagFill } from "react-icons/gr";
import {
  mockExamSessions,
  type ExamSession,
  type Question,
} from "@/lib/mock-data/exam-sessions";

interface Answer {
  questionId: string;
  answer: string;
  flagged: boolean;
}

export default function ExamStartPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [examSession, setExamSession] = useState<ExamSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: Answer }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load exam session
  useEffect(() => {
    const session = mockExamSessions[examId];
    if (session) {
      setExamSession(session);
      setTimeRemaining(session.timeLimit * 60);
    }
    setLoading(false);
  }, [examId]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        answer,
        flagged: prev[questionId]?.flagged || false,
      },
    }));
  };

  const toggleFlag = (questionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        answer: prev[questionId]?.answer || "",
        flagged: !prev[questionId]?.flagged,
      },
    }));
  };

  const getAnsweredQuestions = () => {
    return Object.values(answers).filter(
      (answer) => answer.answer.trim() !== ""
    ).length;
  };

  const getFlaggedQuestions = () => {
    return Object.values(answers).filter((answer) => answer.flagged).length;
  };

  const handleSubmitExam = () => {
    setShowWarning(true);
  };

  const confirmSubmit = () => {
    setIsSubmitted(true);
    setShowWarning(false);
    setRedirecting(true);
    console.log("Exam submitted with answers:", answers);

    // Auto redirect to dashboard after 3 seconds
    setTimeout(() => {
      router.push("/student");
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading Exam...</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please wait while we prepare your exam.
            </p>
          </CardContent>
        </Card>
      </div>
    );
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

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-6"
      >
        <Card>
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <CardTitle className="text-2xl">
              Exam Submitted Successfully!
            </CardTitle>
            <CardDescription>
              {redirecting ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Redirecting to dashboard in a moment...</span>
                </div>
              ) : (
                "Your answers have been recorded and will be reviewed"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="font-semibold">Questions Answered</p>
                <p className="text-2xl font-bold text-green-600">
                  {getAnsweredQuestions()}/{examSession.totalQuestions}
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="font-semibold">Time Used</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatTime(examSession.timeLimit * 60 - timeRemaining)}
                </p>
              </div>
            </div>
            {!redirecting && (
              <Button
                className="w-full"
                onClick={() => router.push("/student")}
              >
                <Home className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentQ = examSession.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / examSession.totalQuestions) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto mt-10"
    >
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{examSession.title}</CardTitle>
              <CardDescription>{examSession.subject}</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-2">
                <Timer className="h-4 w-4" />
                <span>{formatTime(timeRemaining)}</span>
              </Badge>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {examSession.totalQuestions}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Question Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Question {currentQuestion + 1}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {currentQ.points} points
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg">{currentQ.question}</p>

                  {currentQ.type === "multiple-choice" && currentQ.options && (
                    <RadioGroup
                      value={answers[currentQ.id]?.answer || ""}
                      onValueChange={(value) =>
                        handleAnswerChange(currentQ.id, value)
                      }
                    >
                      {currentQ.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${currentQ.id}-${index}`}
                          />
                          <Label
                            htmlFor={`${currentQ.id}-${index}`}
                            className="flex-1 cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {currentQ.type === "true-false" && currentQ.options && (
                    <RadioGroup
                      value={answers[currentQ.id]?.answer || ""}
                      onValueChange={(value) =>
                        handleAnswerChange(currentQ.id, value)
                      }
                    >
                      {currentQ.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`${currentQ.id}-${index}`}
                          />
                          <Label
                            htmlFor={`${currentQ.id}-${index}`}
                            className="cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {currentQ.type === "essay" && (
                    <Textarea
                      placeholder="Type your answer here..."
                      value={answers[currentQ.id]?.answer || ""}
                      onChange={(e) =>
                        handleAnswerChange(currentQ.id, e.target.value)
                      }
                      className="min-h-32"
                    />
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentQuestion(Math.max(0, currentQuestion - 1))
                      }
                      disabled={currentQuestion === 0}
                      className="cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFlag(currentQ.id)}
                      className={
                        answers[currentQ.id]?.flagged
                          ? "bg-red-100 border-red-300 cursor-pointer"
                          : "cursor-pointer"
                      }
                    >
                      {answers[currentQ.id]?.flagged ? (
                        <GrFlagFill className="h-4 w-4" />
                      ) : (
                        <GrFlag className="h-4 w-4" />
                      )}
                      Mark
                    </Button>

                    <Button
                      onClick={() =>
                        setCurrentQuestion(
                          Math.min(
                            examSession.totalQuestions - 1,
                            currentQuestion + 1
                          )
                        )
                      }
                      disabled={
                        currentQuestion === examSession.totalQuestions - 1 ||
                        !answers[currentQ.id]?.answer?.trim()
                      }
                      className="cursor-pointer"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Question Navigator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {examSession.questions.map((_, index) => {
                  const questionId = examSession.questions[index].id;
                  const isAnswered =
                    answers[questionId]?.answer &&
                    answers[questionId].answer.trim() !== "";
                  const isFlagged = answers[questionId]?.flagged;
                  const isCurrent = index === currentQuestion;

                  const canNavigate =
                    isAnswered || isCurrent || index <= currentQuestion;

                  let buttonClass = "";
                  if (isCurrent) {
                    buttonClass =
                      "!bg-blue-500 hover:!bg-blue-600 !text-white !border-blue-500";
                  } else if (isFlagged) {
                    buttonClass =
                      "!bg-red-500 hover:!bg-red-600 !text-white !border-red-500";
                  } else if (isAnswered) {
                    buttonClass =
                      "!bg-green-500 hover:!bg-green-600 !text-white !border-green-500";
                  } else {
                    buttonClass = canNavigate
                      ? "!bg-gray-400 hover:!bg-gray-500 !text-white !border-gray-400"
                      : "!bg-gray-300 !text-gray-500 !border-gray-300 !cursor-not-allowed opacity-50";
                  }

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className={buttonClass}
                      onClick={() => canNavigate && setCurrentQuestion(index)}
                      disabled={!canNavigate}
                    >
                      {index + 1}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Exam Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Exam Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Answered:</span>
                  <span className="font-medium">
                    {getAnsweredQuestions()}/{examSession.totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Flagged:</span>
                  <span className="font-medium">{getFlaggedQuestions()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Time Remaining:</span>
                  <span className="font-medium">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>

              <Button
                variant="destructive"
                className="w-full hover:bg-red-600 hover:scale-105 transition-all duration-200"
                onClick={handleSubmitExam}
              >
                Submit Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent
          from="bottom"
          showCloseButton={true}
          className="sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Submit Exam?</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your exam? You have answered{" "}
              {getAnsweredQuestions()} out of {examSession.totalQuestions}{" "}
              questions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWarning(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmSubmit}
              className="hover:bg-red-600 hover:scale-105 transition-all duration-200"
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
