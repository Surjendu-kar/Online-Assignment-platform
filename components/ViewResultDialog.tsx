"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/animate-ui/components/radix/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import ViewResultSkeleton from "@/components/skeleton/ViewResultSkeleton";

interface Question {
  question_number: number;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  student_answer: string | null;
  is_correct: boolean;
  points: number;
  earned_points: number | null;
  teacher_feedback?: string | null;
}

interface ExamResult {
  id: string;
  exam_id: string;
  exam_title: string;
  department: string;
  submitted_at: string;
  total_questions: number;
  answered_questions: number;
  total_score: number;
  max_possible_score: number;
  percentage: number;
  grading_status: "completed" | "partial" | "pending";
}

interface DetailedResult extends ExamResult {
  questions: Question[];
}

interface ViewResultDialogProps {
  result: ExamResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewResultDialog({
  result,
  isOpen,
  onClose,
}: ViewResultDialogProps) {
  const [detailedResult, setDetailedResult] = useState<DetailedResult | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const fetchDetailedResult = useCallback(async () => {
    if (!result) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/student/results/${result.id}`);
      const data = await response.json();

      if (response.ok) {
        setDetailedResult(data.result);
        setCurrentQuestionIndex(0); // Reset to first question
      }
    } catch (error) {
      console.error("Error fetching result details:", error);
    } finally {
      setLoading(false);
    }
  }, [result]);

  useEffect(() => {
    if (isOpen && result) {
      fetchDetailedResult();
    }
  }, [isOpen, result, fetchDetailedResult]);

  const handleNextQuestion = () => {
    if (
      detailedResult &&
      currentQuestionIndex < detailedResult.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionNavigate = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (!result) return null;

  const questions = detailedResult?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 3px;
          margin: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 3px;
          margin: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        .scrollbar-thin {
          scrollbar-gutter: stable;
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          from="bottom"
          showCloseButton={true}
          className="pr-2 min-w-[70vw] max-h-[80vh] overflow-hidden flex flex-col"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary capitalize">
              {result.exam_title}
            </DialogTitle>
            {!loading && (
              <div className="space-y-2">
                <DialogDescription>
                  Review your answers and feedback
                </DialogDescription>
                <div className="flex items-center gap-4 text-sm pt-2">
                  <span className="font-medium">
                    Score:{" "}
                    <span className="text-primary">
                      {result.total_score}/{result.max_possible_score}
                    </span>
                  </span>
                  <span className="font-medium">
                    Percentage:{" "}
                    <span className="text-primary">{result.percentage}%</span>
                  </span>
                  <span className="font-medium">
                    Department:{" "}
                    <span className="text-primary">{result.department}</span>
                  </span>
                </div>
              </div>
            )}
          </DialogHeader>

          {loading ? (
            <ViewResultSkeleton />
          ) : (
            <div className="flex flex-1 gap-4 overflow-hidden">
              {/* Question Navigator Sidebar */}
              <div className="w-48 bg-muted/30 rounded-lg p-4 overflow-y-auto">
                <h3 className="font-semibold mb-3 text-sm">Questions</h3>
                <div className="grid grid-cols-4 gap-2">
                  {questions.map((q, index) => {
                    const isGraded = q.earned_points !== null && q.earned_points !== undefined;
                    const earnedPoints = q.earned_points ?? 0;
                    return (
                      <Button
                        key={q.question_number}
                        variant={
                          index === currentQuestionIndex ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleQuestionNavigate(index)}
                        className={`h-8 w-full relative ${
                          !isGraded
                            ? "border-gray-500"
                            : earnedPoints === q.points
                            ? "border-green-500"
                            : earnedPoints > 0
                            ? "border-yellow-500"
                            : "border-red-500"
                        }`}
                      >
                        <span>{index + 1}</span>
                        {isGraded && earnedPoints === q.points && (
                          <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-500" />
                        )}
                        {isGraded && earnedPoints > 0 && earnedPoints < q.points && (
                          <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500" />
                        )}
                        {isGraded && earnedPoints === 0 && (
                          <XCircle className="absolute -top-1 -right-1 h-3 w-3 text-red-500" />
                        )}
                      </Button>
                    );
                  })}
                </div>

                {/* Legend */}
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground">
                    Status
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Full Marks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-yellow-500" />
                      <span>Partial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-3 w-3 text-red-500" />
                      <span>0 Marks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded border-2 border-gray-500" />
                      <span>Not Graded</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Display Area */}
              <div className="flex flex-col overflow-hidden min-h-0 w-full">
                <div className="overflow-y-auto overflow-x-hidden h-[385px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-4">
                  <AnimatePresence mode="wait">
                    {currentQuestion && (
                      <motion.div
                        key={currentQuestion.question_number}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="gap-2">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <p className="mt-2 text-sm whitespace-pre-wrap capitalize">
                                {currentQuestion.question_text}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="capitalize">
                                  {currentQuestion.question_type}
                                </Badge>
                                <Badge>{currentQuestion.points} marks</Badge>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* MCQ Question Display */}
                            {currentQuestion.question_type === "mcq" &&
                              currentQuestion.options.length > 0 && (
                                <div className="space-y-4">
                                  <div className="space-y-2 mt-2">
                                    {currentQuestion.options.map(
                                      (option, idx) => {
                                        const isCorrect =
                                          option ===
                                          currentQuestion.correct_answer;
                                        const isSelected =
                                          option ===
                                          currentQuestion.student_answer;

                                        return (
                                          <div
                                            key={idx}
                                            className={`p-3 rounded-lg border ${
                                              isCorrect
                                                ? "bg-green-500/10 border-green-500"
                                                : isSelected
                                                ? "bg-red-500/10 border-red-500"
                                                : "bg-muted/30"
                                            }`}
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="text-sm lowercase">
                                                {String.fromCharCode(65 + idx)}.{" "}
                                                <span className="capitalize">
                                                  {option}
                                                </span>
                                              </span>
                                              {isCorrect && (
                                                <Badge className="bg-green-500">
                                                  <CheckCircle className="h-3 w-3 mr-1" />
                                                  Correct
                                                </Badge>
                                              )}
                                              {isSelected && !isCorrect && (
                                                <Badge className="bg-red-500 text-sm">
                                                  <XCircle className="h-3 w-3 mr-1" />
                                                  Your Answer
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg text-sm">
                                    <span className="font-semibold">
                                      Result:
                                    </span>
                                    {currentQuestion.earned_points !== null && currentQuestion.earned_points !== undefined ? (
                                      <Badge
                                        className={
                                          currentQuestion.earned_points ===
                                          currentQuestion.points
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        }
                                      >
                                        {currentQuestion.earned_points} /{" "}
                                        {currentQuestion.points}
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary">
                                        Not graded yet
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* SAQ and Coding Question Display */}
                            {currentQuestion.question_type !== "mcq" && (
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-base font-semibold text-sm">
                                    Your Answer:
                                  </Label>
                                  <div
                                    className={`mt-2 p-3 rounded-lg border ${
                                      currentQuestion.earned_points === 0
                                        ? "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-800"
                                        : "bg-muted/50 border-muted"
                                    }`}
                                  >
                                    <p className="text-sm whitespace-pre-wrap">
                                      {currentQuestion.student_answer ||
                                        "No answer provided"}
                                    </p>
                                  </div>
                                </div>

                                {/* Teacher Feedback */}
                                {currentQuestion.teacher_feedback && (
                                  <div>
                                    <Label className="text-base font-semibold text-sm">
                                      Teacher Feedback:
                                    </Label>
                                    <div className="mt-2 p-3 bg-blue-50 border border-blue-300 dark:bg-blue-950/30 dark:border-blue-800 rounded-lg">
                                      <p className="text-sm whitespace-pre-wrap text-blue-700 dark:text-blue-400 capitalize">
                                        {currentQuestion.teacher_feedback}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Marks Display */}
                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg text-sm">
                                  <span className="font-semibold">
                                    Marks Obtained:
                                  </span>
                                  {currentQuestion.earned_points !== null && currentQuestion.earned_points !== undefined ? (
                                    <Badge
                                      className={
                                        currentQuestion.earned_points ===
                                        currentQuestion.points
                                          ? "bg-green-500"
                                          : currentQuestion.earned_points > 0
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                      }
                                    >
                                      {currentQuestion.earned_points} /{" "}
                                      {currentQuestion.points}
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">
                                      Not graded yet
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>

                  <Button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    variant="outline"
                    className="mr-5"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
