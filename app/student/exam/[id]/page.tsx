"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams } from "next/navigation";
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
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Timer,
  Home,
} from "lucide-react";
import { GrFlag } from "react-icons/gr";
import { GrFlagFill } from "react-icons/gr";

interface Question {
  id: string;
  type: "multiple-choice" | "essay" | "true-false";
  question: string;
  options?: string[];
  points: number;
  timeLimit?: number;
}

interface ExamSession {
  id: string;
  title: string;
  subject: string;
  totalQuestions: number;
  timeLimit: number; // in minutes
  questions: Question[];
  startTime: Date;
  instructions: string;
}

const mockExamSessions: { [key: string]: ExamSession } = {
  "exam-001": {
    id: "exam-001",
    title: "Mathematics Final Exam",
    subject: "Mathematics",
    totalQuestions: 10,
    timeLimit: 120, // 2 hours
    startTime: new Date(),
    instructions:
      "Read all questions carefully. You have 2 hours to complete this exam. Make sure to save your answers regularly.",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What is the derivative of f(x) = x² + 3x + 2?",
        options: ["2x + 3", "x² + 3", "2x + 2", "x + 3"],
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "Which of the following is a prime number?",
        options: ["15", "21", "17", "25"],
        points: 5,
      },
      {
        id: "q3",
        type: "essay",
        question:
          "Explain the fundamental theorem of calculus and provide an example of its application.",
        points: 15,
      },
      {
        id: "q4",
        type: "true-false",
        question: "The integral of sin(x) is -cos(x) + C.",
        options: ["True", "False"],
        points: 3,
      },
      {
        id: "q5",
        type: "multiple-choice",
        question: "What is the value of π (pi) to 3 decimal places?",
        options: ["3.141", "3.142", "3.143", "3.140"],
        points: 5,
      },
      {
        id: "q6",
        type: "essay",
        question:
          "Describe three different methods for solving quadratic equations and give an example for each.",
        points: 20,
      },
      {
        id: "q7",
        type: "multiple-choice",
        question: "If f(x) = 2x + 1, what is f(3)?",
        options: ["5", "6", "7", "8"],
        points: 5,
      },
      {
        id: "q8",
        type: "true-false",
        question: "A function can have more than one y-intercept.",
        options: ["True", "False"],
        points: 3,
      },
      {
        id: "q9",
        type: "multiple-choice",
        question:
          "What is the slope of the line passing through points (2, 3) and (4, 7)?",
        options: ["2", "3", "4", "1"],
        points: 5,
      },
      {
        id: "q10",
        type: "essay",
        question:
          "Prove that the sum of the first n natural numbers is n(n+1)/2.",
        points: 25,
      },
    ],
  },
  "exam-002": {
    id: "exam-002",
    title: "Physics Quiz Chapter 5",
    subject: "Physics",
    totalQuestions: 5,
    timeLimit: 45,
    startTime: new Date(),
    instructions:
      "Answer all questions. Show your work for calculation problems.",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "What is the unit of force in the SI system?",
        options: ["Newton", "Joule", "Watt", "Pascal"],
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question:
          "Which law states that for every action, there is an equal and opposite reaction?",
        options: [
          "Newton's First Law",
          "Newton's Second Law",
          "Newton's Third Law",
          "Law of Conservation",
        ],
        points: 5,
      },
      {
        id: "q3",
        type: "essay",
        question:
          "Calculate the force required to accelerate a 10 kg object at 5 m/s². Show your work.",
        points: 15,
      },
      {
        id: "q4",
        type: "true-false",
        question: "Velocity is a scalar quantity.",
        options: ["True", "False"],
        points: 3,
      },
      {
        id: "q5",
        type: "essay",
        question: "Explain the concept of momentum and provide the formula.",
        points: 12,
      },
    ],
  },
};

interface Answer {
  questionId: string;
  answer: string;
  flagged: boolean;
}

export default function StudentExamPage() {
  const params = useParams();
  const examId = params.id as string;

  const [examSession, setExamSession] = useState<ExamSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: Answer }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  // Load exam session
  useEffect(() => {
    const session = mockExamSessions[examId];
    if (session) {
      setExamSession(session);
      setTimeRemaining(session.timeLimit * 60); // Convert to seconds
    }
  }, [examId]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted && examStarted) {
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
  }, [timeRemaining, isSubmitted, examStarted]);

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
    // Here you would typically send the answers to your backend
    console.log("Exam submitted with answers:", answers);
  };

  const startExam = () => {
    setExamStarted(true);
  };

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
              onClick={() => window.history.back()}
            >
              <Home className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto p-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span>{examSession.title}</span>
            </CardTitle>
            <CardDescription>{examSession.subject}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Time Limit</p>
                  <p className="text-sm text-muted-foreground">
                    {examSession.timeLimit} minutes
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Questions</p>
                  <p className="text-sm text-muted-foreground">
                    {examSession.totalQuestions} questions
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Total Points</p>
                  <p className="text-sm text-muted-foreground">
                    {examSession.questions.reduce(
                      (sum, q) => sum + q.points,
                      0
                    )}{" "}
                    points
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <p className="text-sm">{examSession.instructions}</p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Important Notes:
                  </h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                    <li>
                      • Once you start the exam, the timer cannot be paused
                    </li>
                    <li>• Make sure you have a stable internet connection</li>
                    <li>• Save your answers regularly</li>
                    <li>• You can flag questions for review</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={startExam}>
              Start Exam
            </Button>
          </CardContent>
        </Card>
      </motion.div>
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
              Your answers have been recorded and will be reviewed
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
            <Button
              className="w-full"
              onClick={() => (window.location.href = "/student")}
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
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
      className="max-w-6xl mx-auto p-6"
    >
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>{examSession.title}</span>
              </CardTitle>
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
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFlag(currentQ.id)}
                      className={
                        answers[currentQ.id]?.flagged
                          ? "bg-red-100 border-red-300"
                          : ""
                      }
                    >
                      {answers[currentQ.id]?.flagged ? (
                        <GrFlagFill className="h-4 w-4 mr-2" />
                      ) : (
                        <GrFlag className="h-4 w-4 mr-2" />
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
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
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

                  // Check if navigation to this question is allowed
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
                      ? "!bg-gray-800 hover:!bg-gray-700 !text-white !border-gray-600"
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
