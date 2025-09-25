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
import Editor from '@monaco-editor/react';
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
import { GrFlag } from "react-icons/gr";
import { GrFlagFill } from "react-icons/gr";
import {
  mockExamSessions,
  type ExamSession,
} from "@/lib/mock-data/exam-sessions";

// Code templates for different languages
const CODE_TEMPLATES: Record<string, string> = {
  javascript: `// JavaScript Template
console.log("Hello, World!");

// Function example
function solve(input) {
    // Your code here
    return input;
}

// Test your function
const result = solve("test input");
console.log(result);`,
  python: `# Python Template
print("Hello, World!")

# Function example
def solve(input_data):
    # Your code here
    return result

# Test your function
result = solve("test input")
print(result)`,
  java: `// Java Template
public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Test your solution
        Solution sol = new Solution();
        String result = sol.solve("test input");
        System.out.println(result);
    }
    
    public String solve(String input) {
        // Your code here
        return "result";
    }
}`,
  cpp: `// C++ Template
#include <iostream>
#include <string>
using namespace std;

string solve(string input) {
    // Your code here
    return "result";
}

int main() {
    cout << "Hello, World!" << endl;
    
    // Test your solution
    string result = solve("test input");
    cout << result << endl;
    
    return 0;
}`,
  c: `// C Template
#include <stdio.h>
#include <string.h>

void solve(char* input, char* output) {
    // Your code here
    strcpy(output, "result");
}

int main() {
    printf("Hello, World!\\n");
    
    // Test your solution
    char result[100];
    solve("test input", result);
    printf("%s\\n", result);
    
    return 0;
}`,
  ruby: `# Ruby Template
puts "Hello, World!"

# Method example
def solve(input)
    # Your code here
    return "result"
end

# Test your method
result = solve("test input")
puts result`,
  go: `// Go Template
package main

import "fmt"

func solve(input string) string {
    // Your code here
    return "result"
}

func main() {
    fmt.Println("Hello, World!")
    
    // Test your function
    result := solve("test input")
    fmt.Println(result)
}`,
  rust: `// Rust Template
fn solve(input: &str) -> String {
    // Your code here
    String::from("result")
}

fn main() {
    println!("Hello, World!");
    
    // Test your function
    let result = solve("test input");
    println!("{}", result);
}`
};

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
  const [codeOutput, setCodeOutput] = useState<{ [key: string]: { language: string; output: string; error: boolean } }>({});
  const [selectedLanguage, setSelectedLanguage] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<{ [key: string]: "code" | "output" }>({});
  
  // Enhanced editor features
  const [fontSize, setFontSize] = useState(14);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'vs-light'>('vs-dark');
  const [isFullscreen, setIsFullscreen] = useState<{ [key: string]: boolean }>({});
  const [autoSaveEnabled] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const editorRef = useRef<import('monaco-editor').editor.IStandaloneCodeEditor | null>(null);
  const { theme } = useTheme();

  // Load exam session
  useEffect(() => {
    const session = mockExamSessions[examId];
    if (session) {
      setExamSession(session);
      setTimeRemaining(session.timeLimit * 60);
    }
    setLoading(false);
  }, [examId]);
  
  // Auto-save effect
  useEffect(() => {
    if (!autoSaveEnabled) return;
    
    const autoSaveInterval = setInterval(() => {
      // Save current answers to localStorage
      if (Object.keys(answers).length > 0) {
        localStorage.setItem(`exam_${examId}_answers`, JSON.stringify(answers));
      }
    }, 3000); // Auto-save every 3 seconds
    
    return () => clearInterval(autoSaveInterval);
  }, [answers, examId, autoSaveEnabled]);
  
  // Load saved answers on mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`exam_${examId}_answers`);
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers);
        setAnswers(parsed);
      } catch (e) {
        console.error('Failed to load saved answers:', e);
      }
    }
  }, [examId]);
  
  // Initialize templates for coding questions
  useEffect(() => {
    if (examSession) {
      setAnswers(prevAnswers => {
        const newAnswers = { ...prevAnswers };
        examSession.questions.forEach(question => {
          if (question.type === 'coding' && !newAnswers[question.id]?.answer) {
            const defaultLanguage = 'javascript';
            newAnswers[question.id] = {
              questionId: question.id,
              answer: CODE_TEMPLATES[defaultLanguage],
              flagged: false
            };
            setSelectedLanguage(prev => ({
              ...prev,
              [question.id]: defaultLanguage
            }));
          }
        });
        return newAnswers;
      });
    }
  }, [examSession]);
  
  // Sync editor theme with system theme
  useEffect(() => {
    if (theme === 'dark') {
      setEditorTheme('vs-dark');
    } else if (theme === 'light') {
      setEditorTheme('vs-light');
    }
  }, [theme]);

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
  
  const handleLanguageChange = (questionId: string, newLanguage: string) => {
    setSelectedLanguage((prev) => ({
      ...prev,
      [questionId]: newLanguage,
    }));
    
    // Update code template when language changes
    const currentAnswer = answers[questionId]?.answer || '';
    if (!currentAnswer.trim() || Object.values(CODE_TEMPLATES).includes(currentAnswer)) {
      handleAnswerChange(questionId, CODE_TEMPLATES[newLanguage]);
    }
  };
  
  const formatCode = () => {
    if (editorRef.current) {
      const action = editorRef.current.getAction('editor.action.formatDocument');
      if (action) {
        action.run();
      }
    }
  };
  
  const toggleFullscreen = (questionId: string) => {
    setIsFullscreen(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  const adjustFontSize = (delta: number) => {
    setFontSize(prev => Math.max(10, Math.min(24, prev + delta)));
  };
  
  const toggleEditorTheme = () => {
    setEditorTheme(prev => prev === 'vs-dark' ? 'vs-light' : 'vs-dark');
  };
  
  const runCodeWithShortcut = useCallback((questionId: string) => {
    const code = answers[questionId]?.answer || '';
    const language = selectedLanguage[questionId] || 'javascript';
    if (code.trim()) {
      runCode(questionId, code, language);
    }
  }, [answers, selectedLanguage]);

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

  const runCode = async (questionId: string, code: string, language: string) => {
    setCodeOutput((prev) => ({
      ...prev,
      [questionId]: {
        language,
        output: "⚡ Executing code...\n📝 Running on Judge0 compiler",
        error: false,
      },
    }));

    setActiveTab((prev) => ({
      ...prev,
      [questionId]: "output",
    }));

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Execution failed');
      }

      let output = "";
      let error = false;

      if (result.success) {
        output = `🟢 Execution completed successfully\n\n${result.output.trim()}\n\n✨ Program finished with exit code 0\n⏱️  Time: ${result.time || '0'}s | Memory: ${result.memory || '0'}KB`;
      } else {
        error = true;
        output = `🔴 Execution failed\n\n❌ ${result.status}\n\n${result.output.trim()}\n\n💡 Check your code and try again`;
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
          output: `🔴 Network Error\n\n❌ ${(err as Error).message}\n\n💡 Check your internet connection and try again`,
          error: true,
        },
      }));
    }
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto mt-7 mb-2"
    >
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
                        {currentQ.points} points
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-md">{currentQ.question}</p>

                  {currentQ.type === "mcq" && currentQ.options && (
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

                  {currentQ.type === "saq" && (
                    <Textarea
                      placeholder="Type your answer here..."
                      value={answers[currentQ.id]?.answer || ""}
                      onChange={(e) =>
                        handleAnswerChange(currentQ.id, e.target.value)
                      }
                      className="min-h-32"
                    />
                  )}

                  {currentQ.type === "coding" && (
                    <div className="space-y-4">
                      {/* Enhanced Toolbar */}
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={formatCode}
                            className="text-xs"
                          >
                            <Code2 className="h-3 w-3 mr-1" />
                            Format
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowKeyboardShortcuts(true)}
                            className="text-xs"
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
                            >
                              <ZoomOut className="h-3 w-3" />
                            </Button>
                            <span className="text-xs px-2 py-1 bg-muted rounded">{fontSize}px</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => adjustFontSize(1)}
                              disabled={fontSize >= 24}
                            >
                              <ZoomIn className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleEditorTheme}
                          >
                            {editorTheme === 'vs-dark' ? (
                              <Sun className="h-3 w-3" />
                            ) : (
                              <Moon className="h-3 w-3" />
                            )}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleFullscreen(currentQ.id)}
                          >
                            {isFullscreen[currentQ.id] ? (
                              <Minimize2 className="h-3 w-3" />
                            ) : (
                              <Maximize2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Auto-save indicator - Hidden as requested */}
                      <div className={`border border-[#3C3C3C] rounded-lg overflow-hidden transition-all duration-300 ${
                        isFullscreen[currentQ.id] 
                          ? 'fixed inset-0 z-50 bg-background' 
                          : editorTheme === 'vs-dark' ? 'bg-[#1E1E1E]' : 'bg-white'
                      }`}>
                        {/* Monaco-style Tab Bar with Language Selector */}
                        <div className={`border-b transition-colors ${
                          editorTheme === 'vs-dark' 
                            ? 'bg-[#2D2D30] border-[#3C3C3C]' 
                            : 'bg-[#F3F3F3] border-[#CCCCCC]'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex">
                              <button
                                className={`px-4 py-2 text-sm font-medium border-r transition-all ${
                                  editorTheme === 'vs-dark'
                                    ? 'border-[#3C3C3C]'
                                    : 'border-[#CCCCCC]'
                                } ${
                                  (activeTab[currentQ.id] || "code") === "code"
                                    ? editorTheme === 'vs-dark'
                                      ? "bg-[#1E1E1E] text-[#CCCCCC] border-b-2 border-b-[#007ACC]"
                                      : "bg-white text-[#333333] border-b-2 border-b-[#007ACC]"
                                    : editorTheme === 'vs-dark'
                                      ? "text-[#CCCCCC]/70 hover:text-[#CCCCCC] hover:bg-[#252526]"
                                      : "text-[#666666] hover:text-[#333333] hover:bg-[#F0F0F0]"
                                }`}
                                onClick={() => setActiveTab((prev) => ({ ...prev, [currentQ.id]: "code" }))}
                              >
                                <span className="flex items-center space-x-2 cursor-pointer">
                                  <span className="w-2 h-2 rounded-full bg-[#007ACC]"></span>
                                  <span>Code</span>
                                </span>
                              </button>
                              <button
                                className={`px-4 py-2 text-sm font-medium transition-all ${
                                  (activeTab[currentQ.id] || "code") === "output"
                                    ? editorTheme === 'vs-dark'
                                      ? "bg-[#1E1E1E] text-[#CCCCCC] border-b-2 border-b-[#007ACC] cursor-default"
                                      : "bg-white text-[#333333] border-b-2 border-b-[#007ACC] cursor-default"
                                    : editorTheme === 'vs-dark'
                                      ? "text-[#CCCCCC]/70 hover:text-[#CCCCCC] hover:bg-[#252526] cursor-pointer"
                                      : "text-[#666666] hover:text-[#333333] hover:bg-[#F0F0F0] cursor-pointer"
                                }`}
                                onClick={() => {
                                  if ((activeTab[currentQ.id] || "code") !== "output") {
                                    setActiveTab((prev) => ({ ...prev, [currentQ.id]: "output" }));
                                    runCode(currentQ.id, answers[currentQ.id]?.answer || "", selectedLanguage[currentQ.id] || "javascript");
                                  }
                                }}
                                disabled={(activeTab[currentQ.id] || "code") === "output"}
                              >
                                <span className="flex items-center space-x-2 cursor-pointer">
                                  <span className="w-2 h-2 rounded-full bg-[#4EC9B0]"></span>
                                  <span>Output</span>
                                </span>
                              </button>
                            </div>
                            
                            {/* Language Selector on the right */}
                              <Select
                                value={selectedLanguage[currentQ.id] || "javascript"}
                                onValueChange={(value) => handleLanguageChange(currentQ.id, value)}
                              >
                                <SelectTrigger className={`w-[150px] h-full border-0 rounded-none rounded-tr-lg transition-colors ${
                                  editorTheme === 'vs-dark'
                                    ? 'bg-[#2D2D30] border-[#3C3C3C] text-[#CCCCCC] hover:bg-[#252526]'
                                    : 'bg-[#F3F3F3] border-[#CCCCCC] text-[#333333] hover:bg-[#E8E8E8]'
                                }`}>
                                  <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent className={editorTheme === 'vs-dark' ? 'bg-[#2D2D30] border-[#3C3C3C]' : 'bg-white border-[#CCCCCC]'}>
                                  <SelectItem value="javascript" className={editorTheme === 'vs-dark' ? 'text-[#CCCCCC] hover:bg-[#252526] focus:bg-[#252526]' : 'text-[#333333] hover:bg-[#F0F0F0] focus:bg-[#F0F0F0]'}>
                                    <span className="flex items-center space-x-2">
                                      <span className="w-2 h-2 rounded-full bg-[#F7DF1E]"></span>
                                      <span>JavaScript</span>
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="python" className={editorTheme === 'vs-dark' ? 'text-[#CCCCCC] hover:bg-[#252526] focus:bg-[#252526]' : 'text-[#333333] hover:bg-[#F0F0F0] focus:bg-[#F0F0F0]'}>
                                    <span className="flex items-center space-x-2">
                                      <span className="w-2 h-2 rounded-full bg-[#3776AB]"></span>
                                      <span>Python</span>
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="java" className={editorTheme === 'vs-dark' ? 'text-[#CCCCCC] hover:bg-[#252526] focus:bg-[#252526]' : 'text-[#333333] hover:bg-[#F0F0F0] focus:bg-[#F0F0F0]'}>
                                    <span className="flex items-center space-x-2">
                                      <span className="w-2 h-2 rounded-full bg-[#ED8B00]"></span>
                                      <span>Java</span>
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="cpp" className={editorTheme === 'vs-dark' ? 'text-[#CCCCCC] hover:bg-[#252526] focus:bg-[#252526]' : 'text-[#333333] hover:bg-[#F0F0F0] focus:bg-[#F0F0F0]'}>
                                    <span className="flex items-center space-x-2">
                                      <span className="w-2 h-2 rounded-full bg-[#00599C]"></span>
                                      <span>C++</span>
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="c" className={editorTheme === 'vs-dark' ? 'text-[#CCCCCC] hover:bg-[#252526] focus:bg-[#252526]' : 'text-[#333333] hover:bg-[#F0F0F0] focus:bg-[#F0F0F0]'}>
                                    <span className="flex items-center space-x-2">
                                      <span className="w-2 h-2 rounded-full bg-[#A8B9CC]"></span>
                                      <span>C</span>
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="ruby" className={editorTheme === 'vs-dark' ? 'text-[#CCCCCC] hover:bg-[#252526] focus:bg-[#252526]' : 'text-[#333333] hover:bg-[#F0F0F0] focus:bg-[#F0F0F0]'}>
                                    <span className="flex items-center space-x-2">
                                      <span className="w-2 h-2 rounded-full bg-[#CC342D]"></span>
                                      <span>Ruby</span>
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="go" className={editorTheme === 'vs-dark' ? 'text-[#CCCCCC] hover:bg-[#252526] focus:bg-[#252526]' : 'text-[#333333] hover:bg-[#F0F0F0] focus:bg-[#F0F0F0]'}>
                                    <span className="flex items-center space-x-2">
                                      <span className="w-2 h-2 rounded-full bg-[#00ADD8]"></span>
                                      <span>Go</span>
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="rust" className={editorTheme === 'vs-dark' ? 'text-[#CCCCCC] hover:bg-[#252526] focus:bg-[#252526]' : 'text-[#333333] hover:bg-[#F0F0F0] focus:bg-[#F0F0F0]'}>
                                    <span className="flex items-center space-x-2">
                                      <span className="w-2 h-2 rounded-full bg-[#CE422B]"></span>
                                      <span>Rust</span>
                                    </span>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                          </div>
                        </div>
                        
                        {(activeTab[currentQ.id] || "code") === "code" ? (
                          <Editor
                            height={isFullscreen[currentQ.id] ? "calc(100vh - 100px)" : "400px"}
                            language={selectedLanguage[currentQ.id] || "javascript"}
                            value={answers[currentQ.id]?.answer || ""}
                            onChange={(value) =>
                              handleAnswerChange(currentQ.id, value || "")
                            }
                            theme={editorTheme}
                            onMount={(editor) => {
                              editorRef.current = editor;
                              
                              // Add keyboard shortcuts
                              editor.addCommand(
                                window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter,
                                () => runCodeWithShortcut(currentQ.id)
                              );
                              
                              // Add syntax validation
                              editor.onDidChangeModelContent(() => {
                                const model = editor.getModel();
                                if (model) {
                                  window.monaco.editor.setModelMarkers(model, 'syntax', []);
                                }
                              });
                            }}
                            options={{
                              minimap: { enabled: !isFullscreen[currentQ.id] ? false : true },
                              fontSize: fontSize,
                              fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, 'Courier New', monospace",
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
                        ) : (
                          /* Monaco-style Output Panel */
                          <div className={`overflow-y-auto transition-colors ${
                            isFullscreen[currentQ.id] ? "h-[calc(100vh-100px)]" : "h-[400px]"
                          } ${
                            editorTheme === 'vs-dark' ? 'bg-[#1E1E1E]' : 'bg-white'
                          }`}>
                            {codeOutput[currentQ.id] ? (
                              <div className="h-full p-4">
                                <div
                                  className={`font-mono text-sm whitespace-pre-wrap leading-6 ${
                                    codeOutput[currentQ.id].error
                                      ? editorTheme === 'vs-dark' ? "text-[#F48771]" : "text-[#E53E3E]"
                                      : editorTheme === 'vs-dark' ? "text-[#4EC9B0]" : "text-[#38A169]"
                                  }`}
                                  style={{
                                    fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, 'Courier New', monospace",
                                    fontSize: `${fontSize}px`
                                  }}
                                >
                                  {codeOutput[currentQ.id].output}
                                </div>
                              </div>
                            ) : (
                              <div className={`flex items-center justify-center h-full transition-colors ${
                                editorTheme === 'vs-dark' ? 'text-[#858585]' : 'text-[#666666]'
                              }`}>
                                <div className="text-center">
                                  <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                  <p className="font-mono text-sm" style={{ fontSize: `${fontSize}px` }}>Run your code to see the output here</p>
                                  <p className="font-mono text-xs mt-2 opacity-70">Press Ctrl+Enter or click Output tab to execute</p>
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

                    </div>
                  )}

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
                        (currentQ.type === "mcq" &&
                          !answers[currentQ.id]?.answer?.trim()) ||
                        (currentQ.type === "saq" &&
                          !answers[currentQ.id]?.answer?.trim()) ||
                        (currentQ.type === "coding" &&
                          !answers[currentQ.id]?.answer?.trim())
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

        {/*Right Sidebar */}
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
      
      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
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
                <span className="font-medium">Run Code</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl + Enter</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Format Code</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Shift + Alt + F</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Find/Replace</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl + F</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Comment Line</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl + /</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Undo</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl + Z</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Redo</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl + Y</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Select All</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl + A</kbd>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Duplicate Line</span>
                <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Shift + Alt + ↓</kbd>
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Pro Tip:</strong> Use Ctrl+Enter to quickly test your code without switching tabs!
              </p>
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