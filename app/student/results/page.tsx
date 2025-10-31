"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, FileText, RefreshCw, ArrowUpDown } from "lucide-react";
import toast from "react-hot-toast";
import { ViewResultDialog } from "@/components/ViewResultDialog";

type SortField = "exam_title" | "department" | "submitted_at" | "total_questions" | "percentage" | "grading_status";
type SortOrder = "asc" | "desc";

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

export default function ResultsPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("submitted_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/student/results");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch results");
      }

      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedResults = useMemo(() => {
    const sorted = [...results];
    sorted.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "exam_title":
        case "department":
        case "grading_status":
          aValue = a[sortField];
          bValue = b[sortField];
          break;
        case "submitted_at":
          aValue = new Date(a.submitted_at).getTime();
          bValue = new Date(b.submitted_at).getTime();
          break;
        case "total_questions":
        case "percentage":
          aValue = a[sortField];
          bValue = b[sortField];
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [results, sortField, sortOrder]);

  const handleViewResult = (result: ExamResult) => {
    setSelectedResult(result);
    setIsViewModalOpen(true);
  };

  const getGradingStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "partial":
        return <Badge className="bg-yellow-500">Partial</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 75) return "text-green-600 font-semibold";
    if (percentage >= 50) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 p-6"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>My Results</span>
            </CardTitle>
            <CardDescription>Your exam results and scores</CardDescription>
          </div>
          <Button onClick={fetchResults} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="max-h-[600px] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/90 backdrop-blur-sm z-10">
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 min-w-[200px]"
                      onClick={() => handleSort("exam_title")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Exam Title</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 min-w-[120px]"
                      onClick={() => handleSort("department")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Department</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 min-w-[150px]"
                      onClick={() => handleSort("submitted_at")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Submission Date</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-center min-w-[100px]"
                      onClick={() => handleSort("total_questions")}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>Questions</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center min-w-[100px]">Answered</TableHead>
                    <TableHead className="text-center min-w-[100px]">Score</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-center min-w-[120px]"
                      onClick={() => handleSort("percentage")}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>Percentage</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 text-center min-w-[120px]"
                      onClick={() => handleSort("grading_status")}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>Status</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : results.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32">
                        <div className="flex flex-col items-center justify-center text-center">
                          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Results Available</h3>
                          <p className="text-muted-foreground">
                            Your exam results will appear here after you complete and submit exams.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {sortedResults.map((result, index) => (
                        <motion.tr
                          key={result.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{
                            opacity: 0,
                            x: 100,
                            transition: { duration: 0.3 },
                          }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          layout
                          className="border-b transition-all duration-200 hover:bg-muted/30 hover:shadow-sm group cursor-pointer"
                          onClick={() => handleViewResult(result)}
                        >
                          <TableCell className="font-medium">{result.exam_title}</TableCell>
                          <TableCell>{result.department}</TableCell>
                          <TableCell>
                            {new Date(result.submitted_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-center">{result.total_questions}</TableCell>
                          <TableCell className="text-center">{result.answered_questions}</TableCell>
                          <TableCell className="text-center">
                            {result.total_score}/{result.max_possible_score}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={getPercentageColor(result.percentage)}>
                              {result.percentage}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {getGradingStatusBadge(result.grading_status)}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ViewResultDialog
        result={selectedResult}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </motion.div>
  );
}