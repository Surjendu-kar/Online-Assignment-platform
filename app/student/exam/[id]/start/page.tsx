"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Editor from "@monaco-editor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Home,
  Loader2,
  Play,
  Type,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Code2,
} from "lucide-react";
import {
  CODE_TEMPLATES,
  LANGUAGE_CONFIG,
  EXAM_TEMPLATES,
} from "@/data/codeTemplates";
import { toast } from "react-hot-toast";

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
  test_cases?: TestCase[];
}

interface ExamData {
  exam: {
    id: string;
    title: string;
    description: string;
    duration: number;
    requireWebcam: boolean;
  };
  session: {
    id: string;
    status: string;
    startTime: string;
    remainingTime: number;
  };
  questions: Question[];
  savedAnswers: Record<string, string | number>;
}

export default function ExamStartPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [codeOutput, setCodeOutput] = useState<{
    [key: string]: {
      language: string;
      output: string;
      error: boolean;
      testResults?: TestResult[];
      passedCount?: number;
      totalTests?: number;
    };
  }>({});
  const [selectedLanguage, setSelectedLanguage] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<{
    [key: string]: "code" | "output" | "testcases";
  }>({});
  const [customInput, setCustomInput] = useState<{
    [key: string]: string;
  }>({});
  const [originalTemplates, setOriginalTemplates] = useState<Record<string, string>>({});

  const [fontSize, setFontSize] = useState(14);
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "vs-light">(
    "vs-dark"
  );
  const [isFullscreen, setIsFullscreen] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const { theme } = useTheme();
  const isFetchingRef = useRef(false);

  const fetchExamData = useCallback(async () => {
    // Prevent duplicate simultaneous calls
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      const response = await fetch(`/api/student/exam/${examId}`);
      const data = await response.json();

      if (response.ok) {
        if (!data.session || data.session.status !== "in_progress") {
          toast.error("Exam session not found or not started");
          router.push(`/student/exam/${examId}`);
          return;
        }

        setExamData(data);
        setTimeRemaining(data.session.remainingTime);

        // Initialize answers with starter code for coding questions if not already answered
        const initialAnswers = data.savedAnswers || {};
        const templates: Record<string, string> = {};

        data.questions.forEach((q: Question) => {
          if (q.type === "coding") {
            const lang = q.language?.toLowerCase() || "javascript";
            let template = "";

            // Use teacher's starter code if provided, otherwise use complete template
            if (q.starter_code) {
              template = q.starter_code;
            } else if (EXAM_TEMPLATES[lang]) {
              // Use complete template with input/output logic
              template = EXAM_TEMPLATES[lang].complete;
            } else {
              template = CODE_TEMPLATES[lang] || CODE_TEMPLATES["javascript"];
            }

            // Store the original template
            templates[q.id] = template;

            // Initialize answer if not already saved
            if (!initialAnswers[q.id]) {
              initialAnswers[q.id] = template;
            }
          }
        });

        setOriginalTemplates(templates);
        setAnswers(initialAnswers);
      } else {
        toast.error(data.error || "Failed to load exam");
        router.push(`/student/exam/${examId}`);
      }
    } catch (error) {
      console.error("Error fetching exam:", error);
      toast.error("Failed to load exam");
      router.push(`/student/exam/${examId}`);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [examId, router]);

  const saveAnswers = useCallback(async () => {
    if (!examData) return;
    try {
      await fetch(`/api/student/exam/${examId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: examData.session.id,
          answers,
        }),
      });
    } catch (error) {
      console.error("Error saving answers:", error);
    }
  }, [examData, examId, answers]);

  const submitExam = useCallback(async () => {
    if (!examData) return;
    try {
      setIsSubmitting(true);
      await saveAnswers();

      const response = await fetch(`/api/student/exam/${examId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: examData.session.id,
          answers,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Exam submitted successfully!");
        setIsSubmitted(true);
        setRedirecting(true);
        setTimeout(() => {
          router.push("/student/exams");
        }, 2000);
      } else {
        toast.error(data.error || "Failed to submit exam");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("Failed to submit exam");
      setIsSubmitting(false);
    }
  }, [examData, examId, answers, saveAnswers, router]);

  const handleAutoSubmit = useCallback(async () => {
    toast.error("Time's up! Submitting exam automatically...");
    await submitExam();
  }, [submitExam]);

  const runCodeWithShortcut = useCallback(
    (questionId: string) => {
      const code = (answers[questionId] as string) || "";
      const language = selectedLanguage[questionId] || "javascript";
      const currentTab = activeTab[questionId] || "code";

      if (code.trim()) {
        if (currentTab === "output") {
          runCodeWithCustomInput(questionId, code, language);
        } else if (currentTab === "testcases") {
          runTestCases(questionId, code, language);
        }
      }
    },
    [answers, selectedLanguage, activeTab]
  );

  useEffect(() => {
    fetchExamData();
  }, [fetchExamData]);

  // Optimized timer: Calculate client-side + sync on visibility change
  useEffect(() => {
    if (!examData?.session || isSubmitted) return;

    // Get server-provided start time and duration (only once on mount)
    const startTime = new Date(examData.session.startTime).getTime();
    const durationMs = examData.exam.duration * 60 * 1000;

    // Function to calculate remaining time based on current time
    const calculateRemainingTime = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.floor((durationMs - elapsed) / 1000));
      return remaining;
    };

    // Set initial time
    setTimeRemaining(calculateRemainingTime());

    // Countdown timer (updates UI every second)
    const timer = setInterval(() => {
      const remaining = calculateRemainingTime();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        handleAutoSubmit();
      }
    }, 1000);

    // Sync with server when page becomes visible (handles tab switching, page reload)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && !isSubmitted) {
        try {
          const response = await fetch(`/api/student/exam/${examId}`);
          const data = await response.json();

          if (data.session?.remainingTime !== undefined) {
            const calculatedTime = calculateRemainingTime();
            const serverTime = data.session.remainingTime;

            // If drift is > 5 seconds, trust server time
            if (Math.abs(calculatedTime - serverTime) > 5) {
              console.log("Time drift detected, syncing with server");
              setTimeRemaining(serverTime);
            }

            // Check if exam was completed/terminated externally
            if (data.session.status !== "in_progress") {
              clearInterval(timer);
              handleAutoSubmit();
            }
          }
        } catch (error) {
          console.error("Failed to sync time:", error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [examData, isSubmitted, handleAutoSubmit, examId]);

  useEffect(() => {
    if (examData) {
      const autoSaveInterval = setInterval(() => {
        saveAnswers();
      }, 30000);
      return () => clearInterval(autoSaveInterval);
    }
  }, [examData, saveAnswers]);

  // Sync editor theme with system theme
  useEffect(() => {
    if (theme === "dark") {
      setEditorTheme("vs-dark");
    } else if (theme === "light") {
      setEditorTheme("vs-light");
    }
  }, [theme]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleLanguageChange = (questionId: string, newLanguage: string) => {
    setSelectedLanguage((prev) => ({
      ...prev,
      [questionId]: newLanguage,
    }));

    // Always update template when language changes to ensure consistency
    const langKey = newLanguage.toLowerCase();
    const template =
      EXAM_TEMPLATES[langKey]?.complete || CODE_TEMPLATES[newLanguage];
    handleAnswerChange(questionId, template);
  };

  const formatCode = async () => {
    if (editorRef.current) {
      try {
        // Try to format the document
        await editorRef.current.getAction("editor.action.formatDocument")?.run();

        // Show success feedback
        toast.success("Code formatted successfully!", {
          duration: 2000,
          position: "bottom-right",
        });
      } catch (error) {
        console.error("Format error:", error);
        // Show helpful message
        toast.error(
          "Formatting not available for this language. Use Shift+Alt+F to try manual format.",
          {
            duration: 3000,
            position: "bottom-right",
          }
        );
      }
    } else {
      toast.error("Editor not ready. Please try again.", {
        duration: 2000,
        position: "bottom-right",
      });
    }
  };

  const toggleFullscreen = (questionId: string) => {
    setIsFullscreen((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const adjustFontSize = (delta: number) => {
    setFontSize((prev) => Math.max(10, Math.min(24, prev + delta)));
  };

  const toggleEditorTheme = () => {
    setEditorTheme((prev) => (prev === "vs-dark" ? "vs-light" : "vs-dark"));
  };

  const getAnsweredQuestions = () => {
    if (!examData) return 0;

    return examData.questions.filter((question) => {
      const questionId = question.id;
      const answer = answers[questionId];

      // For coding questions, check if answer differs from template
      if (question.type === "coding") {
        const currentAnswer = answer as string || "";
        const template = originalTemplates[questionId] || "";
        return currentAnswer !== "" && currentAnswer !== template;
      }

      // For other question types, check if answer exists
      return answer !== null && answer !== undefined && answer !== "";
    }).length;
  };

  const handleSubmitExam = () => {
    setShowWarning(true);
  };

  const confirmSubmit = async () => {
    setShowWarning(false);
    await submitExam();
  };

  const runCodeWithCustomInput = async (
    questionId: string,
    code: string,
    language: string
  ) => {
    const input = customInput[questionId] || "";

    setCodeOutput((prev) => ({
      ...prev,
      [questionId]: {
        language,
        output:
          "⚡ Executing code with custom input...\n📝 Running on Judge0 compiler\n⏳ Please wait...",
        error: false,
      },
    }));

    setActiveTab((prev) => ({
      ...prev,
      [questionId]: "output",
    }));

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language, customInput: input }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Execution failed");
      }

      let output = "";
      let error = false;

      if (result.success) {
        output = `🟢 Execution completed successfully

${result.output.trim()}

✨ Program finished with exit code 0
⏱️  Time: ${result.time || "0"}s | Memory: ${result.memory || "0"}KB`;
      } else {
        error = true;
        output = `🔴 Execution failed

❌ ${result.status}

${result.output.trim()}

💡 Check your code and try again`;
      }

      setCodeOutput((prev) => ({
        ...prev,
        [questionId]: {
          language,
          output,
          error,
        },
      }));
    } catch (err) {
      setCodeOutput((prev) => ({
        ...prev,
        [questionId]: {
          language,
          output: `🔴 Network Error

❌ ${(err as Error).message}

💡 Check your internet connection and try again`,
          error: true,
        },
      }));
    }
  };

  const runTestCases = async (
    questionId: string,
    code: string,
    language: string
  ) => {
    const question = examData?.questions.find((q) => q.id === questionId);
    const testCases = question?.test_cases;

    if (!testCases || testCases.length === 0) {
      toast.error("No test cases available for this question");
      return;
    }

    setCodeOutput((prev) => ({
      ...prev,
      [questionId]: {
        language,
        output: `⚡ Running ${testCases.length} test case${
          testCases.length > 1 ? "s" : ""
        }...\n📝 Testing your solution on Judge0 compiler\n⏳ Please wait...`,
        error: false,
      },
    }));

    setActiveTab((prev) => ({
      ...prev,
      [questionId]: "testcases",
    }));

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language, testCases }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Execution failed");
      }

      let output = "";
      let error = false;

      // Handle test case results
      if (result.testResults) {
        const { testResults, passedCount, totalTests } = result;

        setCodeOutput((prev) => ({
          ...prev,
          [questionId]: {
            language,
            output: "", // Will be displayed in custom UI
            error: passedCount < totalTests,
            testResults,
            passedCount,
            totalTests,
          },
        }));
        return;
      }

      // Handle simple execution (no test cases)
      if (result.success) {
        output = `🟢 Execution completed successfully

${result.output.trim()}

✨ Program finished with exit code 0
⏱️  Time: ${result.time || "0"}s | Memory: ${result.memory || "0"}KB`;
      } else {
        error = true;
        output = `🔴 Execution failed

❌ ${result.status}

${result.output.trim()}

💡 Check your code and try again`;
      }

      setCodeOutput((prev) => ({
        ...prev,
        [questionId]: {
          language,
          output,
          error,
        },
      }));
    } catch (err) {
      setCodeOutput((prev) => ({
        ...prev,
        [questionId]: {
          language,
          output: `🔴 Network Error

❌ ${(err as Error).message}

💡 Check your internet connection and try again`,
          error: true,
        },
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[89vh]">
        <Card className="w-96 gap-2">
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

  if (!examData) {
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
              onClick={() => router.push("/student/dashboard")}
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
                  <span>Redirecting to exams page...</span>
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
                  {getAnsweredQuestions()}/{examData.questions.length}
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="font-semibold">Time Used</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatTime(examData.exam.duration * 60 - timeRemaining)}
                </p>
              </div>
            </div>
            {!redirecting && (
              <Button
                className="w-full"
                onClick={() => router.push("/student/exams")}
              >
                <Home className="h-4 w-4 mr-2" />
                Return to Exams
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentQ = examData.questions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`max-w-8xl mt-5 mb-2 ${
        currentQ.type === "coding" ? "" : "mx-auto"
      }`}
    >
      {/* Conditional layout based on question type */}
      {currentQ.type === "coding" ? (
        /* 3-column layout for coding questions */
        <div className="flex gap-6">
          {/* Left Column - Question Details Card (3 cols = 25%) */}
          <div className="lg:w-[22%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="gap-3">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Question {currentQuestion + 1}
                      </CardTitle>
                      <Badge variant="secondary">{currentQ.marks} marks</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-[700px] overflow-y-auto">
                    {/* Question Text */}

                    <p className="text-sm text-muted-foreground">
                      {currentQ.question_text}
                    </p>

                    {/* Example */}
                    {currentQ.test_cases && currentQ.test_cases.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            Example:
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Input:{" "}
                            </span>
                            <code className="font-mono text-amber-600 dark:text-amber-400">
                              {currentQ.test_cases[0].input || "(empty)"}
                            </code>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Output:{" "}
                            </span>
                            <code className="font-mono text-green-600 dark:text-green-400">
                              {currentQ.test_cases[0].output}
                            </code>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Important Rules */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
                          💡 Coding Guidelines:
                        </span>
                      </div>
                      <ul className="text-xs space-y-1 ml-4 list-disc text-blue-700 dark:text-blue-300">
                        <li>
                          Write your code INSIDE the{" "}
                          <code className="bg-muted px-1 rounded font-bold">
                            solution()
                          </code>{" "}
                          function
                        </li>
                        <li>
                          <strong>Do NOT modify</strong> the input reading or
                          output sections
                        </li>
                      </ul>

                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                          🛠️ Testing & Debugging:
                        </span>
                      </div>
                      <ul className="text-xs space-y-1 ml-4 list-disc text-green-700 dark:text-green-300">
                        <li>
                          <strong>Code Tab:</strong> Write your solution here
                        </li>
                        <li>
                          <strong>Output Tab:</strong> Test with custom input
                          and use console.log() for debugging
                        </li>
                        <li>
                          <strong>Test Cases Tab:</strong>{" "}
                          {currentQ.test_cases && currentQ.test_cases.length > 0
                            ? `Run ${
                                currentQ.test_cases.length
                              } official test case${
                                currentQ.test_cases.length > 1 ? "s" : ""
                              }`
                            : "No test cases available"}
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Center Column - Code Editor Card (6.5 cols = 54.17%) */}
          <div className="lg:w-[60%] flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Enhanced Toolbar */}
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={formatCode}
                      className="cursor-pointer text-xs hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-in-out hover:scale-105"
                    >
                      <Code2 className="h-3 w-3 mr-1" />
                      Format
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowKeyboardShortcuts(true)}
                      className="cursor-pointer text-xs hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 ease-in-out hover:scale-105"
                    >
                      <Type className="h-3 w-3 mr-1" />
                      Shortcuts
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustFontSize(-1)}
                        disabled={fontSize <= 10}
                        className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 ease-in-out hover:scale-110 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:border-border disabled:hover:text-muted-foreground"
                      >
                        <ZoomOut className="h-3 w-3" />
                      </Button>
                      <span className="text-xs px-2 py-1 bg-muted rounded font-medium">
                        {fontSize}px
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustFontSize(1)}
                        disabled={fontSize >= 24}
                        className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-950/30 hover:border-green-400 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 ease-in-out hover:scale-110 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:border-border disabled:hover:text-muted-foreground"
                      >
                        <ZoomIn className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleEditorTheme}
                      className="cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300 ease-in-out hover:scale-105"
                    >
                      {editorTheme === "vs-dark" ? (
                        <Sun className="h-3 w-3 transition-transform duration-300" />
                      ) : (
                        <Moon className="h-3 w-3 transition-transform duration-300" />
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFullscreen(currentQ.id)}
                      className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 ease-in-out hover:scale-105"
                    >
                      {isFullscreen[currentQ.id] ? (
                        <Minimize2 className="h-3 w-3" />
                      ) : (
                        <Maximize2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Code Editor Container */}
                <div
                  className={`border border-[#3C3C3C] rounded-lg overflow-hidden transition-all duration-300 ${
                    isFullscreen[currentQ.id]
                      ? "fixed inset-0 z-50 bg-background"
                      : editorTheme === "vs-dark"
                      ? "bg-[#1E1E1E]"
                      : "bg-white"
                  }`}
                >
                  {/* Monaco-style Tab Bar with Language Selector */}
                  <div
                    className={`border-b transition-colors ${
                      editorTheme === "vs-dark"
                        ? "bg-[#2D2D30] border-[#3C3C3C]"
                        : "bg-[#F3F3F3] border-[#CCCCCC]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        <button
                          className={`px-4 py-2 text-sm font-medium border-r transition-all ${
                            editorTheme === "vs-dark"
                              ? "border-[#3C3C3C]"
                              : "border-[#CCCCCC]"
                          } ${
                            (activeTab[currentQ.id] || "code") === "code"
                              ? editorTheme === "vs-dark"
                                ? "bg-[#1E1E1E] text-[#CCCCCC] border-b-2 border-b-[#007ACC]"
                                : "bg-white text-[#333333] border-b-2 border-b-[#007ACC]"
                              : editorTheme === "vs-dark"
                              ? "text-[#CCCCCC]/70 hover:text-[#CCCCCC] hover:bg-[#252526]"
                              : "text-[#666666] hover:text-[#333333] hover:bg-[#F0F0F0]"
                          }`}
                          onClick={() =>
                            setActiveTab((prev) => ({
                              ...prev,
                              [currentQ.id]: "code",
                            }))
                          }
                        >
                          <span className="flex items-center space-x-2 cursor-pointer">
                            <span className="w-2 h-2 rounded-full bg-[#007ACC]"></span>
                            <span>Code</span>
                          </span>
                        </button>
                        <button
                          className={`px-4 py-2 text-sm font-medium border-r transition-all ${
                            editorTheme === "vs-dark"
                              ? "border-[#3C3C3C]"
                              : "border-[#CCCCCC]"
                          } ${
                            (activeTab[currentQ.id] || "code") === "output"
                              ? editorTheme === "vs-dark"
                                ? "bg-[#1E1E1E] text-[#CCCCCC] border-b-2 border-b-[#007ACC]"
                                : "bg-white text-[#333333] border-b-2 border-b-[#007ACC]"
                              : editorTheme === "vs-dark"
                              ? "text-[#CCCCCC]/70 hover:text-[#CCCCCC] hover:bg-[#252526]"
                              : "text-[#666666] hover:text-[#333333] hover:bg-[#F0F0F0]"
                          }`}
                          onClick={() =>
                            setActiveTab((prev) => ({
                              ...prev,
                              [currentQ.id]: "output",
                            }))
                          }
                        >
                          <span className="flex items-center space-x-2 cursor-pointer">
                            <Play className="w-3 h-3 text-blue-500" />
                            <span>Output</span>
                          </span>
                        </button>
                        <button
                          className={`px-4 py-2 text-sm font-medium transition-all ${
                            (activeTab[currentQ.id] || "code") === "testcases"
                              ? editorTheme === "vs-dark"
                                ? "bg-[#1E1E1E] text-[#CCCCCC] border-b-2 border-b-[#007ACC]"
                                : "bg-white text-[#333333] border-b-2 border-b-[#007ACC]"
                              : editorTheme === "vs-dark"
                              ? "text-[#CCCCCC]/70 hover:text-[#CCCCCC] hover:bg-[#252526]"
                              : "text-[#666666] hover:text-[#333333] hover:bg-[#F0F0F0]"
                          }`}
                          onClick={() => {
                            if (
                              (activeTab[currentQ.id] || "code") !== "testcases"
                            ) {
                              setActiveTab((prev) => ({
                                ...prev,
                                [currentQ.id]: "testcases",
                              }));
                              // Automatically run test cases when switching to this tab
                              if (
                                currentQ.test_cases &&
                                currentQ.test_cases.length > 0
                              ) {
                                runTestCases(
                                  currentQ.id,
                                  (answers[currentQ.id] as string) || "",
                                  selectedLanguage[currentQ.id] || "javascript"
                                );
                              }
                            }
                          }}
                        >
                          <span className="flex items-center space-x-2 cursor-pointer">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>Test Cases</span>
                          </span>
                        </button>
                      </div>

                      {/* Language Selector on the right */}
                      <Select
                        value={selectedLanguage[currentQ.id] || "javascript"}
                        onValueChange={(value) =>
                          handleLanguageChange(currentQ.id, value)
                        }
                      >
                        <SelectTrigger
                          className={`w-[150px] h-full border-0 rounded-none rounded-tr-lg transition-colors ${
                            editorTheme === "vs-dark"
                              ? "bg-[#2D2D30] border-[#3C3C3C] text-[#CCCCCC] hover:bg-[#252526]"
                              : "bg-[#F3F3F3] border-[#CCCCCC] text-[#333333] hover:bg-[#E8E8E8]"
                          }`}
                        >
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent
                          className={
                            editorTheme === "vs-dark"
                              ? "bg-[#2D2D30] border-[#3C3C3C]"
                              : "bg-white border-[#CCCCCC]"
                          }
                        >
                          {Object.entries(LANGUAGE_CONFIG).map(
                            ([key, config]) => (
                              <SelectItem
                                key={key}
                                value={key}
                                className={
                                  editorTheme === "vs-dark"
                                    ? "text-[#CCCCCC] hover:bg-[#252526] focus:bg-[#252526]"
                                    : "text-[#333333] hover:bg-[#F0F0F0] focus:bg-[#F0F0F0]"
                                }
                              >
                                <span className="flex items-center space-x-2">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                      backgroundColor: config.color,
                                    }}
                                  ></span>
                                  <span>{config.name}</span>
                                </span>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {(activeTab[currentQ.id] || "code") === "code" ? (
                    /* Code Editor Tab */
                    <Editor
                      height={
                        isFullscreen[currentQ.id] ? "calc(100vh)" : "400px"
                      }
                      language={selectedLanguage[currentQ.id] || "javascript"}
                      value={(answers[currentQ.id] as string) || ""}
                      onChange={(value) =>
                        handleAnswerChange(currentQ.id, value || "")
                      }
                      theme={editorTheme}
                      onMount={(editor) => {
                        editorRef.current = editor;

                        // Add keyboard shortcuts
                        editor.addCommand(
                          window.monaco.KeyMod.CtrlCmd |
                            window.monaco.KeyCode.Enter,
                          () => runCodeWithShortcut(currentQ.id)
                        );

                        // Add syntax validation
                        editor.onDidChangeModelContent(() => {
                          const model = editor.getModel();
                          if (model) {
                            window.monaco.editor.setModelMarkers(
                              model,
                              "syntax",
                              []
                            );
                          }
                        });
                      }}
                      options={{
                        minimap: {
                          enabled: !isFullscreen[currentQ.id] ? false : true,
                        },
                        fontSize: fontSize,
                        fontFamily:
                          "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, 'Courier New', monospace",
                        lineNumbers: "on",
                        wordWrap: "on",
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        renderLineHighlight: "line",
                        selectOnLineNumbers: true,
                        roundedSelection: false,
                        readOnly: false,
                        cursorStyle: "line",
                        contextmenu: true,
                        mouseWheelZoom: true,
                        smoothScrolling: true,
                        cursorBlinking: "blink",
                        renderWhitespace: "selection",
                        bracketPairColorization: { enabled: true },
                        guides: {
                          bracketPairs: true,
                          indentation: true,
                        },
                        padding: {
                          top: 16,
                          bottom: 16,
                        },
                        lineNumbersMinChars: 3,
                        glyphMargin: false,
                        overviewRulerBorder: false,
                        hideCursorInOverviewRuler: true,
                        renderValidationDecorations: "on",
                        tabSize: 2,
                        insertSpaces: true,
                        detectIndentation: true,
                        formatOnPaste: true,
                        formatOnType: true,
                        suggestOnTriggerCharacters: true,
                        acceptSuggestionOnEnter: "on",
                        acceptSuggestionOnCommitCharacter: true,
                        quickSuggestions: true,
                        parameterHints: { enabled: true },
                        autoIndent: "full",
                        folding: true,
                        foldingStrategy: "auto",
                        showFoldingControls: "mouseover",
                        matchBrackets: "always",
                        colorDecorators: true,
                      }}
                    />
                  ) : (activeTab[currentQ.id] || "code") === "output" ? (
                    /* Custom Output Tab */
                    <div
                      className={`overflow-y-auto transition-colors ${
                        isFullscreen[currentQ.id]
                          ? "h-[calc(100vh)]"
                          : "h-[400px]"
                      } ${
                        editorTheme === "vs-dark" ? "bg-[#1E1E1E]" : "bg-white"
                      }`}
                    >
                      <div className="h-full p-4 space-y-4">
                        {/* Custom Input Section */}
                        <div className="space-y-2">
                          <Label
                            className={
                              editorTheme === "vs-dark"
                                ? "text-[#CCCCCC]"
                                : "text-[#333333]"
                            }
                          >
                            Custom Input (Optional)
                          </Label>
                          <Textarea
                            value={customInput[currentQ.id] || ""}
                            onChange={(e) =>
                              setCustomInput((prev) => ({
                                ...prev,
                                [currentQ.id]: e.target.value,
                              }))
                            }
                            placeholder="Enter custom input for testing (e.g., 5)..."
                            className={`font-mono text-sm min-h-[80px] ${
                              editorTheme === "vs-dark"
                                ? "bg-[#1E1E1E] text-[#CCCCCC] border-[#3C3C3C]"
                                : "bg-white text-[#333333]"
                            }`}
                          />
                          <Button
                            onClick={() =>
                              runCodeWithCustomInput(
                                currentQ.id,
                                (answers[currentQ.id] as string) || "",
                                selectedLanguage[currentQ.id] || "javascript"
                              )
                            }
                            size="sm"
                            className="w-full"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Run with Custom Input
                          </Button>
                        </div>

                        {/* Output Display */}
                        {codeOutput[currentQ.id] &&
                        !codeOutput[currentQ.id].testResults ? (
                          <div className="space-y-2">
                           
                            <div
                              className={`font-mono text-sm whitespace-pre-wrap leading-6 p-4 rounded border ${
                                codeOutput[currentQ.id].error
                                  ? editorTheme === "vs-dark"
                                    ? "text-[#F48771] border-red-500/30 bg-red-500/5"
                                    : "text-[#E53E3E] border-red-500/30 bg-red-500/5"
                                  : editorTheme === "vs-dark"
                                  ? "text-[#4EC9B0] border-green-500/30 bg-green-500/5"
                                  : "text-[#38A169] border-green-500/30 bg-green-500/5"
                              }`}
                              style={{
                                fontFamily:
                                  "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, 'Courier New', monospace",
                                fontSize: `${fontSize}px`,
                              }}
                            >
                              {codeOutput[currentQ.id].output}
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`flex items-center justify-center flex-1 transition-colors ${
                              editorTheme === "vs-dark"
                                ? "text-[#858585]"
                                : "text-[#666666]"
                            }`}
                          >
                            <div className="text-center">
                              <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p
                                className="font-mono text-sm"
                                style={{ fontSize: `${fontSize}px` }}
                              >
                                Enter custom input and click &quot;Run with Custom
                                Input&quot;
                              </p>
                              <p className="font-mono text-xs mt-2 opacity-70">
                                Use console.log() to debug your code
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Test Cases Tab */
                    <div
                      className={`overflow-y-auto transition-colors ${
                        isFullscreen[currentQ.id]
                          ? "h-[calc(100vh)]"
                          : "h-[400px]"
                      } ${
                        editorTheme === "vs-dark" ? "bg-[#1E1E1E]" : "bg-white"
                      }`}
                    >
                      {codeOutput[currentQ.id] &&
                      codeOutput[currentQ.id].testResults ? (
                        <div className="p-4">
                          {/* Test Case Results */}
                          {codeOutput[currentQ.id].testResults && (
                            <div className="space-y-4">
                              {/* Summary Header */}
                              <div
                                className={`p-3 rounded-lg border ${
                                  codeOutput[currentQ.id].passedCount ===
                                  codeOutput[currentQ.id].totalTests
                                    ? "bg-green-500/10 border-green-500/30"
                                    : "bg-red-500/10 border-red-500/30"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`font-semibold ${
                                      codeOutput[currentQ.id].passedCount ===
                                      codeOutput[currentQ.id].totalTests
                                        ? editorTheme === "vs-dark"
                                          ? "text-green-400"
                                          : "text-green-600"
                                        : editorTheme === "vs-dark"
                                        ? "text-red-400"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {codeOutput[currentQ.id].passedCount ===
                                    codeOutput[currentQ.id].totalTests
                                      ? "✅ All Tests Passed!"
                                      : "❌ Some Tests Failed"}
                                  </span>
                                  <Badge variant="secondary">
                                    {codeOutput[currentQ.id].passedCount}/
                                    {codeOutput[currentQ.id].totalTests} Passed
                                  </Badge>
                                </div>
                              </div>

                              {/* Individual Test Results */}
                              {codeOutput[currentQ.id].testResults?.map(
                                (testResult, index) => (
                                  <div
                                    key={index}
                                    className={`rounded-lg border p-3 ${
                                      testResult.passed
                                        ? "bg-green-500/5 border-green-500/20"
                                        : "bg-red-500/5 border-red-500/20"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span
                                        className={`font-semibold text-sm ${
                                          editorTheme === "vs-dark"
                                            ? "text-[#CCCCCC]"
                                            : "text-[#333333]"
                                        }`}
                                      >
                                        Test Case {index + 1}
                                      </span>
                                      <Badge
                                        variant={
                                          testResult.passed
                                            ? "default"
                                            : "destructive"
                                        }
                                        className="text-xs"
                                      >
                                        {testResult.passed
                                          ? "✓ Passed"
                                          : "✗ Failed"}
                                      </Badge>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <span
                                          className={`font-medium ${
                                            editorTheme === "vs-dark"
                                              ? "text-[#858585]"
                                              : "text-[#666666]"
                                          }`}
                                        >
                                          Input:{" "}
                                        </span>
                                        <code
                                          className={`font-mono ${
                                            editorTheme === "vs-dark"
                                              ? "text-[#CE9178]"
                                              : "text-[#A31515]"
                                          }`}
                                        >
                                          {testResult.input || "(empty)"}
                                        </code>
                                      </div>

                                      <div>
                                        <span
                                          className={`font-medium ${
                                            editorTheme === "vs-dark"
                                              ? "text-[#858585]"
                                              : "text-[#666666]"
                                          }`}
                                        >
                                          Expected Output:{" "}
                                        </span>
                                        <code
                                          className={`font-mono ${
                                            editorTheme === "vs-dark"
                                              ? "text-[#4EC9B0]"
                                              : "text-[#38A169]"
                                          }`}
                                        >
                                          {testResult.expectedOutput}
                                        </code>
                                      </div>

                                      <div>
                                        <span
                                          className={`font-medium ${
                                            editorTheme === "vs-dark"
                                              ? "text-[#858585]"
                                              : "text-[#666666]"
                                          }`}
                                        >
                                          Your Output:{" "}
                                        </span>
                                        <code
                                          className={`font-mono ${
                                            testResult.passed
                                              ? editorTheme === "vs-dark"
                                                ? "text-[#4EC9B0]"
                                                : "text-[#38A169]"
                                              : editorTheme === "vs-dark"
                                              ? "text-[#F48771]"
                                              : "text-[#E53E3E]"
                                          }`}
                                        >
                                          {testResult.actualOutput ||
                                            "(no output)"}
                                        </code>
                                      </div>

                                      {testResult.error && (
                                        <div className="mt-2 p-2 rounded bg-red-500/10">
                                          <span
                                            className={`font-medium text-xs ${
                                              editorTheme === "vs-dark"
                                                ? "text-[#F48771]"
                                                : "text-[#E53E3E]"
                                            }`}
                                          >
                                            Error: {testResult.error}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`flex flex-col items-center justify-center h-full transition-colors p-4 ${
                            editorTheme === "vs-dark"
                              ? "text-[#858585]"
                              : "text-[#666666]"
                          }`}
                        >
                          <div className="text-center space-y-4">
                            {currentQ.test_cases &&
                            currentQ.test_cases.length > 0 ? (
                              <>
                                <Loader2 className="h-12 w-12 mx-auto opacity-50 animate-spin" />
                                <p
                                  className="font-mono text-sm"
                                  style={{ fontSize: `${fontSize}px` }}
                                >
                                  Loading test results...
                                </p>
                                <p className="font-mono text-xs opacity-70">
                                  Running {currentQ.test_cases.length} test case
                                  {currentQ.test_cases.length > 1 ? "s" : ""}
                                </p>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-12 w-12 mx-auto opacity-50" />
                                <p
                                  className="font-mono text-sm"
                                  style={{ fontSize: `${fontSize}px` }}
                                >
                                  No test cases available
                                </p>
                                <p className="font-mono text-xs opacity-70">
                                  Use the Output tab to test with custom input
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fullscreen close button */}
                  {isFullscreen[currentQ.id] && (
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFullscreen(currentQ.id)}
                        className="bg-background/80 backdrop-blur-sm"
                      >
                        <Minimize2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons for Coding Questions */}
                <div className="flex items-center justify-between pt-2">
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

                  {currentQuestion < examData.questions.length - 1 && (
                    <Button
                      onClick={() =>
                        setCurrentQuestion(
                          Math.min(
                            examData.questions.length - 1,
                            currentQuestion + 1
                          )
                        )
                      }
                      className="cursor-pointer"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column - Question Navigator & Progress (2.5 cols = 20.83%) */}
          <div className="lg:w-[18%] space-y-6">
            {/* Question Navigator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {examData.questions.map((_, index) => {
                    const question = examData.questions[index];
                    const questionId = question.id;

                    // For coding questions, check if answer differs from original template
                    let isAnswered = false;
                    if (question.type === "coding") {
                      const currentAnswer = answers[questionId] as string || "";
                      const template = originalTemplates[questionId] || "";
                      isAnswered = currentAnswer !== "" && currentAnswer !== template;
                    } else {
                      isAnswered =
                        answers[questionId] !== undefined &&
                        answers[questionId] !== null &&
                        answers[questionId] !== "";
                    }

                    const isCurrent = index === currentQuestion;

                    let buttonClass = "";
                    if (isCurrent) {
                      buttonClass =
                        "!bg-blue-500 hover:!bg-blue-600 !text-white !border-blue-500";
                    } else if (isAnswered) {
                      buttonClass =
                        "!bg-green-500 hover:!bg-green-600 !text-white !border-green-500";
                    } else {
                      buttonClass = "!bg-muted hover:!bg-muted/80";
                    }

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className={buttonClass}
                        onClick={() => setCurrentQuestion(index)}
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
                      {getAnsweredQuestions()}/{examData.questions.length}
                    </span>
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Exam"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* 2-column layout for MCQ and SAQ */
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
                <Card className="gap-3">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Question {currentQuestion + 1}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {currentQ.marks} marks
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <>
                      <p className="text-lg font-medium leading-relaxed capitalize">
                        {currentQ.question_text}
                      </p>

                      {currentQ.type === "mcq" && currentQ.options && (
                        <RadioGroup
                          value={answers[currentQ.id]?.toString() || ""}
                          onValueChange={(value) =>
                            handleAnswerChange(currentQ.id, parseInt(value))
                          }
                          className="space-y-1"
                        >
                          {currentQ.options.map((option, index) => {
                            const optionLabels = ["A", "B", "C", "D", "E", "F"];
                            const isSelected =
                              answers[currentQ.id]?.toString() ===
                              index.toString();

                            return (
                              <Label
                                key={index}
                                htmlFor={`${currentQ.id}-${index}`}
                                className={`group flex items-start space-x-2 p-2 rounded-lg border-2 cursor-pointer transition-all duration-300 ease-in-out ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md scale-[1.01]"
                                    : "border-border hover:border-blue-300 hover:bg-accent/50 hover:shadow-sm hover:scale-[1.01]"
                                }`}
                              >
                                <div className="flex items-center space-x-3 flex-1">
                                  <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out ${
                                      isSelected
                                        ? "bg-blue-500 text-white scale-105"
                                        : "bg-muted text-muted-foreground group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105"
                                    }`}
                                  >
                                    {optionLabels[index]}
                                  </div>
                                  <div className="flex-1">
                                    <p
                                      className={`capitalize text-sm leading-relaxed transition-colors duration-300 ease-in-out ${
                                        isSelected
                                          ? "font-medium text-foreground"
                                          : "text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                      }`}
                                    >
                                      {option}
                                    </p>
                                  </div>
                                  <RadioGroupItem
                                    value={index.toString()}
                                    id={`${currentQ.id}-${index}`}
                                    className={`transition-all duration-300 ease-in-out ${
                                      isSelected
                                        ? "border-blue-500"
                                        : "group-hover:border-blue-400"
                                    }`}
                                  />
                                </div>
                              </Label>
                            );
                          })}
                        </RadioGroup>
                      )}

                      {currentQ.type === "saq" && (
                        <div className="space-y-3">
                          <div className="relative">
                            <Textarea
                              placeholder="Type your answer here..."
                              value={answers[currentQ.id] || ""}
                              onChange={(e) =>
                                handleAnswerChange(currentQ.id, e.target.value)
                              }
                              className="min-h-48 resize-none border-2 transition-all duration-300 ease-in-out focus:shadow-md p-4 text-sm leading-relaxed"
                            />

                            {/* Character Counter */}
                            <div className="absolute bottom-3 right-3 flex items-center gap-3">
                              <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md border shadow-sm">
                                <span className="text-xs font-medium text-muted-foreground">
                                  {(answers[currentQ.id] as string)?.length ||
                                    0}{" "}
                                  characters
                                </span>
                              </div>
                              <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md border shadow-sm">
                                <span className="text-xs font-medium text-muted-foreground">
                                  {(answers[currentQ.id] as string)
                                    ?.trim()
                                    .split(/\s+/)
                                    .filter((word) => word.length > 0).length ||
                                    0}{" "}
                                  words
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>

                    {/* Navigation Buttons for MCQ/SAQ */}
                    <div className="flex items-center justify-between">
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

                      {currentQuestion < examData.questions.length - 1 && (
                        <Button
                          onClick={() =>
                            setCurrentQuestion(
                              Math.min(
                                examData.questions.length - 1,
                                currentQuestion + 1
                              )
                            )
                          }
                          className="cursor-pointer"
                        >
                          Next
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/*Right Sidebar */}
          <div className="space-y-6">
            {/* Question Navigator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {examData.questions.map((_, index) => {
                    const question = examData.questions[index];
                    const questionId = question.id;

                    // For coding questions, check if answer differs from original template
                    let isAnswered = false;
                    if (question.type === "coding") {
                      const currentAnswer = answers[questionId] as string || "";
                      const template = originalTemplates[questionId] || "";
                      isAnswered = currentAnswer !== "" && currentAnswer !== template;
                    } else {
                      isAnswered =
                        answers[questionId] !== undefined &&
                        answers[questionId] !== null &&
                        answers[questionId] !== "";
                    }

                    const isCurrent = index === currentQuestion;

                    let buttonClass = "";
                    if (isCurrent) {
                      buttonClass =
                        "!bg-blue-500 hover:!bg-blue-600 !text-white !border-blue-500";
                    } else if (isAnswered) {
                      buttonClass =
                        "!bg-green-500 hover:!bg-green-600 !text-white !border-green-500";
                    } else {
                      buttonClass = "!bg-muted hover:!bg-muted/80";
                    }

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className={buttonClass}
                        onClick={() => setCurrentQuestion(index)}
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
                      {getAnsweredQuestions()}/{examData.questions.length}
                    </span>
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Exam"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

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
              {getAnsweredQuestions()} out of {examData.questions.length}{" "}
              questions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowWarning(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmSubmit}
              className="hover:bg-red-600 hover:scale-105 transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog
        open={showKeyboardShortcuts}
        onOpenChange={setShowKeyboardShortcuts}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Type className="h-5 w-5" />
              <span>Keyboard Shortcuts</span>
            </DialogTitle>
            <DialogDescription>
              Master these shortcuts to code more efficiently during your exam.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Run Code (Context-Aware)</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">
                  Ctrl + Enter
                </kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Format Code</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">
                  Shift + Alt + F
                </kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Find/Replace</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">
                  Ctrl + F
                </kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Comment Line</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">
                  Ctrl + /
                </kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Undo</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">
                  Ctrl + Z
                </kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Redo</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">
                  Ctrl + Y
                </kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Select All</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">
                  Ctrl + A
                </kbd>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Duplicate Line</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">
                  Shift + Alt + ↓
                </kbd>
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Pro Tip:</strong> Ctrl+Enter is context-aware! It
                will:
              </p>
              <ul className="text-xs text-muted-foreground ml-6 list-disc space-y-1">
                <li>
                  Run with custom input when in <strong>Output tab</strong>
                </li>
                <li>
                  Run test cases when in <strong>Test Cases tab</strong>
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowKeyboardShortcuts(false)}>
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
