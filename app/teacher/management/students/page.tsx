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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { WarningDialog } from "@/components/WarningDialog";
import { ViewStudentDialog } from "@/components/ViewStudentDialog";
import { AddStudentDialog } from "@/components/AddStudentDialog";
import studentsData from "@/data/studentsData.json";
import examsData from "@/data/examsData.json";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  ArrowUpDown,
  Users,
  UserCheck,
  UserX,
  Trash2,
  User,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending" | "suspended";
  assignedExams: number;
  completedExams: number;
  averageScore: number;
  dateJoined: Date;
  lastActive: Date;
  profileImage?: string;
  studentId?: string;
  department?: string;
  assignedExam?: string;
}

const demoStudents: Student[] = studentsData.map((student) => ({
  ...student,
  status: student.status as "active" | "pending" | "suspended",
  dateJoined: new Date(student.dateJoined),
  lastActive: new Date(student.lastActive),
}));

type SortField =
  | "name"
  | "email"
  | "status"
  | "department"
  | "assignedExam"
  | "averageScore";
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
      <User className="h-8 w-8 text-muted-foreground mb-2" />
      <h3 className="text-lg font-semibold mb-2">No students found</h3>
      <p className="text-muted-foreground mb-4">
        No students match your current search and filter criteria. Try adjusting
        your filters or search terms.
      </p>
      <Button variant="outline" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>(demoStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    selectedExam: string;
    expirationDate: string;
  } | null>(null);

  const itemsPerPage = 5;

  const getExamName = (examId: string) => {
    const exam = examsData.find((exam) => exam.id === examId);
    return exam ? exam.name : "No exam assigned";
  };

  const filteredAndSortedStudents = useMemo(() => {
    const filtered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.studentId &&
          student.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || student.status === statusFilter;

      let matchesDate = true;
      if (dateFilter !== "all") {
        const now = new Date();
        const studentDate = student.dateJoined;

        switch (dateFilter) {
          case "week":
            matchesDate =
              now.getTime() - studentDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
            break;
          case "month":
            matchesDate =
              now.getTime() - studentDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
            break;
          case "year":
            matchesDate =
              now.getTime() - studentDate.getTime() <=
              365 * 24 * 60 * 60 * 1000;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortField) {
        case "name":
        case "email":
        case "status":
        case "department":
        case "assignedExam":
          aValue = a[sortField] || "";
          bValue = b[sortField] || "";
          break;
        case "averageScore":
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

    return filtered;
  }, [students, searchTerm, statusFilter, dateFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredAndSortedStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === "active").length;
    const pending = students.filter((s) => s.status === "pending").length;

    return { total, active, pending };
  }, [students]);

  const resetAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
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

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    const [firstName, lastName] = student.name.split(" ");
    setEditingStudent({
      id: student.id,
      firstName: firstName || "",
      lastName: lastName || "",
      email: student.email,
      department: student.department || "",
      selectedExam: student.assignedExam || "",
      expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });
    setIsAddStudentOpen(true);
    setIsViewModalOpen(false);
  };

  const handleSendEmail = (student: Student) => {
    console.log("Send email to:", student.email);
    setIsViewModalOpen(false);
  };

  const handleDeleteFromView = (student: Student) => {
    setSelectedStudent(null);
    setIsViewModalOpen(false);
    handleDeleteSingle(student);
  };

  const handleAddStudent = (studentData: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    selectedExam: string;
    expirationDate: string;
  }) => {
    if (editingStudent) {
      const updatedStudent: Student = {
        ...students.find((s) => s.id === editingStudent.id)!,
        name: `${studentData.firstName} ${studentData.lastName}`,
        email: studentData.email,
        department: studentData.department,
        assignedExam: studentData.selectedExam,
      };
      setStudents((prev) =>
        prev.map((s) => (s.id === editingStudent.id ? updatedStudent : s))
      );
      setEditingStudent(null);
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: `${studentData.firstName} ${studentData.lastName}`,
        email: studentData.email,
        status: "pending",
        assignedExams: 1,
        completedExams: 0,
        averageScore: 0,
        dateJoined: new Date(),
        lastActive: new Date(),
        studentId: `STU${Date.now().toString().slice(-6)}`,
        department: studentData.department,
        assignedExam: studentData.selectedExam,
      };
      setStudents((prev) => [newStudent, ...prev]);
    }
  };

  const toggleRowSelection = (studentId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedRows(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedStudents.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedStudents.map((s) => s.id)));
    }
  };

  const handleDeleteSelected = () => {
    setStudentToDelete(null);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSelected = () => {
    const selectedIds = Array.from(selectedRows);
    setStudents((prev) =>
      prev.filter((student) => !selectedIds.includes(student.id))
    );
    setSelectedRows(new Set());
    setStudentToDelete(null);
    const remainingStudents = students.filter(
      (student) => !selectedIds.includes(student.id)
    );
    const newTotalPages = Math.ceil(remainingStudents.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleDeleteSingle = (student: Student) => {
    setSelectedRows(new Set());
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSingle = () => {
    if (!studentToDelete) return;

    setStudents((prev) =>
      prev.filter((student) => student.id !== studentToDelete.id)
    );
    if (selectedRows.has(studentToDelete.id)) {
      const newSelection = new Set(selectedRows);
      newSelection.delete(studentToDelete.id);
      setSelectedRows(newSelection);
    }
    setStudentToDelete(null);
    const remainingStudents = students.filter(
      (student) => student.id !== studentToDelete.id
    );
    const newTotalPages = Math.ceil(remainingStudents.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
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
          title="Total Students"
          value={stats.total}
          description="All registered students"
          icon={Users}
        />
        <StatsCard
          title="Active Students"
          value={stats.active}
          description="Currently active"
          icon={UserCheck}
        />
        <StatsCard
          title="Pending Students"
          value={stats.pending}
          description="Awaiting approval"
          icon={UserX}
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
                <CardTitle>Students List</CardTitle>
                <CardDescription>
                  A list of all students in your institution
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddStudentOpen(true)}>
                <Plus className="h-4 w-4" />
                Add New Student
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
                    onClick={handleDeleteSelected}
                    className="h-7"
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
                  placeholder="Search students by name, email or ID..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
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
                            selectedRows.size === paginatedStudents.length &&
                            paginatedStudents.length > 0
                          }
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[150px] border-r"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Name</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[200px] border-r"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Email</span>
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
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[120px] border-r"
                        onClick={() => handleSort("department")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Department</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[150px] border-r"
                        onClick={() => handleSort("assignedExam")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Assigned Exam</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[120px]"
                        onClick={() => handleSort("averageScore")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Average Score</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <EmptyState onReset={resetAllFilters} />
                        </TableCell>
                      </TableRow>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {paginatedStudents.map((student, index) => (
                          <motion.tr
                            key={student.id}
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
                            onClick={() => handleViewStudent(student)}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedRows.has(student.id)}
                                onCheckedChange={() =>
                                  toggleRowSelection(student.id)
                                }
                                aria-label={`Select ${student.name}`}
                              />
                            </TableCell>
                            <TableCell className="border-r">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={student.profileImage}
                                    alt={student.name}
                                  />
                                  <AvatarFallback>
                                    {student.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                  {student.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="border-r">
                              {student.email}
                            </TableCell>
                            <TableCell className="border-r">
                              <Badge
                                variant={
                                  student.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  student.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : student.status === "suspended"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {student.status.charAt(0).toUpperCase() +
                                  student.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="border-r">
                              {student.department || "Not assigned"}
                            </TableCell>
                            <TableCell className="border-r">
                              {student.assignedExam
                                ? getExamName(student.assignedExam)
                                : "No exam assigned"}
                            </TableCell>
                            <TableCell>{student.averageScore}%</TableCell>
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
                  filteredAndSortedStudents.length
                )}{" "}
                of {filteredAndSortedStudents.length} students
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

      <AddStudentDialog
        isOpen={isAddStudentOpen}
        onOpenChange={(open) => {
          setIsAddStudentOpen(open);
          if (!open) {
            setEditingStudent(null);
          }
        }}
        onSaveStudent={handleAddStudent}
        editStudent={editingStudent}
      />

      <ViewStudentDialog
        student={selectedStudent}
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        onEdit={handleEditStudent}
        onSendEmail={handleSendEmail}
        onDelete={handleDeleteFromView}
      />

      <WarningDialog
        open={isDeleteModalOpen && selectedRows.size > 0}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm Bulk Deletion"
        description={`Are you sure you want to delete ${
          selectedRows.size
        } selected student${
          selectedRows.size > 1 ? "s" : ""
        }? This action cannot be undone.`}
        confirmText={`Delete ${selectedRows.size} Student${
          selectedRows.size > 1 ? "s" : ""
        }`}
        onConfirm={confirmDeleteSelected}
        onCancel={() => {
          setIsDeleteModalOpen(false);
        }}
      >
        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Students to be deleted:</p>
          <div className="space-y-1">
            {Array.from(selectedRows).map((studentId) => {
              const student = students.find((s) => s.id === studentId);
              return student ? (
                <div key={studentId} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={student.profileImage}
                      alt={student.name}
                    />
                    <AvatarFallback className="text-xs">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{student.name}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </WarningDialog>

      <WarningDialog
        open={isDeleteModalOpen && studentToDelete !== null}
        onOpenChange={setIsDeleteModalOpen}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${studentToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete Student"
        onConfirm={confirmDeleteSingle}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
      >
        {studentToDelete && (
          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={studentToDelete.profileImage}
                  alt={studentToDelete.name}
                />
                <AvatarFallback>
                  {studentToDelete.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{studentToDelete.name}</p>
                <p className="text-sm text-muted-foreground">
                  {studentToDelete.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </WarningDialog>
    </motion.div>
  );
}
