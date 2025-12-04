"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/components/radix/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  FileText,
  Loader2,
  Save,
  ChevronDown,
  Play,
} from "lucide-react";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";
import GradingDialogSkeleton from "@/components/skeleton/GradingDialogSkeleton";

interface TestCase {
  input: string;
  output: string;
}

interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

interface ExecutionResult {
  output: string;
  error: boolean;
  testResults?: TestResult[];
  passedCount?: number;
  totalTests?: number;
}

interface Response {
  id: string;
  question_id: string;
  question_type: "mcq" | "saq" | "coding";
  question_text: string;
  question_marks: number;
  student_answer: string | number | null;
  marks_obtained: number | null;
  is_graded: boolean;
  teacher_feedback: string | null;
  // MCQ specific
  options?: string[];
  selected_option?: number;
  correct_option?: number;
  // Coding specific
  language?: string;
  submitted_code?: string;
  test_cases?: TestCase[];
  execution_results?: ExecutionResult;
}

interface GradingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string | null;
  onGradingSaved?: () => void;
}

interface SubmissionDetails {
  session_id: string;
  exam_id: string;
  exam_title: string;
  student_id: string;
  student_name: string;
  student_email: string;
  department: string;
  submitted_at: string;
  start_time: string | null;
  end_time: string | null;
  duration: number | null;
  total_score: number;
  max_possible_score: number;
  responses: Response[];
}

// Reusable animated detail item component
interface AnimatedDetailItemProps {
  label: string;
  value: string;
  delay?: number;
  title?: string;
}

const AnimatedDetailItem = ({
  label,
  value,
  delay = 0,
  title,
}: AnimatedDetailItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    whileHover={{ scale: 1.05, x: 5 }}
    className="transition-all"
  >
    <span className="text-xs text-muted-foreground">{label}</span>
    <p className="font-medium text-sm truncate" title={title}>
      {value}
    </p>
  </motion.div>
);

