"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClipboardCheck,
  FileText,
  ArrowUpDown,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Building2,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { GradingDialog } from "@/components/GradingDialog";
import GradingTableSkeleton from "@/components/skeleton/GradingTableSkeleton";
import { WarningDialog } from "@/components/WarningDialog";

type SortField =
  | "student_name"
  | "exam_title"
  | "department"
  | "submitted_at"
  | "grading_status";
type SortOrder = "asc" | "desc";

interface Submission {
  id: string;
  session_id: string;
  exam_id: string;
  exam_title: string;
  student_id: string;
  student_name: string;
  student_email: string;
  department: string;
  department_id: string;
  institution_id: string;
  institution_name: string;
  submitted_at: string;
  total_questions: number;
  mcq_count: number;
  saq_count: number;
  coding_count: number;
  graded_count: number;
  pending_count: number;
  grading_status: "completed" | "partial" | "pending";
  total_score: number;
  max_possible_score: number;
}

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="gap-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold py-2">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
      <h3 className="text-lg font-semibold mb-2">No submissions found</h3>
      <p className="text-muted-foreground mb-4">
        No submissions match your current search and filter criteria. Try
        adjusting your filters or search terms.
      </p>
      <Button variant="outline" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}

export default function AdminGradingPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("submitted_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeInstitutionId, setActiveInstitutionId] = useState<string | null>(
    null
  );
  const [isGradingDialogOpen, setIsGradingDialogOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(
    null
  );

  const itemsPerPage = 5;

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const institutionId = localStorage.getItem("activeInstitutionId");
      const departmentId = localStorage.getItem("activeDepartmentId");
      setActiveInstitutionId(institutionId);

      if (!institutionId) {
        toast.error("Please select an institution first");
        setSubmissions([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `/api/admin/grading?institution_id=${institutionId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch submissions");
      }

      // Filter by department if one is selected (and it's not "all")
      let filteredSubmissions = data.submissions || [];
      if (departmentId && departmentId !== "all") {
        filteredSubmissions = filteredSubmissions.filter(
          (submission: Submission) => submission.department_id === departmentId
        );
      }

      setSubmissions(filteredSubmissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleDepartmentChange = () => {
      fetchSubmissions();
    };

    fetchSubmissions(); // Initial load

    // Listen ONLY for department changes (not institution changes)
    // Institution change is followed by department selection, so we wait for that
    window.addEventListener("departmentChanged", handleDepartmentChange);

    return () => {
      window.removeEventListener("departmentChanged", handleDepartmentChange);
    };
  }, [fetchSubmissions]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedSubmissions = useMemo(() => {
    const filtered = submissions.filter((submission) => {
      const matchesSearch =
        submission.student_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.exam_title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.student_email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        submission.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || submission.grading_status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "student_name":
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
    return filtered;
  }, [submissions, searchTerm, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(
    filteredAndSortedSubmissions.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubmissions = filteredAndSortedSubmissions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const stats = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter((s) => s.grading_status === "pending")
      .length;
    const partial = submissions.filter((s) => s.grading_status === "partial")
      .length;
    const completed = submissions.filter((s) => s.grading_status === "completed")
      .length;

    return { total, pending, partial, completed };
  }, [submissions]);

  const resetAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
    setSortField("submitted_at");
    setSortOrder("desc");
    setSelectedRows(new Set());
  };

  const getGradingStatusBadge = (submission: Submission) => {
    if (submission.pending_count === 0) {
      return <Badge className="bg-green-500">Completed</Badge>;
    } else if (submission.graded_count > 0) {
      return <Badge className="bg-yellow-500">Partial</Badge>;
    } else {
      return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const handleGradeSubmission = (submission: Submission) => {
    setSelectedSessionId(submission.session_id);
    setIsGradingDialogOpen(true);
  };

  const handleGradingSaved = () => {
    // Refresh submissions list after grading is saved
    fetchSubmissions();
  };

  const toggleRowSelection = (submissionId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(submissionId)) {
      newSelection.delete(submissionId);
    } else {
      newSelection.add(submissionId);
    }
    setSelectedRows(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedSubmissions.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedSubmissions.map((s) => s.id)));
    }
  };

  const handleDeleteClick = (submissionId: string) => {
    setSubmissionToDelete(submissionId);
    setIsDeleteDialogOpen(true);
  };

  const handleBulkDeleteClick = () => {
    if (selectedRows.size === 0) {
      toast.error("Please select submissions to delete");
      return;
    }
    setSubmissionToDelete("bulk");
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!submissionToDelete) return;

      const submissionIds =
        submissionToDelete === "bulk"
          ? Array.from(selectedRows)
          : [submissionToDelete];

      const response = await fetch("/api/admin/grading", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submissionIds }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete submission(s)");
      }

      toast.success(
        submissionIds.length === 1
          ? "Submission deleted successfully"
          : `${submissionIds.length} submissions deleted successfully`
      );

      // Clear selection and refresh data
      setSelectedRows(new Set());
      fetchSubmissions();
    } catch (error) {
      console.error("Error deleting submission(s):", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete submission(s)"
      );
    } finally {
      setIsDeleteDialogOpen(false);
      setSubmissionToDelete(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <StatsCard
          title="Total Submissions"
          value={stats.total}
          description="All student submissions"
          icon={ClipboardCheck}
        />
        <StatsCard
          title="Pending Grading"
          value={stats.pending}
          description="Awaiting review"
          icon={Clock}
        />
        <StatsCard
          title="Partially Graded"
          value={stats.partial}
          description="In progress"
          icon={AlertCircle}
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          description="Fully graded"
          icon={CheckCircle2}
        />
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <CardTitle className="flex items-center space-x-2">
                  {/* <ClipboardCheck className="h-5 w-5" /> */}
                  <span>Student Results & Grading</span>
                </CardTitle>
                <CardDescription>
                  View and manage all student exam submissions across departments
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              {selectedRows.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md"
                >
                  <span className="text-sm font-medium">
                    {selectedRows.size} selected
                  </span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleBulkDeleteClick}
                    className="h-7 cursor-pointer transition-all hover:bg-red-700 hover:scale-105 active:scale-95"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedRows(new Set())}
                    className="h-7"
                  >
                    Clear
                  </Button>
                </motion.div>
              )}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name, exam, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]" size="lg">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Institution Warning */}
            {!activeInstitutionId && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
              >
                <Building2 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Please select an institution from the sidebar to view submissions
                </p>
              </motion.div>
            )}

            {/* Table */}
            <div className="rounded-md border overflow-hidden">
              <div className="max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted/90 backdrop-blur-sm z-10">
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedRows.size === paginatedSubmissions.length &&
                            paginatedSubmissions.length > 0
                          }
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                          disabled={loading}
                        />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 min-w-[150px] border-r"
                        onClick={() => handleSort("student_name")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Student Name</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 min-w-[200px] border-r"
                        onClick={() => handleSort("exam_title")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Exam Title</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 min-w-[120px] border-r"
                        onClick={() => handleSort("department")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Department</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 min-w-[150px] border-r"
                        onClick={() => handleSort("submitted_at")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Submitted At</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-center min-w-[100px] border-r">
                        Questions
                      </TableHead>
                      <TableHead className="text-center min-w-[100px] border-r">
                        Pending
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 text-center min-w-[120px] border-r"
                        onClick={() => handleSort("grading_status")}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span>Status</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-center min-w-[120px]">
                        Total Marks
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <GradingTableSkeleton />
                    ) : filteredAndSortedSubmissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9}>
                          {submissions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                              <h3 className="text-lg font-semibold mb-2">
                                No Submissions Found
                              </h3>
                              <p className="text-muted-foreground">
                                Student submissions will appear here after they
                                complete exams.
                              </p>
                            </div>
                          ) : (
                            <EmptyState onReset={resetAllFilters} />
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {paginatedSubmissions.map((submission, index) => (
                          <motion.tr
                            key={submission.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{
                              opacity: 0,
                              x: 100,
                              transition: { duration: 0.3 },
                            }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            layout
                            className="border-b transition-all duration-200 hover:bg-muted/30 hover:shadow-sm data-[state=selected]:bg-muted group cursor-pointer"
                            onClick={() => handleGradeSubmission(submission)}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedRows.has(submission.id)}
                                onCheckedChange={() =>
                                  toggleRowSelection(submission.id)
                                }
                                aria-label={`Select ${submission.student_name}`}
                              />
                            </TableCell>
                            <TableCell className="font-medium border-r">
                              <div className="capitalize">
                                {submission.student_name}
                              </div>
                              <div className="text-xs text-muted-foreground normal-case">
                                {submission.student_email}
                              </div>
                            </TableCell>
                            <TableCell className="capitalize border-r">
                              {submission.exam_title}
                            </TableCell>
                            <TableCell className="border-r">
                              {submission.department}
                            </TableCell>
                            <TableCell className="border-r">
                              {new Date(
                                submission.submitted_at
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TableCell>
                            <TableCell className="text-center border-r">
                              <div className="flex flex-col items-center">
                                <span>{submission.total_questions} Total</span>
                                <div className="text-xs text-muted-foreground">
                                  {submission.mcq_count} MCQ,{" "}
                                  {submission.saq_count} SAQ,{" "}
                                  {submission.coding_count} Coding
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center border-r">
                              <span
                                className={
                                  submission.pending_count > 0
                                    ? "text-orange-600 font-semibold"
                                    : ""
                                }
                              >
                                {submission.pending_count}
                              </span>
                            </TableCell>
                            <TableCell className="text-center border-r">
                              {getGradingStatusBadge(submission)}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1 text-xs font-semibold">
                                <span>{submission.total_score || 0}</span>
                                <span>/ {submission.max_possible_score}</span>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            {filteredAndSortedSubmissions.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredAndSortedSubmissions.length
                  )}{" "}
                  of {filteredAndSortedSubmissions.length} submissions
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Grading Dialog */}
      <GradingDialog
        isOpen={isGradingDialogOpen}
        onOpenChange={setIsGradingDialogOpen}
        sessionId={selectedSessionId}
        onGradingSaved={handleGradingSaved}
      />

      {/* Delete Warning Dialog */}
      <WarningDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setSubmissionToDelete(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        title={
          submissionToDelete === "bulk"
            ? "Delete Multiple Submissions"
            : "Delete Submission"
        }
        description={
          submissionToDelete === "bulk"
            ? `Are you sure you want to delete ${selectedRows.size} submission(s)? This action cannot be undone and will permanently remove all associated student responses, scores, and grading data.`
            : "Are you sure you want to delete this submission? This action cannot be undone and will permanently remove all associated student responses, scores, and grading data."
        }
        confirmText="Delete"
        cancelText="Cancel"
      />
    </motion.div>
  );
}
