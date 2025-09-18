"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
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
import examsData from "@/data/examsData.json";
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

interface Exam {
  id: string;
  name: string;
  duration?: number;
  totalQuestions?: number;
  maxScore?: number;
  status?: "active" | "draft" | "archived";
  createdDate?: Date;
  assignedStudents?: number;
}

const demoExams: Exam[] = examsData.map((exam) => ({
  ...exam,
  status: exam.status as "active" | "draft" | "archived",
  createdDate: new Date(exam.createdDate),
}));

type SortField = "name" | "duration" | "status" | "assignedStudents";
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

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>(demoExams);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const itemsPerPage = 5;

  const filteredAndSortedExams = useMemo(() => {
    const filtered = exams.filter((exam) => {
      const matchesSearch = exam.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || exam.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "name":
        case "status":
          aValue = a[sortField] || "";
          bValue = b[sortField] || "";
          break;
        case "duration":
        case "assignedStudents":
          aValue = a[sortField] || 0;
          bValue = b[sortField] || 0;
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
    setSortField("name");
    setSortOrder("asc");
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
              <Button>
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
                  <Button size="sm" variant="destructive" className="h-7">
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
                <SelectTrigger className="w-full md:w-[180px]">
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
                        />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[200px] border-r"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Name</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>

                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[100px] border-r"
                        onClick={() => handleSort("duration")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Duration</span>
                          <ArrowUpDown className="h-4 w-4" />
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
                    {paginatedExams.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5}>
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
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedRows.has(exam.id)}
                                onCheckedChange={() =>
                                  toggleRowSelection(exam.id)
                                }
                                aria-label={`Select ${exam.name}`}
                              />
                            </TableCell>
                            <TableCell className="border-r">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                  <BookOpen className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium">{exam.name}</span>
                              </div>
                            </TableCell>

                            <TableCell className="border-r">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                {exam.duration || 60} min
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
    </motion.div>
  );
}