export const GradingDialog = ({
  isOpen,
  onOpenChange,
  sessionId,
  onGradingSaved,
}: GradingDialogProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submission, setSubmission] = useState<SubmissionDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [gradingData, setGradingData] = useState<
    Record<
      string,
      {
        marks_obtained: number | null;
        teacher_feedback: string | null;
        is_graded: boolean;
      }
    >
  >({});
  const [executingCode, setExecutingCode] = useState<Set<string>>(new Set());
  const [executionResults, setExecutionResults] = useState<
    Record<string, ExecutionResult>
  >({});
  const [customInput, setCustomInput] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<Record<string, "code" | "testcases">>(
    {}
  );

  // Fetch session data when dialog opens
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/teacher/grading/${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch submission data");
        }

        setSubmission(data.submission);

        // Initialize grading data from existing grades
        const initialGrading: Record<
          string,
          {
            marks_obtained: number | null;
            teacher_feedback: string | null;
            is_graded: boolean;
          }
        > = {};
        data.submission.responses.forEach((r: Response) => {
          initialGrading[r.id] = {
            marks_obtained: r.marks_obtained,
            teacher_feedback: r.teacher_feedback,
            is_graded: r.is_graded,
          };
        });
        setGradingData(initialGrading);
      } catch (error) {
        console.error("Error fetching session data:", error);
        toast.error("Failed to load grading data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, sessionId]);

  const handleGradingChange = (
    responseId: string,
    field: "marks_obtained" | "teacher_feedback",
    value: number | string | null
  ) => {
    // For marks_obtained, ensure it's an integer (no decimals)
    if (field === "marks_obtained" && value !== null) {
      // If it's a number, round it to nearest integer
      if (typeof value === "number") {
        value = Math.floor(value);
      }
    }

    setGradingData((prev) => ({
      ...prev,
      [responseId]: {
        ...prev[responseId],
        [field]: value,
        // Auto-mark as graded when marks are entered
        is_graded:
          field === "marks_obtained" && value !== null
            ? true
            : prev[responseId]?.is_graded || false,
      },
    }));
  };

  const handleSaveGrading = async () => {
    try {
      setSaving(true);

      if (!submission) return;

      // Validate that marks don't exceed maximum for each question and are integers
      const invalidMarks = Object.entries(gradingData).find(([responseId, grading]) => {
        const response = submission.responses.find((r) => r.id === responseId);
        if (!response) return false;

        if (grading.marks_obtained === null || grading.marks_obtained === undefined) {
          return false;
        }

        // Check if marks is a floating point number
        if (!Number.isInteger(grading.marks_obtained)) {
          return { type: 'decimal', responseId };
        }

        // Check if marks exceed maximum
        if (grading.marks_obtained > response.question_marks) {
          return { type: 'exceeds', responseId };
        }

        return false;
      });

      if (invalidMarks) {
        const [responseId, grading] = invalidMarks;
        const response = submission.responses.find((r) => r.id === responseId);

        if (typeof invalidMarks[1] === 'object' && invalidMarks[1].type === 'decimal') {
          toast.error('Marks must be whole numbers (no decimals allowed)');
          return;
        }

        toast.error(
          `Marks cannot exceed maximum marks (${response?.question_marks}) for a question`
        );
        return;
      }

      // Prepare updates array - only save questions that have been graded (marks entered)
      const updates = Object.entries(gradingData)
        .filter(([, grading]) =>
          grading.marks_obtained !== null &&
          grading.marks_obtained !== undefined
        )
        .map(([responseId, grading]) => ({
          response_id: responseId,
          marks_obtained: grading.marks_obtained,
          teacher_feedback: grading.teacher_feedback,
          is_graded: true,
        }));

      const response = await fetch(`/api/teacher/grading/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save grading");
      }

      toast.success("Grading saved successfully!");
      onGradingSaved?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving grading:", error);
      toast.error("Failed to save grading");
    } finally {
      setSaving(false);
    }
  };

  const handleNextQuestion = () => {
    if (submission && currentQuestionIndex < submission.responses.length - 1) {
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

  const getQuestionStatus = (response: Response) => {
    if (response.question_type === "mcq") {
      // MCQ questions are always auto-graded, so they should always show as graded
      return "graded";
    }
    // Check database values (not local state) - marks_obtained can be 0 (graded) or null (not graded)
    if (
      response.is_graded &&
      response.marks_obtained !== null &&
      response.marks_obtained !== undefined
    ) {
      return "graded";
    }
    return "pending";
  };

  const formatTimeTaken = (
    startTime: string | null,
    endTime: string | null
  ) => {
    if (!startTime || !endTime) return "N/A";

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const runStudentCode = async (responseId: string, useTestCases = false) => {
    const response = submission?.responses.find((r) => r.id === responseId);
    if (!response || response.question_type !== "coding") return;

    const code = response.submitted_code || "";

    // Normalize language to lowercase and handle C++ special case
    const rawLanguage = (response.language || "javascript").toLowerCase().trim();
    const language = rawLanguage === "c++" ? "cpp" : rawLanguage;
    const input = customInput[responseId] || "";

    console.log("Debug - Running code:", {
      rawLanguage: response.language,
      normalizedLanguage: language,
      hasCode: !!code,
      useTestCases,
      testCasesCount: response.test_cases?.length || 0,
    });

    setExecutingCode((prev) => new Set(prev).add(responseId));

    if (useTestCases && response.test_cases && response.test_cases.length > 0) {
      setExecutionResults((prev) => ({
        ...prev,
        [responseId]: {
          output: `⚡ Running ${response.test_cases!.length} test case${
            response.test_cases!.length > 1 ? "s" : ""
          }...\n📝 Testing on Judge0 compiler\n⏳ Please wait...`,
          error: false,
        },
      }));
    } else {
      setExecutionResults((prev) => ({
        ...prev,
        [responseId]: {
          output: "⚡ Executing code with custom input...\n📝 Running on Judge0 compiler\n⏳ Please wait...",
          error: false,
        },
      }));
    }

    try {
      const requestBody: {
        code: string;
        language: string;
        testCases?: TestCase[];
        customInput?: string;
      } = { code, language };

      if (useTestCases && response.test_cases && response.test_cases.length > 0) {
        requestBody.testCases = response.test_cases;
      } else {
        requestBody.customInput = input;
      }

      const apiResponse = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await apiResponse.json();

      if (!apiResponse.ok) {
        throw new Error(result.error || "Execution failed");
      }

      let output = "";
      let error = false;

      // Handle test case results
      if (result.testResults) {
        const { testResults, passedCount, totalTests } = result;
        setExecutionResults((prev) => ({
          ...prev,
          [responseId]: {
            output: "",
            error: passedCount < totalTests,
            testResults,
            passedCount,
            totalTests,
          },
        }));
        return;
      }

      // Handle simple execution
      if (result.success) {
        output = `🟢 Execution completed successfully\n\n${result.output.trim()}\n\n✨ Program finished with exit code 0\n⏱️  Time: ${result.time || "0"}s | Memory: ${result.memory || "0"}KB`;
      } else {
        error = true;
        output = `🔴 Execution failed\n\n❌ ${result.status}\n\n${result.output.trim()}\n\n💡 Check the code and try again`;
      }

      setExecutionResults((prev) => ({
        ...prev,
        [responseId]: {
          output,
          error,
        },
      }));
    } catch (err) {
      setExecutionResults((prev) => ({
        ...prev,
        [responseId]: {
          output: `🔴 Network Error\n\n❌ ${(err as Error).message}\n\n💡 Check your internet connection and try again`,
          error: true,
        },
      }));
    } finally {
      setExecutingCode((prev) => {
        const newSet = new Set(prev);
        newSet.delete(responseId);
        return newSet;
      });
    }
  };

  const responses = submission?.responses || [];
  const currentResponse = responses[currentQuestionIndex];

  if (!isOpen) return null;

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
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          from="bottom"
          showCloseButton={true}
          layoutId="grading-dialog-two"
          className="pr-2 min-w-[70vw] max-h-[80vh] overflow-hidden flex flex-col"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Grading Submission
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <GradingDialogSkeleton />
          ) : (
            <>
              {/* Enhanced Header with Animated Expandable Details */}
              {submission && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pr-5"
                >
                  {/* Unified Expandable Container */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="bg-muted/30 rounded-lg overflow-hidden"
                  >
                    {/* Animated Info Bar */}
                    <div
                      onClick={() => setShowDetails(!showDetails)}
                      className={`flex items-center justify-between gap-4 p-3 cursor-pointer transition-all ${
                        showDetails ? "rounded-t-lg" : "rounded-lg"
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                          className="min-w-0"
                        >
                          <span className="text-xs text-muted-foreground">
                            Student:
                          </span>
                          <p className="font-semibold text-sm truncate">
                            {submission.student_name}
                          </p>
                        </motion.div>
                        <Separator orientation="vertical" className="h-8" />
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                          className="min-w-0"
                        >
                          <span className="text-xs text-muted-foreground">
                            Exam:
                          </span>
                          <p className="font-semibold text-sm truncate">
                            {submission.exam_title}
                          </p>
                        </motion.div>
                        <Separator orientation="vertical" className="h-8" />
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        >
                          <span className="text-xs text-muted-foreground">
                            Score:
                          </span>
                          <p className="font-semibold text-sm">
                            {submission.total_score} /{" "}
                            {submission.max_possible_score}
                          </p>
                        </motion.div>
                      </div>
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDetails(!showDetails);
                          }}
                          className="shrink-0"
                        >
                          <motion.div
                            animate={{ rotate: showDetails ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="h-4 w-4 mr-1" />
                          </motion.div>
                          {showDetails ? "Hide" : "Details"}
                        </Button>
                      </div>
                    </div>

                    {/* Enhanced Animated Expandable Details Section */}
                    <AnimatePresence initial={false}>
                      {showDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            initial={{ y: -10 }}
                            animate={{ y: 0 }}
                            exit={{ y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-3 px-3">
                              <AnimatedDetailItem
                                label="Email:"
                                value={submission.student_email}
                                delay={0.1}
                                title={submission.student_email}
                              />
                              <AnimatedDetailItem
                                label="Department:"
                                value={submission.department}
                                delay={0.15}
                              />
                              <AnimatedDetailItem
                                label="Time Given:"
                                value={
                                  submission.duration
                                    ? `${submission.duration} min`
                                    : "N/A"
                                }
                                delay={0.2}
                              />
                              <AnimatedDetailItem
                                label="Time Taken:"
                                value={formatTimeTaken(
                                  submission.start_time,
                                  submission.end_time
                                )}
                                delay={0.25}
                              />
                              <AnimatedDetailItem
                                label="Submitted:"
                                value={new Date(
                                  submission.submitted_at
                                ).toLocaleString()}
                                delay={0.3}
                              />
                              <AnimatedDetailItem
                                label="Progress:"
                                value={`${(
                                  (submission.total_score /
                                    submission.max_possible_score) *
                                  100
                                ).toFixed(1)}%`}
                                delay={0.35}
                              />
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}

              <div className="flex flex-1 gap-4 overflow-hidden">
              {/* Question Navigator Sidebar */}
              <div className="w-48 bg-muted/30 rounded-lg p-4 overflow-y-auto">
                <h3 className="font-semibold mb-3 text-sm">Questions</h3>
                <div className="grid grid-cols-4 gap-2">
                  {responses.map((response, index) => {
                    const status = getQuestionStatus(response);
                    return (
                      <Button
                        key={response.id}
                        variant={
                          index === currentQuestionIndex ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleQuestionNavigate(index)}
                        className={`h-8 w-full relative ${
                          status === "graded"
                            ? "border-green-500"
                            : "border-orange-500"
                        }`}
                      >
                        <span>{index + 1}</span>
                        {status === "graded" && (
                          <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-500" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Question Display Area */}
              <div className="flex flex-col overflow-hidden min-h-0 w-full">
                <div className="overflow-y-auto overflow-x-hidden h-[380px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-4">
                  <AnimatePresence mode="wait">
                    {currentResponse && (
                      <motion.div
                        key={currentResponse.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="gap-2">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              {/* Question Text */}
                              <p className="mt-2 text-sm whitespace-pre-wrap capitalize">
                                {currentResponse.question_text}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  {currentResponse.question_type.toUpperCase()}
                                </Badge>
                                <Badge>
                                  {currentResponse.question_marks} marks
                                </Badge>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* <Separator /> */}

                            {/* MCQ Question Display */}
                            {currentResponse.question_type === "mcq" && (
                              <div className="space-y-4">
                                <div className="space-y-2 mt-2">
                                  {currentResponse.options?.map(
                                    (option, idx) => (
                                      <div
                                        key={idx}
                                        className={`p-3 rounded-lg border ${
                                          idx === currentResponse.correct_option
                                            ? "bg-green-500/10 border-green-500"
                                            : idx ===
                                              currentResponse.selected_option
                                            ? "bg-red-500/10 border-red-500"
                                            : "bg-muted/30"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm lowercase">
                                            {String.fromCharCode(65 + idx)}.
                                            {"  "}
                                            <span className="capitalize">
                                              {option}
                                            </span>
                                          </span>
                                          {idx ===
                                            currentResponse.correct_option && (
                                            <Badge className="bg-green-500">
                                              <CheckCircle className="h-3 w-3 mr-1" />
                                              Correct
                                            </Badge>
                                          )}
                                          {idx ===
                                            currentResponse.selected_option &&
                                            idx !==
                                              currentResponse.correct_option && (
                                              <Badge className="bg-red-500 text-sm">
                                                <XCircle className="h-3 w-3 mr-1" />
                                                Student&apos;s Answer
                                              </Badge>
                                            )}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>

                                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg text-sm">
                                  <span className="font-semibold">
                                    Auto-graded:
                                  </span>
                                  <Badge
                                    className={
                                      currentResponse.marks_obtained ===
                                      currentResponse.question_marks
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }
                                  >
                                    {currentResponse.marks_obtained || 0} /{" "}
                                    {currentResponse.question_marks}
                                  </Badge>
                                </div>
                              </div>
                            )}

                            {/* SAQ Question Display */}
                            {currentResponse.question_type === "saq" && (
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-base font-semibold text-sm">
                                    Student&apos;s Answer:
                                  </Label>
                                  <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">
                                      {currentResponse.student_answer ||
                                        "No answer provided"}
                                    </p>
                                  </div>
                                </div>

                                {/* Grading Inputs */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label
                                      htmlFor={`marks-${currentResponse.id}`}
                                      className="mb-2 text-sm"

                                    >
                                      Marks Obtained *
                                    </Label>
                                    <Input
                                      id={`marks-${currentResponse.id}`}
                                      type="number"
                                      min={0}
                                      max={currentResponse.question_marks}
                                      step={1}
                                      value={
                                        gradingData[currentResponse.id]
                                          ?.marks_obtained ?? ""
                                      }
                                      onKeyDown={(e) => {
                                        // Prevent decimal point, minus, plus, and 'e' (exponential)
                                        if (e.key === '.' || e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                                          e.preventDefault();
                                        }
                                      }}
                                      onChange={(e) =>
                                        handleGradingChange(
                                          currentResponse.id,
                                          "marks_obtained",
                                          e.target.value
                                            ? Number(e.target.value)
                                            : null
                                        )
                                      }
                                      placeholder={`0 - ${currentResponse.question_marks}`}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div className="flex items-end">
                                    <Badge variant="outline" className="h-10">
                                      Max: {currentResponse.question_marks}{" "}
                                      marks
                                    </Badge>
                                  </div>
                                </div>
                                <div >
                                  <Label
                                    htmlFor={`feedback-${currentResponse.id}`}
                                    className="mb-2 text-sm"
                                  >
                                    Teacher Feedback (Optional)
                                  </Label>
                                  <Textarea
                                    id={`feedback-${currentResponse.id}`}
                                    value={
                                      gradingData[currentResponse.id]
                                        ?.teacher_feedback ?? ""
                                    }
                                    onChange={(e) =>
                                      handleGradingChange(
                                        currentResponse.id,
                                        "teacher_feedback",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Provide feedback to the student..."
                                    rows={3}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Coding Question Display */}
                            {currentResponse.question_type === "coding" && (
                              <div className="space-y-4">
                                {/* Side-by-side layout for Code and Execution */}
                                <div className="grid grid-cols-2 gap-4">
                                  {/* Left Column: Language + Student Code */}
                                  <div className="space-y-2">
                                    <div>
                                      <Label className="text-sm font-semibold">
                                        Language:
                                      </Label>
                                      <div className="mt-1">
                                        <Badge variant="outline">
                                          {currentResponse.language}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="pt-2">
                                      <Label className="text-sm font-semibold">
                                        Student&apos;s Code:
                                      </Label>
                                      <pre className="mt-2 p-4 bg-slate-950 dark:bg-slate-900 text-gray-100 rounded-lg overflow-x-auto text-xs max-h-96 overflow-y-auto border border-slate-700">
                                        <code className="text-gray-100">
                                          {currentResponse.submitted_code ||
                                            "No code submitted"}
                                        </code>
                                      </pre>
                                    </div>
                                  </div>

                                  {/* Right Column: Test & Run + Execution Section */}
                                  <div className="space-y-2">
                                    <Label className="text-base font-semibold">
                                      Test & Run:
                                    </Label>
                                    <div className="border rounded-lg overflow-hidden">
                                      {/* Tabs Header */}
                                      <div className="flex border-b bg-muted/30">
                                        <button
                                          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                                            (activeTab[currentResponse.id] || "code") === "code"
                                              ? "bg-background border-b-2 border-primary text-foreground"
                                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                          }`}
                                          onClick={() =>
                                            setActiveTab((prev) => ({
                                              ...prev,
                                              [currentResponse.id]: "code",
                                            }))
                                          }
                                        >
                                          <span className="flex items-center justify-center gap-2">
                                            <Play className="h-3 w-3" />
                                            Custom Input
                                          </span>
                                        </button>
                                        <button
                                          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                                            (activeTab[currentResponse.id] || "code") === "testcases"
                                              ? "bg-background border-b-2 border-primary text-foreground"
                                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                          }`}
                                          onClick={() =>
                                            setActiveTab((prev) => ({
                                              ...prev,
                                              [currentResponse.id]: "testcases",
                                            }))
                                          }
                                        >
                                          <span className="flex items-center justify-center gap-2">
                                            <CheckCircle className="h-3 w-3" />
                                            Test Cases
                                            {currentResponse.test_cases && (
                                              <Badge variant="secondary" className="ml-1 text-xs">
                                                {currentResponse.test_cases.length}
                                              </Badge>
                                            )}
                                          </span>
                                        </button>
                                      </div>

                                      {/* Tab Content */}
                                      <div className="p-4 space-y-3">
                                        {(activeTab[currentResponse.id] || "code") === "code" ? (
                                          <>
                                            <div>
                                              <Label className="text-sm">
                                                Custom Input (Optional)
                                              </Label>
                                              <Textarea
                                                value={customInput[currentResponse.id] || ""}
                                                onChange={(e) =>
                                                  setCustomInput((prev) => ({
                                                    ...prev,
                                                    [currentResponse.id]: e.target.value,
                                                  }))
                                                }
                                                placeholder="Enter custom input for testing..."
                                                className="mt-1 font-mono text-sm min-h-[80px]"
                                              />
                                            </div>
                                            <Button
                                              onClick={() => runStudentCode(currentResponse.id, false)}
                                              disabled={
                                                executingCode.has(currentResponse.id) ||
                                                !currentResponse.submitted_code
                                              }
                                              size="sm"
                                              className="w-full"
                                            >
                                              {executingCode.has(currentResponse.id) ? (
                                                <>
                                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                  Running...
                                                </>
                                              ) : (
                                                <>
                                                  <Play className="h-4 w-4 mr-2" />
                                                  Run with Custom Input
                                                </>
                                              )}
                                            </Button>
                                          </>
                                        ) : (
                                          <>
                                            <div className="text-sm text-muted-foreground">
                                              {currentResponse.test_cases && currentResponse.test_cases.length > 0 ? (
                                                <p>
                                                  Run all {currentResponse.test_cases.length} test case
                                                  {currentResponse.test_cases.length > 1 ? "s" : ""} to verify the solution.
                                                </p>
                                              ) : (
                                                <p>No test cases available for this question.</p>
                                              )}
                                            </div>
                                            <Button
                                              onClick={() => runStudentCode(currentResponse.id, true)}
                                              disabled={
                                                executingCode.has(currentResponse.id) ||
                                                !currentResponse.submitted_code ||
                                                !currentResponse.test_cases ||
                                                currentResponse.test_cases.length === 0
                                              }
                                              size="sm"
                                              className="w-full"
                                            >
                                              {executingCode.has(currentResponse.id) ? (
                                                <>
                                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                  Running Test Cases...
                                                </>
                                              ) : (
                                                <>
                                                  <CheckCircle className="h-4 w-4 mr-2" />
                                                  Run Test Cases
                                                </>
                                              )}
                                            </Button>
                                          </>
                                        )}
                                      </div>

                                      {/* Execution Results Display - Inside the right column */}
                                      {executionResults[currentResponse.id] && (
                                        <div className="border-t p-4 bg-muted/20">
                                          <Label className="text-sm font-semibold mb-2 block">
                                            Execution Results:
                                          </Label>
                                          {executionResults[currentResponse.id].testResults ? (
                                            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                                              {/* Test Case Summary */}
                                              <div
                                                className={`p-2 rounded-lg border ${
                                                  executionResults[currentResponse.id].passedCount ===
                                                  executionResults[currentResponse.id].totalTests
                                                    ? "bg-green-500/10 border-green-500/30"
                                                    : "bg-red-500/10 border-red-500/30"
                                                }`}
                                              >
                                                <div className="flex items-center justify-between">
                                                  <span
                                                    className={`font-semibold text-xs ${
                                                      executionResults[currentResponse.id].passedCount ===
                                                      executionResults[currentResponse.id].totalTests
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-red-600 dark:text-red-400"
                                                    }`}
                                                  >
                                                    {executionResults[currentResponse.id].passedCount ===
                                                    executionResults[currentResponse.id].totalTests
                                                      ? "✅ All Tests Passed!"
                                                      : "❌ Some Tests Failed"}
                                                  </span>
                                                  <Badge variant="secondary" className="text-xs">
                                                    {executionResults[currentResponse.id].passedCount}/
                                                    {executionResults[currentResponse.id].totalTests}
                                                  </Badge>
                                                </div>
                                              </div>

                                              {/* Individual Test Results */}
                                              <div className="space-y-2">
                                                {executionResults[currentResponse.id].testResults?.map(
                                                  (testResult: TestResult, index: number) => (
                                                    <div
                                                      key={index}
                                                      className={`rounded-lg border p-2 ${
                                                        testResult.passed
                                                          ? "bg-green-500/5 border-green-500/20"
                                                          : "bg-red-500/5 border-red-500/20"
                                                      }`}
                                                    >
                                                      <div className="flex items-center justify-between mb-1">
                                                        <span className="font-semibold text-xs">
                                                          Test {index + 1}
                                                        </span>
                                                        <Badge
                                                          variant={
                                                            testResult.passed ? "default" : "destructive"
                                                          }
                                                          className="text-xs h-5"
                                                        >
                                                          {testResult.passed ? "✓" : "✗"}
                                                        </Badge>
                                                      </div>
                                                      <div className="space-y-1 text-xs">
                                                        <div>
                                                          <span className="text-muted-foreground">In: </span>
                                                          <code className="font-mono">
                                                            {testResult.input || "(empty)"}
                                                          </code>
                                                        </div>
                                                        <div>
                                                          <span className="text-muted-foreground">Exp: </span>
                                                          <code className="font-mono text-green-600 dark:text-green-400">
                                                            {testResult.expectedOutput}
                                                          </code>
                                                        </div>
                                                        <div>
                                                          <span className="text-muted-foreground">Got: </span>
                                                          <code
                                                            className={`font-mono ${
                                                              testResult.passed
                                                                ? "text-green-600 dark:text-green-400"
                                                                : "text-red-600 dark:text-red-400"
                                                            }`}
                                                          >
                                                            {testResult.actualOutput || "(no output)"}
                                                          </code>
                                                        </div>
                                                        {testResult.error && (
                                                          <div className="mt-1 p-1 rounded bg-red-500/10">
                                                            <span className="font-medium text-xs text-red-600 dark:text-red-400">
                                                              {testResult.error}
                                                            </span>
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          ) : (
                                            <div
                                              className={`p-2 rounded-lg border font-mono text-xs whitespace-pre-wrap max-h-64 overflow-y-auto ${
                                                executionResults[currentResponse.id].error
                                                  ? "text-red-600 dark:text-red-400 border-red-500/30 bg-red-500/5"
                                                  : "text-green-600 dark:text-green-400 border-green-500/30 bg-green-500/5"
                                              }`}
                                            >
                                              {executionResults[currentResponse.id].output}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Original Stored Execution Results (if any) */}
                                {currentResponse.execution_results && !executionResults[currentResponse.id] && (
                                  <div>
                                    <Label className="text-base font-semibold">
                                      Stored Execution Results (from submission):
                                    </Label>
                                    <div className="mt-2 p-3 bg-muted/50 rounded-lg max-h-64 overflow-y-auto">
                                      <pre className="text-xs whitespace-pre-wrap">
                                        {JSON.stringify(
                                          currentResponse.execution_results,
                                          null,
                                          2
                                        )}
                                      </pre>
                                    </div>
                                  </div>
                                )}

                                <Separator />

                                {/* Grading Inputs */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label
                                      htmlFor={`marks-${currentResponse.id}`}
                                      className="mb-2"
                                    >
                                      Marks Obtained *
                                    </Label>
                                    <Input
                                      id={`marks-${currentResponse.id}`}
                                      type="number"
                                      min={0}
                                      max={currentResponse.question_marks}
                                      step={1}
                                      value={
                                        gradingData[currentResponse.id]
                                          ?.marks_obtained ?? ""
                                      }
                                      onKeyDown={(e) => {
                                        // Prevent decimal point, minus, plus, and 'e' (exponential)
                                        if (e.key === '.' || e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                                          e.preventDefault();
                                        }
                                      }}
                                      onChange={(e) =>
                                        handleGradingChange(
                                          currentResponse.id,
                                          "marks_obtained",
                                          e.target.value
                                            ? Number(e.target.value)
                                            : null
                                        )
                                      }
                                      placeholder={`0 - ${currentResponse.question_marks}`}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div className="flex items-end">
                                    <Badge variant="outline" className="h-10">
                                      Max: {currentResponse.question_marks}{" "}
                                      marks
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <Label
                                    htmlFor={`feedback-${currentResponse.id}`}
                                    className="mb-2 text-sm"
                                  >
                                    Teacher Feedback (Optional)
                                  </Label>
                                  <Textarea
                                    id={`feedback-${currentResponse.id}`}
                                    value={
                                      gradingData[currentResponse.id]
                                        ?.teacher_feedback ?? ""
                                    }
                                    onChange={(e) =>
                                      handleGradingChange(
                                        currentResponse.id,
                                        "teacher_feedback",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Provide feedback to the student..."
                                    rows={3}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation and Save Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button onClick={handleSaveGrading} disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Grading
                        </>
                      )}
                    </Button>
                  </div>

                  <Button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === responses.length - 1}
                    variant="outline"
                    className="mr-5"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
