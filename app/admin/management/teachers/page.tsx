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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  MoreHorizontal,
  ArrowUpDown,
  Users,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Trash,
  Mail,
  Trash2,
  User,
} from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email: string;
  status: "accepted" | "pending";
  createdExams: number;
  invitedStudents: number;
  dateJoined: Date;
  lastActive: Date;
  profileImage?: string;
  phone?: string;
  department?: string;
  subjects?: string[];
}

// Demo data
const demoTeachers: Teacher[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@school.edu",
    status: "accepted",
    createdExams: 12,
    invitedStudents: 45,
    dateJoined: new Date("2024-01-15"),
    lastActive: new Date("2024-12-10"),
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    phone: "+1 (555) 123-4567",
    department: "Mathematics",
    subjects: ["Algebra", "Calculus"],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@school.edu",
    status: "pending",
    createdExams: 8,
    invitedStudents: 32,
    dateJoined: new Date("2024-02-20"),
    lastActive: new Date("2024-12-08"),
    department: "Science",
    subjects: ["Chemistry", "Biology"],
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@school.edu",
    status: "accepted",
    createdExams: 15,
    invitedStudents: 67,
    dateJoined: new Date("2023-11-10"),
    lastActive: new Date("2024-12-11"),
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    phone: "+1 (555) 987-6543",
    department: "English",
    subjects: ["Literature", "Grammar"],
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@school.edu",
    status: "accepted",
    createdExams: 6,
    invitedStudents: 28,
    dateJoined: new Date("2024-03-05"),
    lastActive: new Date("2024-12-09"),
    department: "History",
    subjects: ["World History", "Geography"],
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@school.edu",
    status: "pending",
    createdExams: 3,
    invitedStudents: 15,
    dateJoined: new Date("2024-11-20"),
    lastActive: new Date("2024-12-05"),
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
    phone: "+1 (555) 456-7890",
    department: "Physical Education",
    subjects: ["Sports", "Health"],
  },
  {
    id: "6",
    name: "Lisa Anderson",
    email: "lisa.anderson@school.edu",
    status: "accepted",
    createdExams: 18,
    invitedStudents: 89,
    dateJoined: new Date("2023-09-12"),
    lastActive: new Date("2024-12-11"),
    profileImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
    phone: "+1 (555) 234-5678",
    department: "Computer Science",
    subjects: ["Programming", "Data Structures"],
  },
  {
    id: "7",
    name: "Robert Garcia",
    email: "robert.garcia@school.edu",
    status: "pending",
    createdExams: 4,
    invitedStudents: 22,
    dateJoined: new Date("2024-10-15"),
    lastActive: new Date("2024-12-07"),
    department: "Art",
    subjects: ["Drawing", "Painting"],
  },
  {
    id: "8",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@school.edu",
    status: "accepted",
    createdExams: 11,
    invitedStudents: 56,
    dateJoined: new Date("2024-01-30"),
    lastActive: new Date("2024-12-10"),
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
    phone: "+1 (555) 345-6789",
    department: "Music",
    subjects: ["Piano", "Music Theory"],
  },
  {
    id: "9",
    name: "Thomas Lee",
    email: "thomas.lee@school.edu",
    status: "accepted",
    createdExams: 9,
    invitedStudents: 41,
    dateJoined: new Date("2024-04-18"),
    lastActive: new Date("2024-12-09"),
    department: "Physics",
    subjects: ["Mechanics", "Thermodynamics"],
  },
  {
    id: "10",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@school.edu",
    status: "pending",
    createdExams: 2,
    invitedStudents: 18,
    dateJoined: new Date("2024-11-05"),
    lastActive: new Date("2024-12-06"),
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face",
    phone: "+1 (555) 456-7891",
    department: "Spanish",
    subjects: ["Spanish Language", "Literature"],
  },
  {
    id: "11",
    name: "James Thompson",
    email: "james.thompson@school.edu",
    status: "accepted",
    createdExams: 16,
    invitedStudents: 73,
    dateJoined: new Date("2023-08-22"),
    lastActive: new Date("2024-12-11"),
    profileImage:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face",
    phone: "+1 (555) 567-8901",
    department: "Geography",
    subjects: ["World Geography", "Environmental Science"],
  },
  {
    id: "12",
    name: "Amanda White",
    email: "amanda.white@school.edu",
    status: "accepted",
    createdExams: 7,
    invitedStudents: 34,
    dateJoined: new Date("2024-05-10"),
    lastActive: new Date("2024-12-08"),
    department: "Psychology",
    subjects: ["General Psychology", "Development"],
  },
];

