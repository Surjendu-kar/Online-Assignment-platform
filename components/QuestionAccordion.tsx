"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2 } from "lucide-react";
import { EXAM_TEMPLATES } from "@/data/codeTemplates";

interface Question {
  id: string;
  type: "mcq" | "saq" | "coding";
  question: string;
  points: number;
  options?: string[];
  correctAnswer?: number;
  gradingGuidelines?: string;
  programmingLanguage?: string;
  testCases?: { input: string; output: string }[];
  codeTemplate?: string;
  order?: number;
}

interface QuestionAccordionProps {
  questions: Question[];
  openAccordionId: string | null;
  onAccordionToggle: (questionId: string) => void;
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion?: (questionId: string) => void;
  onReorderQuestions?: (questions: Question[]) => void;
  isDeleteMode?: boolean;
  selectedQuestions?: Set<string>;
  onToggleSelection?: (questionId: string) => void;
  onToggleDeleteMode?: () => void;
  onDeleteSelected?: () => void;
  newlyAddedQuestionId?: string | null;
}

export const QuestionAccordion = ({
  questions,
  openAccordionId,
  onAccordionToggle,
  onEditQuestion,

  onReorderQuestions,
  isDeleteMode = false,
  selectedQuestions = new Set(),
  onToggleSelection,
  onToggleDeleteMode,
  onDeleteSelected,
  newlyAddedQuestionId,
}: QuestionAccordionProps) => {
  const [draggedQuestionIndex, setDraggedQuestionIndex] = React.useState<
    number | null
  >(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
  const handleDragStart = (index: number) => {
    setDraggedQuestionIndex(index);
  };

  const handleDragOver = (index: number) => {
    setDragOverIndex(index);
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedQuestionIndex === null || draggedQuestionIndex === dropIndex) {
      setDraggedQuestionIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newQuestions = [...questions];
    const draggedQuestion = newQuestions[draggedQuestionIndex];

    newQuestions.splice(draggedQuestionIndex, 1);
    newQuestions.splice(dropIndex, 0, draggedQuestion);

    newQuestions.forEach((q, i) => {
      q.order = i + 1;
    });

    onReorderQuestions?.(newQuestions);
    setDraggedQuestionIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedQuestionIndex(null);
    setDragOverIndex(null);
  };

  if (questions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No questions added yet. Click &quot;Add Question&quot; to get started.
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-100">
          Questions ({questions.length})
        </h4>
        <div className="flex items-center space-x-2">
          {isDeleteMode && selectedQuestions.size > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onDeleteSelected}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            >
              Delete ({selectedQuestions.size})
            </motion.button>
          )}
          {isDeleteMode && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onToggleDeleteMode}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Cancel
            </motion.button>
          )}
          <button
            onClick={onToggleDeleteMode}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDeleteMode
                ? "hidden"
                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
            }`}
            title="Delete questions"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {questions.map((question, index) => (
            <div key={question.id} className="flex items-start space-x-3">
              {isDeleteMode && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedQuestions.has(question.id)}
                    onChange={() => onToggleSelection?.(question.id)}
                    className="w-[15px] h-[15px] text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </motion.div>
              )}
              <motion.div
                key={question.id}
                initial={
                  newlyAddedQuestionId === question.id
                    ? { opacity: 0, x: -300 }
                    : false
                }
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{ opacity: 0, x: 300 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className={`border rounded-lg bg-gray-800 transition-all duration-200 flex-1 ${
                  draggedQuestionIndex === index
                    ? "opacity-50 transform scale-95 border-blue-300"
                    : dragOverIndex === index && draggedQuestionIndex !== index
                    ? "border-blue-400 bg-gray-700"
                    : selectedQuestions.has(question.id)
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  handleDragOver(index);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(index);
                }}
              >
                {/* Accordion Header */}
                <div
                  className={`p-3 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
                    openAccordionId === question.id
                      ? "rounded-t-lg"
                      : "rounded-lg"
                  }`}
                  onClick={() => onAccordionToggle(question.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-100">
                        Q{index + 1}
                      </span>
                      <Badge variant="outline">
                        {question.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-blue-600 font-medium">
                        {question.points} point
                        {question.points !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        draggable={!isDeleteMode}
                        onDragStart={(e) => {
                          if (isDeleteMode) return;
                          e.stopPropagation();
                          handleDragStart(index);
                        }}
                        onDragEnd={handleDragEnd}
                        className={`text-gray-400 hover:text-gray-200 rounded p-1 transition-colors duration-200 ${
                          isDeleteMode
                            ? "cursor-default"
                            : "cursor-move hover:bg-gray-700"
                        }`}
                        title={isDeleteMode ? "" : "Drag to reorder"}
                        disabled={isDeleteMode}
                      >
                        ⋮⋮
                      </button>
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-300 ease-in-out ${
                          openAccordionId === question.id
                            ? "rotate-180"
                            : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Question preview - only shown when accordion is closed */}
                  {openAccordionId !== question.id && (
                    <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                      {question.question}
                    </p>
                  )}
                </div>

                {/* Accordion Content */}
                <div
                  className={`border-t border-gray-600 bg-gray-900 transition-all duration-500 ease-in-out rounded-b-lg ${
                    openAccordionId === question.id
                      ? "max-h-[3000px] opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div
                    className={`p-3 transition-all duration-500 ease-in-out ${
                      openAccordionId === question.id
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
                  >
                    <div className="space-y-3">
                      {question.type === "mcq" && (
                        <div className="space-y-3">
                          <textarea
                            placeholder="Enter question text..."
                            value={question.question}
                            onChange={(e) =>
                              onEditQuestion({
                                ...question,
                                question: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full border border-gray-600 p-2 rounded-md placeholder-gray-400 text-gray-100 bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            {question.options?.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  placeholder={`Option ${optIndex + 1}`}
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [
                                      ...(question.options || []),
                                    ];
                                    newOptions[optIndex] = e.target.value;
                                    onEditQuestion({
                                      ...question,
                                      options: newOptions,
                                    });
                                  }}
                                  className="flex-1 border border-gray-600 p-2 rounded-md placeholder-gray-400 text-gray-100 bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm"
                                />
                                <input
                                  type="radio"
                                  name={`correct_option_${question.id}`}
                                  checked={question.correctAnswer === optIndex}
                                  onChange={() =>
                                    onEditQuestion({
                                      ...question,
                                      correctAnswer: optIndex,
                                    })
                                  }
                                  className="w-4 h-4 text-blue-600"
                                />
                              </div>
                            ))}
                          </div>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            placeholder="Points"
                            value={question.points}
                            onChange={(e) =>
                              onEditQuestion({
                                ...question,
                                points: parseInt(e.target.value) || 1,
                              })
                            }
                            className="w-full border border-gray-600 p-2 rounded-md placeholder-gray-400 text-gray-100 bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm"
                          />
                        </div>
                      )}

                      {question.type === "saq" && (
                        <div className="space-y-3">
                          <textarea
                            placeholder="Enter question text..."
                            value={question.question}
                            onChange={(e) =>
                              onEditQuestion({
                                ...question,
                                question: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full border border-gray-600 p-2 rounded-md placeholder-gray-400 text-gray-100 bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm"
                          />
                          <textarea
                            placeholder="Grading guidelines (optional)..."
                            value={question.gradingGuidelines || ""}
                            onChange={(e) =>
                              onEditQuestion({
                                ...question,
                                gradingGuidelines: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full border border-gray-600 p-2 rounded-md placeholder-gray-400 text-gray-100 bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm"
                          />
                          <input
                            type="number"
                            min="1"
                            max="100"
                            placeholder="Points"
                            value={question.points}
                            onChange={(e) =>
                              onEditQuestion({
                                ...question,
                                points: parseInt(e.target.value) || 1,
                              })
                            }
                            className="w-full border border-gray-600 p-2 rounded-md placeholder-gray-400 text-gray-100 bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm"
                          />
                        </div>
                      )}

                      {question.type === "coding" && (
                        <div className="space-y-3">
                          <textarea
                            placeholder="Enter question text..."
                            value={question.question}
                            onChange={(e) =>
                              onEditQuestion({
                                ...question,
                                question: e.target.value,
                              })
                            }
                            rows={2}
                            className="w-full border border-gray-600 p-2 rounded-md placeholder-gray-400 text-gray-100 bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm"
                          />
                          <select
                            value={question.programmingLanguage || ""}
                            onChange={(e) => {
                              const newLanguage = e.target.value;
                              let starterCode = question.codeTemplate || "";

                              // Auto-fill starter code when language is selected
                              if (newLanguage) {
                                const langKey = newLanguage.toLowerCase();
                                if (EXAM_TEMPLATES[langKey]) {
                                  starterCode = EXAM_TEMPLATES[langKey].editable;
                                } else {
                                  // Fallback templates for languages not in EXAM_TEMPLATES
                                  switch (newLanguage) {
                                    case "JavaScript":
                                      starterCode = "function solution(n) {\n    // Write your code here\n    return n;\n}";
                                      break;
                                    case "Python":
                                      starterCode = "def solution(n):\n    # Write your code here\n    return n";
                                      break;
                                    case "Java":
                                      starterCode = "public class Solution {\n    public static int solution(int n) {\n        // Write your code here\n        return n;\n    }";
                                      break;
                                    case "C++":
                                      starterCode = "#include <iostream>\nusing namespace std;\n\nint solution(int n) {\n    // Write your code here\n    return n;\n}";
                                      break;
                                    case "C":
                                      starterCode = "#include <stdio.h>\n\nint solution(int n) {\n    // Write your code here\n    return n;\n}";
                                      break;
                                    case "Go":
                                      starterCode = 'package main\n\nimport "fmt"\n\nfunc solution(n int) int {\n    // Write your code here\n    return n\n}';
                                      break;
                                    case "Rust":
                                      starterCode = "fn solution(n: i32) -> i32 {\n    // Write your code here\n    n\n}";
                                      break;
                                    default:
                                      starterCode = "function solution(n) {\n    // Write your code here\n    return n;\n}";
                                  }
                                }
                              }

                              onEditQuestion({
                                ...question,
                                programmingLanguage: newLanguage,
                                codeTemplate: starterCode,
                              });
                            }}
                            className="w-full border border-gray-600 p-2 rounded-md text-gray-100 bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm"
                          >
                            <option value="">
                              Select programming language
                            </option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="Python">Python</option>
                            <option value="Java">Java</option>
                            <option value="C++">C++</option>
                            <option value="C">C</option>
                            <option value="C#">C#</option>
                            <option value="Go">Go</option>
                            <option value="Rust">Rust</option>
                            <option value="TypeScript">TypeScript</option>
                          </select>

                          {/* Important Rules Info */}
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground bg-blue-500/10 p-2 rounded border border-blue-500/20">
                              ⚠️ <strong>Important Rules:</strong>
                            </p>
                            <ul className="text-xs space-y-1 ml-4 list-disc text-muted-foreground">
                              <li>
                                The function must be named{" "}
                                <code className="bg-muted px-1 rounded font-bold">
                                  solution
                                </code>
                              </li>
                              <li>
                                <strong>Do not call</strong>{" "}
                                <code className="bg-muted px-1 rounded">
                                  solution()
                                </code>{" "}
                                manually or use{" "}
                                <code className="bg-muted px-1 rounded">
                                  console.log()
                                </code>
                              </li>
                              <li>
                                The test wrapper will automatically read
                                input and call your{" "}
                                <code className="bg-muted px-1 rounded">
                                  solution
                                </code>{" "}
                                function
                              </li>
                            </ul>
                          </div>

                          <textarea
                            placeholder="Starter code (required)..."
                            value={question.codeTemplate || ""}
                            onChange={(e) =>
                              onEditQuestion({
                                ...question,
                                codeTemplate: e.target.value,
                              })
                            }
                            rows={6}
                            className="w-full border border-gray-600 p-2 rounded-md placeholder-gray-400 text-gray-100 bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm font-mono"
                          />

                          {/* Test Cases Section */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Label className="text-gray-200">Test Cases *</Label>
                                <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                                  (Required)
                                </span>
                              </div>
                              <Button
                                type="button"
                                onClick={() => {
                                  const testCases = question.testCases || [];
                                  onEditQuestion({
                                    ...question,
                                    testCases: [...testCases, { input: "", output: "" }],
                                  });
                                }}
                                size="sm"
                                variant="outline"
                                className="border-amber-500/30 hover:bg-amber-500/10 text-xs h-7"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Test Case
                              </Button>
                            </div>

                            {(!question.testCases || question.testCases.length === 0) && (
                              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/30">
                                ⚠️ At least one test case is required.
                                Students will see the input/output to
                                validate their solution.
                              </p>
                            )}

                            {question.testCases?.map((testCase, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-2 gap-4 p-2 border border-gray-600 rounded bg-gray-800"
                              >
                                <div className="grid gap-1">
                                  <Label className="text-xs text-gray-300">Input</Label>
                                  <input
                                    type="text"
                                    value={testCase.input}
                                    onChange={(e) => {
                                      const newTestCases = [...(question.testCases || [])];
                                      newTestCases[index] = {
                                        ...newTestCases[index],
                                        input: e.target.value,
                                      };
                                      onEditQuestion({
                                        ...question,
                                        testCases: newTestCases,
                                      });
                                    }}
                                    placeholder="Input data..."
                                    className="w-full border border-gray-600 p-2 rounded-md placeholder-gray-400 text-gray-100 bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm"
                                  />
                                </div>
                                <div className="grid gap-1">
                                  <Label className="text-xs text-gray-300">
                                    Expected Output
                                  </Label>
                                  <div className="flex gap-1">
                                    <input
                                      type="text"
                                      value={testCase.output}
                                      onChange={(e) => {
                                        const newTestCases = [...(question.testCases || [])];
                                        newTestCases[index] = {
                                          ...newTestCases[index],
                                          output: e.target.value,
                                        };
                                        onEditQuestion({
                                          ...question,
                                          testCases: newTestCases,
                                        });
                                      }}
                                      placeholder="Expected output..."
                                      className="flex-1 border border-gray-600 p-2 rounded-md placeholder-gray-400 text-gray-100 bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm"
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        const newTestCases = question.testCases?.filter(
                                          (_, i) => i !== index
                                        ) || [];
                                        onEditQuestion({
                                          ...question,
                                          testCases: newTestCases,
                                        });
                                      }}
                                      size="sm"
                                      variant="outline"
                                      className="self-start h-7 w-7 p-0"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <input
                            type="number"
                            min="1"
                            max="100"
                            placeholder="Points"
                            value={question.points}
                            onChange={(e) =>
                              onEditQuestion({
                                ...question,
                                points: parseInt(e.target.value) || 1,
                              })
                            }
                            className="w-full border border-gray-600 p-2 rounded-md placeholder-gray-400 text-gray-100 bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};
