"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/animate-ui/components/radix/dialog";
import { Badge } from "@/components/ui/badge";
import { QuestionSkeleton } from "@/components/QuestionSkeleton";

interface Question {
  question_number: number;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  student_answer: string | null;
  is_correct: boolean;
  points: number;
  earned_points: number;
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

  const fetchDetailedResult = useCallback(async () => {
    if (!result) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/student/results/${result.id}`);
      const data = await response.json();

      if (response.ok) {
        setDetailedResult(data.result);
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

  if (!result) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        from="bottom"
        showCloseButton={true}
        className="sm:max-w-[900px]"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary capitalize">
            {result.exam_title}
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>Review your answers and correct solutions</p>
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
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 min-h-[300px]">
          {loading ? (
            <QuestionSkeleton />
          ) : detailedResult?.questions &&
            detailedResult.questions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {detailedResult.questions.map((q) => (
                <div
                  key={q.question_number}
                  className={`border rounded-lg p-4 space-y-3 ${
                    q.question_type !== "mcq" ? "lg:col-span-2" : ""
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-3 pb-2 border-b">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          Q{q.question_number}
                        </Badge>
                        <h4 className="font-semibold text-base leading-relaxed">
                          {q.question_text}
                        </h4>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {q.question_type}
                    </Badge>
                  </div>

                  {q.question_type === "mcq" && q.options.length > 0 && (
                    <div className="space-y-2">
                      {q.options.map((option, idx) => {
                        const isCorrect = option === q.correct_answer;
                        const isSelected = option === q.student_answer;

                        return (
                          <div
                            key={idx}
                            className={`p-2 rounded border ${
                              isCorrect
                                ? "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-800"
                                : isSelected
                                ? "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-800"
                                : "bg-muted/30 border-transparent"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={
                                  isCorrect || isSelected ? "font-medium" : ""
                                }
                              >
                                {option}
                              </span>
                              {isCorrect && (
                                <Badge className="bg-green-600 text-white ml-2">
                                  Correct
                                </Badge>
                              )}
                              {isSelected && !isCorrect && (
                                <Badge variant="destructive" className="ml-2">
                                  Your Answer
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.question_type !== "mcq" && (
                    <div className="space-y-3">
                      <div className="p-3 rounded bg-red-50 border border-red-300 dark:bg-red-950/30 dark:border-red-800">
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                          Your Answer:
                        </p>
                        <p className="font-medium whitespace-pre-wrap">
                          {q.student_answer || "Not answered"}
                        </p>
                      </div>
                      <div className="p-3 rounded bg-green-50 border border-green-300 dark:bg-green-950/30 dark:border-green-800">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                          Correct Answer:
                        </p>
                        <p className="font-medium whitespace-pre-wrap">
                          {q.correct_answer}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground">
                    Points: {q.earned_points}/{q.points}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No question details available
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="default" type="button">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