type SortField =
  | "name"
  | "email"
  | "status"
  | "createdExams"
  | "invitedStudents"
  | "dateJoined";
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
      <h3 className="text-lg font-semibold mb-2">No teachers found</h3>
      <p className="text-muted-foreground mb-4">
        No teachers match your current search and filter criteria. Try adjusting
        your filters or search terms.
      </p>
      <Button variant="outline" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(demoTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const itemsPerPage = 5;

  // Filter and sort teachers
  const filteredAndSortedTeachers = useMemo(() => {
    const filtered = teachers.filter((teacher) => {
      const matchesSearch =
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || teacher.status === statusFilter;

      let matchesDate = true;
      if (dateFilter !== "all") {
        const now = new Date();
        const teacherDate = teacher.dateJoined;

        switch (dateFilter) {
          case "week":
            matchesDate =
              now.getTime() - teacherDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
            break;
          case "month":
            matchesDate =
              now.getTime() - teacherDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
            break;
          case "year":
            matchesDate =
              now.getTime() - teacherDate.getTime() <=
              365 * 24 * 60 * 60 * 1000;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    // Sort teachers
    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortField) {
        case "name":
        case "email":
        case "status":
          aValue = a[sortField];
          bValue = b[sortField];
          break;
        case "createdExams":
        case "invitedStudents":
          aValue = a[sortField];
          bValue = b[sortField];
          break;
        case "dateJoined":
          aValue = a.dateJoined;
          bValue = b.dateJoined;
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
  }, [teachers, searchTerm, statusFilter, dateFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeachers = filteredAndSortedTeachers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Stats
  const stats = useMemo(() => {
    const total = teachers.length;
    const active = teachers.filter((t) => t.status === "accepted").length;
    const inactive = teachers.filter((t) => t.status === "pending").length;

    return { total, active, inactive };
  }, [teachers]);

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

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsViewModalOpen(true);
  };

  const toggleRowSelection = (teacherId: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(teacherId)) {
      newSelection.delete(teacherId);
    } else {
      newSelection.add(teacherId);
    }
    setSelectedRows(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedTeachers.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedTeachers.map((t) => t.id)));
    }
  };

  const handleDeleteSelected = () => {
    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSelected = () => {
    const selectedIds = Array.from(selectedRows);
    setTeachers((prev) =>
      prev.filter((teacher) => !selectedIds.includes(teacher.id))
    );
    setSelectedRows(new Set());
    setIsDeleteModalOpen(false);
    setIsBulkDelete(false);
    // Reset to first page if current page becomes empty
    const remainingTeachers = teachers.filter(
      (teacher) => !selectedIds.includes(teacher.id)
    );
    const newTotalPages = Math.ceil(remainingTeachers.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleDeleteSingle = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setIsBulkDelete(false);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSingle = () => {
    if (!teacherToDelete) return;

    setTeachers((prev) =>
      prev.filter((teacher) => teacher.id !== teacherToDelete.id)
    );
    // Remove from selected rows if it was selected
    if (selectedRows.has(teacherToDelete.id)) {
      const newSelection = new Set(selectedRows);
      newSelection.delete(teacherToDelete.id);
      setSelectedRows(newSelection);
    }
    setIsDeleteModalOpen(false);
    setTeacherToDelete(null);
    // Reset to first page if current page becomes empty
    const remainingTeachers = teachers.filter(
      (teacher) => teacher.id !== teacherToDelete.id
    );
    const newTotalPages = Math.ceil(remainingTeachers.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
        className="grid gap-4 md:grid-cols-3"
      >
        <StatsCard
          title="Total Teachers"
          value={stats.total}
          description="All registered teachers"
          icon={Users}
        />
        <StatsCard
          title="Active Teachers"
          value={stats.active}
          description="Accepted invitations"
          icon={UserCheck}
        />
        <StatsCard
          title="Pending Teachers"
          value={stats.inactive}
          description="Awaiting acceptance"
          icon={UserX}
        />
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <CardTitle>Teachers List</CardTitle>
                <CardDescription>
                  A list of all teachers in your institution
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4" />
                Add New Teacher
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
                  placeholder="Search teachers by name or email..."
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
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
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

            {/* Table */}
            <div className="rounded-md border overflow-hidden">
              <div className="max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted/90 backdrop-blur-sm z-10">
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedRows.size === paginatedTeachers.length &&
                            paginatedTeachers.length > 0
                          }
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[150px]"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Name</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[200px]"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Email</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[100px]"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Status</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[120px]"
                        onClick={() => handleSort("createdExams")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Created Exams</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[140px]"
                        onClick={() => handleSort("invitedStudents")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Invited Students</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 resize-x overflow-hidden min-w-[120px]"
                        onClick={() => handleSort("dateJoined")}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Date Joined</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="resize-x overflow-hidden min-w-[100px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTeachers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <EmptyState onReset={resetAllFilters} />
                        </TableCell>
                      </TableRow>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {paginatedTeachers.map((teacher, index) => (
                          <motion.tr
                            key={teacher.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{
                              opacity: 0,
                              x: 100,
                              transition: { duration: 0.3 },
                            }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            layout
                            className="border-b transition-all duration-200 hover:bg-muted/30 hover:shadow-sm data-[state=selected]:bg-muted group"
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedRows.has(teacher.id)}
                                onCheckedChange={() =>
                                  toggleRowSelection(teacher.id)
                                }
                                aria-label={`Select ${teacher.name}`}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={teacher.profileImage}
                                    alt={teacher.name}
                                  />
                                  <AvatarFallback>
                                    {teacher.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                  {teacher.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{teacher.email}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  teacher.status === "accepted"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  teacher.status === "accepted"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {teacher.status.charAt(0).toUpperCase() +
                                  teacher.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{teacher.createdExams}</TableCell>
                            <TableCell>{teacher.invitedStudents}</TableCell>
                            <TableCell>
                              {formatDate(teacher.dateJoined)}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleViewTeacher(teacher)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Teacher
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteSingle(teacher)}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete Teacher
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(
                  startIndex + itemsPerPage,
                  filteredAndSortedTeachers.length
                )}{" "}
                of {filteredAndSortedTeachers.length} teachers
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

      {/* View Teacher Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Teacher Details</DialogTitle>
            <DialogDescription>
              View detailed information about this teacher
            </DialogDescription>
          </DialogHeader>
          {selectedTeacher && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedTeacher.profileImage}
                    alt={selectedTeacher.name}
                  />
                  <AvatarFallback className="text-lg">
                    {selectedTeacher.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedTeacher.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedTeacher.email}
                  </p>
                  <Badge
                    variant={
                      selectedTeacher.status === "accepted"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      selectedTeacher.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {selectedTeacher.status.charAt(0).toUpperCase() +
                      selectedTeacher.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p className="font-medium">
                    {selectedTeacher.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Department
                  </label>
                  <p className="font-medium">
                    {selectedTeacher.department || "Not assigned"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created Exams
                  </label>
                  <p className="font-medium">{selectedTeacher.createdExams}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Invited Students
                  </label>
                  <p className="font-medium">
                    {selectedTeacher.invitedStudents}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Date Joined
                  </label>
                  <p className="font-medium">
                    {formatDate(selectedTeacher.dateJoined)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Active
                  </label>
                  <p className="font-medium">
                    {formatDate(selectedTeacher.lastActive)}
                  </p>
                </div>
              </div>

              {selectedTeacher.subjects &&
                selectedTeacher.subjects.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Subjects
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedTeacher.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              {isBulkDelete
                ? `Are you sure you want to delete ${
                    selectedRows.size
                  } selected teacher${
                    selectedRows.size > 1 ? "s" : ""
                  }? This action cannot be undone.`
                : `Are you sure you want to delete ${teacherToDelete?.name}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {isBulkDelete ? (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium mb-2">
                  Teachers to be deleted:
                </p>
                <div className="space-y-1">
                  {Array.from(selectedRows).map((teacherId) => {
                    const teacher = teachers.find((t) => t.id === teacherId);
                    return teacher ? (
                      <div key={teacherId} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={teacher.profileImage}
                            alt={teacher.name}
                          />
                          <AvatarFallback className="text-xs">
                            {teacher.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{teacher.name}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ) : teacherToDelete ? (
              <div className="bg-muted p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={teacherToDelete.profileImage}
                      alt={teacherToDelete.name}
                    />
                    <AvatarFallback>
                      {teacherToDelete.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{teacherToDelete.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {teacherToDelete.email}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setTeacherToDelete(null);
                  setIsBulkDelete(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={
                  isBulkDelete ? confirmDeleteSelected : confirmDeleteSingle
                }
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete{" "}
                {isBulkDelete
                  ? `${selectedRows.size} Teacher${
                      selectedRows.size > 1 ? "s" : ""
                    }`
                  : "Teacher"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
