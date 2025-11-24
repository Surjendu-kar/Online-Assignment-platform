"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AddExamDialog } from "@/components/AddExamDialog";
import { supabase } from "@/lib/supabase/client";
import { WarningDialog } from "@/components/WarningDialog";
import ExamTableSkeleton from "@/components/skeleton/ExamTableSkeleton";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  ArrowUpDown,
  BookOpen,
  Clock,
  Users,
  Trash2,
  FileText,
} from "lucide-react";

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

interface Exam {
  id: string;
  title: string;
  start_time?: string;
  end_time?: string;
  unique_code?: string;
  created_by?: string;
  totalQuestions?: number;
  status?: "active" | "draft" | "archived";
  created_at?: string;
  assignedStudents?: number;
  questions?: Question[];
  department?: string;
  department_id?: string;
  institution_id?: string;
  duration?: number;
}

type SortField = "title" | "status" | "assignedStudents" | "created_at";
type SortOrder = "asc" | "desc";

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
      <h3 className="text-lg font-semibold mb-2">No exams found</h3>
      <p className="text-muted-foreground mb-4">
        No exams match your current search and filter criteria. Try adjusting
        your filters or search terms.
      </p>
      <Button variant="outline" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}

export default function TeacherExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [deletingExams, setDeletingExams] = useState<Set<string>>(new Set());
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [departments, setDepartments] = useState<Map<string, string>>(
    new Map()
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [examsToDelete, setExamsToDelete] = useState<string[]>([]);

  const itemsPerPage = 5;

  // Fetch exams from API
  const fetchExams = useCallback(async () => {
    try {
      setLoading(true);

      const { data: session, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !session.session) {
        toast.error("You must be logged in to view exams");
        return;
      }

      // Get institution and department from localStorage for filtering
      const institutionId = localStorage.getItem("activeInstitutionId");
      const departmentId = localStorage.getItem("activeDepartmentId");

      // Build query params
      const params = new URLSearchParams();
      if (institutionId) {
        params.append("institutionId", institutionId);
      }
      if (departmentId && departmentId !== "all") {
        params.append("departmentId", departmentId);
      }

      const queryString = params.toString();
      const url = `/api/exams${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${session.session.access_token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch exams");
      }

      const data = await response.json();
      setExams(data);

      // Always fetch department names for mapping (needed for displaying department column)
      if (institutionId) {
        await fetchDepartmentNames(institutionId);
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch department names for mapping
  const fetchDepartmentNames = async (institutionId: string) => {
    try {
      const response = await fetch("/api/departments");
      const data = await response.json();

      if (response.ok) {
        const deptMap = new Map<string, string>();
        data
          .filter((dept: { institution_id: string }) => dept.institution_id === institutionId)
          .forEach((dept: { id: string; name: string }) => {
            deptMap.set(dept.id, dept.name);
          });
        setDepartments(deptMap);
      }
    } catch (error) {
      console.error("Error fetching department names:", error);
    }
  };

  useEffect(() => {
    const handleDepartmentChange = () => {
      fetchExams();
    };

    fetchExams(); // Initial load

    // Listen ONLY for department changes (not institution changes)
    // Institution change is followed by department selection, so we wait for that
    window.addEventListener("departmentChanged", handleDepartmentChange);

    return () => {
      window.removeEventListener("departmentChanged", handleDepartmentChange);
    };
  }, [fetchExams]);

  const filteredAndSortedExams = useMemo(() => {
    const filtered = exams.filter((exam) => {
      const matchesSearch = exam.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || exam.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortField) {
        case "title":
        case "status":
          aValue = a[sortField] || "";
          bValue = b[sortField] || "";
          break;
        case "assignedStudents":
          aValue = a[sortField] || 0;
          bValue = b[sortField] || 0;
          break;
        case "created_at":
          aValue = new Date(a[sortField] || 0);
          bValue = new Date(b[sortField] || 0);
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
  }, [exams, searchTerm, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExams = filteredAndSortedExams.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const stats = useMemo(() => {
    const total = exams.length;
    const active = exams.filter((e) => e.status === "active").length;
    const draft = exams.filter((e) => e.status === "draft").length;

    return { total, active, draft };
  }, [exams]);

  const resetAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
    setSortField("created_at");
    setSortOrder("desc");
    setSelectedRows(new Set());
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const toggleRowSelection = (examId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(examId)) {
      newSelection.delete(examId);
    } else {
      newSelection.add(examId);
    }
    setSelectedRows(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedExams.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedExams.map((e) => e.id)));
    }
  };

  const handleAddExam = async (examData: {
    name: string;
    startDate: string; // This is a local datetime string from the UI
    endDate: string; // This is a local datetime string from the UI
    duration: number;
    status: "active" | "draft" | "archived";
    questions: Question[];
    departmentId?: string;
    institutionId?: string;
  }) => {
    let loadingToastId: string | undefined; // Declare with `let` outside try-catch
    try {
      loadingToastId = toast.loading(
        editingExam ? "Updating exam..." : "Creating exam..."
      );

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.dismiss(loadingToastId);
        toast.error("You must be logged in");
        return;
      }

      // Convert local datetime strings to UTC ISO strings for the backend
      const utcStartDate = convertLocalToUTCISO(examData.startDate);
      const utcEndDate = convertLocalToUTCISO(examData.endDate);

      const url = editingExam ? `/api/exams/${editingExam.id}` : "/api/exams";

      const method = editingExam ? "PUT" : "POST";

      const requestBody = {
        ...examData,
        startDate: utcStartDate,
        endDate: utcEndDate,
        status: examData.status,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save exam");
      }

      toast.dismiss(loadingToastId);
      toast.success(
        editingExam
          ? `Exam "${examData.name}" updated successfully!`
          : `Exam "${examData.name}" created successfully!`
      );

      setEditingExam(null);
      await fetchExams();
      setCurrentPage(1);
    } catch (error) {
      console.error("Error saving exam:", error);
      if (loadingToastId) toast.dismiss(loadingToastId); // Dismiss if it exists
      toast.error("Failed to save exam");
    }
  };

  // Helper function to format ISO string (UTC) to datetime-local input format (YYYY-MM-DDTHH:MM local)
  const formatForDatetimeLocal = (isoString?: string): string => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString); // Parses the ISO string (e.g., "2025-10-13T19:11:00+00:00")
      if (isNaN(date.getTime())) {
        console.warn(
          `[formatForDatetimeLocal] Invalid date string received: ${isoString}`
        );
        return "";
      }

      // These getters (getFullYear, getMonth, etc.) automatically return values in the *local* timezone.
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
      const day = date.getDate().toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      const formattedLocalString = `${year}-${month}-${day}T${hours}:${minutes}`;

      return formattedLocalString;
    } catch (e) {
      console.error(
        `[formatForDatetimeLocal] Error processing date string: ${isoString}`,
        e
      );
      return "";
    }
  };

  // Helper function to convert 'YYYY-MM-DDTHH:MM' local time string to ISO 8601 UTC for backend
  const convertLocalToUTCISO = (localDatetimeString: string): string | null => {
    if (!localDatetimeString) return null;
    try {
      const date = new Date(localDatetimeString); // Parses as local time
      if (isNaN(date.getTime())) {
        console.warn(
          `[convertLocalToUTCISO] Invalid local datetime string: ${localDatetimeString}`
        );
        return null;
      }
      const utcISOString = date.toISOString(); // Converts to UTC ISO string

      return utcISOString;
    } catch (e) {
      console.error(
        `[convertLocalToUTCISO] Error processing local datetime string: ${localDatetimeString}`,
        e
      );
      return null;
    }
  };

  const handleEditExam = async (exam: Exam) => {
    try {
      setIsEditMode(true); // Set edit mode flag
      setIsAddExamOpen(true); // Open dialog immediately
      setIsDialogLoading(true); // Show skeleton

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("You must be logged in");
        setIsAddExamOpen(false);
        setIsDialogLoading(false);
        setIsEditMode(false);
        return;
      }

      const response = await fetch(`/api/exams/${exam.id}`, {
        headers: { Authorization: `Bearer ${session.session.access_token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch exam details");
      }

      const examDetails = await response.json();

      setEditingExam({
        id: examDetails.id,
        title: examDetails.title,
        start_time: formatForDatetimeLocal(examDetails.start_time),
        end_time: formatForDatetimeLocal(examDetails.end_time),
        duration: examDetails.duration || 60,
        questions: examDetails.questions || [],
        status: examDetails.status || "draft",
        department_id: examDetails.department_id,
        institution_id: examDetails.institution_id,
      });

      setIsDialogLoading(false); // Hide skeleton
    } catch {
      setIsAddExamOpen(false);
      setIsDialogLoading(false);
      setIsEditMode(false);
      toast.error("Failed to load exam details");
    }
  };

  const confirmDeleteExams = async () => {
    if (examsToDelete.length === 0) return;

    const loadingToastId = toast.loading(
      `Deleting ${examsToDelete.length} exam(s)...`
    );
    setDeletingExams(new Set(examsToDelete));

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.dismiss(loadingToastId);
        toast.error("You must be logged in");
        return;
      }

      const deletePromises = examsToDelete.map((id) =>
        fetch(`/api/exams/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
          },
        })
      );

      await Promise.all(deletePromises);

      toast.dismiss(loadingToastId);
      toast.success("Exams deleted successfully");

      setSelectedRows(new Set());
      setExamsToDelete([]);
      await fetchExams();
    } catch (error) {
      console.error("[TeacherExamsPage] Error deleting exams:", error);
      if (loadingToastId) toast.dismiss(loadingToastId); // Dismiss if it exists
      toast.error("Failed to delete exams");
    } finally {
      setDeletingExams(new Set());
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteExams = () => {
    const toDelete = selectedRows.size > 0 ? Array.from(selectedRows) : [];
    if (toDelete.length === 0) return;

    setExamsToDelete(toDelete);
    setShowDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setIsAddExamOpen(false);
    setEditingExam(null);
    setIsEditMode(false);
  };

  const getDuration = (exam: Exam): number => {
    // Prioritize stored duration directly from the exam object if it's a valid number
    if (typeof exam.duration === "number" && exam.duration > 0) {
      return exam.duration;
    }

    // Fallback to calculation if duration is not explicitly stored or is invalid/zero
    const startTime = exam.start_time ? new Date(exam.start_time) : null;
    const endTime = exam.end_time ? new Date(exam.end_time) : null;

    if (!startTime || !endTime) {
      console.warn(
        `[getDuration] Missing start_time or end_time for exam ID ${exam.id}. Returning default 60 min.`,
        { startTime: exam.start_time, endTime: exam.end_time }
      );
      return 60; // Default duration
    }

    const durationMs = endTime.getTime() - startTime.getTime();
    if (durationMs < 0) {
      console.warn(
        `[getDuration] end_time is before start_time for exam ID ${exam.id}. Returning default 60 min.`,
        { startTime: exam.start_time, endTime: exam.end_time }
      );
      return 60; // Default duration for invalid range
    }

    const calculatedDuration = Math.round(durationMs / (1000 * 60));

    return calculatedDuration;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <StatsCard
          title="Total Exams"
          value={stats.total}
          description="All created exams"
          icon={BookOpen}
        />
        <StatsCard
          title="Active Exams"
          value={stats.active}
          description="Currently available"
          icon={Clock}
        />
        <StatsCard
          title="Draft Exams"
          value={stats.draft}
          description="In preparation"
          icon={FileText}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <CardTitle>Exams List</CardTitle>
                <CardDescription>
                  Manage all exams in your institution
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddExamOpen(true)}>
                <Plus className="h-4 w-4" />
                Create New Exam
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    className="h-7"
                    onClick={handleDeleteExams}
                    disabled={deletingExams.size > 0}
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
                  placeholder="Search exams by name..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border overflow-hidden">
              <div className="max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted/90 backdrop-blur-sm z-10">
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedRows.size === paginatedExams.length &&
                            paginatedExams.length > 0
                          }
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                          disabled={loading}
                        />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[200px] border-r"
                        onClick={() => handleSort("title")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Name</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="resize-x overflow-hidden min-w-[120px] border-r">
                        <div className="flex items-center space-x-2">
                          <span>Department</span>
                        </div>
                      </TableHead>
                      <TableHead className="resize-x overflow-hidden min-w-[100px] border-r">
                        <div className="flex items-center space-x-2">
                          <span>Duration</span>
                        </div>
                      </TableHead>
                      <TableHead className="resize-x overflow-hidden min-w-[180px] border-r">
                        <div className="flex items-center space-x-2">
                          <span>Schedule</span>
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[100px] border-r"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Status</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>

                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[140px]"
                        onClick={() => handleSort("assignedStudents")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Assigned Students</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <ExamTableSkeleton />
                    ) : paginatedExams.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <EmptyState onReset={resetAllFilters} />
                        </TableCell>
                      </TableRow>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {paginatedExams.map((exam, index) => (
                          <motion.tr
                            key={exam.id}
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
                            onClick={() => handleEditExam(exam)}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedRows.has(exam.id)}
                                onCheckedChange={() =>
                                  toggleRowSelection(exam.id)
                                }
                                aria-label={`Select ${exam.title}`}
                                disabled={deletingExams.has(exam.id)}
                              />
                            </TableCell>
                            <TableCell className="border-r">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                  <BookOpen className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium capitalize">
                                  {exam.title}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="border-r">
                              <span className="text-sm">
                                {departments.get(exam.department_id || "") ||
                                  "Unknown"}
                              </span>
                            </TableCell>
                            <TableCell className="border-r">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                {getDuration(exam)} min
                              </div>
                            </TableCell>
                            <TableCell className="border-r">
                              <div className="space-y-1 text-xs">
                                {/* Show Start Time if available */}
                                {exam.start_time && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      Start:
                                    </span>
                                    <span>
                                      {new Date(
                                        exam.start_time
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                )}

                                {/* Show End Time if available */}
                                {exam.end_time && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      End:
                                    </span>
                                    <span>
                                      {new Date(exam.end_time).toLocaleString()}
                                    </span>
                                  </div>
                                )}

                                {/* Fallback: Not scheduled */}
                                {!exam.start_time && !exam.end_time && (
                                  <span className="text-muted-foreground">
                                    Not scheduled
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="border-r">
                              <Badge
                                variant={
                                  exam.status === "active"
                                    ? "default"
                                    : exam.status === "draft"
                                    ? "secondary"
                                    : "outline"
                                }
                                className={
                                  exam.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : exam.status === "draft"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {exam.status?.charAt(0).toUpperCase() +
                                  (exam.status?.slice(1) || "")}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                {exam.assignedStudents || 0}
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

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(
                  startIndex + itemsPerPage,
                  filteredAndSortedExams.length
                )}{" "}
                of {filteredAndSortedExams.length} exams
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
          </CardContent>
        </Card>
      </motion.div>

      <AddExamDialog
        isOpen={isAddExamOpen}
        onOpenChange={handleCloseDialog}
        onSaveExam={handleAddExam}
        loading={isDialogLoading}
        isEditMode={isEditMode}
        editExam={
          editingExam
            ? {
                id: editingExam.id,
                name: editingExam.title,
                startDate: editingExam.start_time || "",
                endDate: editingExam.end_time || "",
                duration: editingExam.duration || 60,
                status: editingExam.status || "draft",
                questions: editingExam.questions || [],
                departmentId: editingExam.department_id,
                institutionId: editingExam.institution_id,
              }
            : null
        }
      />

      {/* Warning Dialog for Exam Deletion */}
      <WarningDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Exam(s)"
        description={`Are you sure you want to delete ${examsToDelete.length} exam(s)? This action cannot be undone and will also delete all associated student responses and sessions.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDeleteExams}
        onCancel={() => {
          setShowDeleteDialog(false);
          setExamsToDelete([]);
        }}
      />
    </motion.div>
  );
}
