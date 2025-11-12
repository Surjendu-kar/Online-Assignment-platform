"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase/client";
import { formatDuration } from "@/lib/format-duration";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Trophy,
  Target,
  Play,
  FileText,
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  department: string;
  startTime: string | null;
  endTime: string | null;
  status: "pending" | "in-progress" | "completed" | "expired" | "upcoming";
  duration: number;
  totalQuestions: number;
  score?: number | null;
  sessionId?: string | null;
}

interface RecentActivity {
  id: string;
  type: "exam" | "assignment" | "grade";
  title: string;
  time: string;
  score?: number;
  status: "completed" | "graded" | "submitted";
}

const mockRecentActivity: RecentActivity[] = [
  {
    id: "1",
    type: "exam",
    title: "Chemistry Lab Report",
    time: "2 hours ago",
    score: 85,
    status: "completed",
  },
  {
    id: "2",
    type: "grade",
    title: "Biology Quiz",
    time: "1 day ago",
    score: 92,
    status: "graded",
  },
  {
    id: "3",
    type: "assignment",
    title: "Physics Quiz Chapter 5",
    time: "3 days ago",
    status: "submitted",
  },
];

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  color = "blue",
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="gap-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 text-${color}-600`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "upcoming":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow gap-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{assignment.title}</CardTitle>
              <CardDescription>{assignment.department}</CardDescription>
            </div>
            <Badge className={getStatusColor(assignment.status)}>
              {getStatusLabel(assignment.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(assignment.duration)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>{assignment.totalQuestions} questions</span>
            </div>
          </div>

          {assignment.score !== null && assignment.score !== undefined && (
            <div className="flex items-center space-x-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">{assignment.score}%</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {assignment.endTime
                  ? `Due: ${new Date(assignment.endTime).toLocaleDateString()}`
                  : "No deadline"}
              </span>
            </div>

            {(assignment.status === "pending" ||
              assignment.status === "upcoming") && (
              <Button
                size="sm"
                onClick={() => router.push(`/student/exam/${assignment.id}`)}
                disabled={assignment.status === "upcoming"}
              >
                <Play className="h-4 w-4 mr-2" />
                {assignment.status === "upcoming"
                  ? "Not Started"
                  : "Start Exam"}
              </Button>
            )}

            {assignment.status === "in-progress" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/student/exam/${assignment.id}`)}
              >
                Continue
              </Button>
            )}

            {assignment.status === "expired" && (
              <Button size="sm" variant="outline" disabled>
                Expired
              </Button>
            )}

            {assignment.status === "completed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/student/results`)}
              >
                View Result
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ActivityItem({ activity }: { activity: RecentActivity }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "exam":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "grade":
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case "assignment":
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center space-x-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
      <div className="flex-shrink-0">{getIcon(activity.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{activity.title}</p>
        <p className="text-xs text-muted-foreground">{activity.time}</p>
      </div>
      {activity.score && (
        <div className="flex-shrink-0">
          <Badge variant="outline">{activity.score}%</Badge>
        </div>
      )}
    </div>
  );
}

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    studentId: "",
    department: "",
    semester: "Spring 2024",
    avatar: "",
  });

  useEffect(() => {
    fetchStudentData();
    fetchAssignedExams();
  }, []);

  const fetchStudentData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("user_profiles")
          .select(
            `
            first_name,
            last_name,
            email,
            departments (
              name
            )
          `
          )
          .eq("id", user.id)
          .single();

        if (data) {
          const profile = data as unknown as {
            first_name: string;
            last_name: string;
            email: string;
            departments: { name: string } | null;
          };

          setStudentData({
            name: `${profile.first_name} ${profile.last_name}`,
            email: profile.email || "",
            studentId: user.id.substring(0, 8).toUpperCase(),
            department: profile.departments?.name || "Not assigned",
            semester: "Spring 2024",
            avatar: "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const fetchAssignedExams = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/student/assigned-exams");
      const data = await response.json();

      if (response.ok) {
        setAssignments(data);
      } else {
        console.error("Error fetching exams:", data.error);
      }
    } catch (error) {
      console.error("Error fetching assigned exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalAssignments: assignments.length,
    completedAssignments: assignments.filter((a) => a.status === "completed")
      .length,
    averageScore:
      assignments.filter((a) => a.score !== null && a.score !== undefined)
        .length > 0
        ? Math.round(
            assignments
              .filter((a) => a.score !== null)
              .reduce((sum, a) => sum + (a.score || 0), 0) /
              assignments.filter((a) => a.score !== null).length
          )
        : 0,
    pendingAssignments: assignments.filter(
      (a) => a.status === "pending" || a.status === "upcoming"
    ).length,
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          title="Total Assignments"
          value={stats.totalAssignments}
          description="All assignments"
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Completed"
          value={stats.completedAssignments}
          description="Finished assignments"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          description="Overall performance"
          icon={Trophy}
          color="yellow"
        />
        <StatsCard
          title="Pending"
          value={stats.pendingAssignments}
          description="Awaiting completion"
          icon={AlertCircle}
          color="red"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assignments Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between space-x-2">
                <span>My Assignments</span>
                <Target className="h-4 w-4" />
              </CardTitle>
              <CardDescription>
                Your current and upcoming assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No exams assigned yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment, index) => (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <AssignmentCard assignment={assignment} />
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="gap-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between space-x-2">
                <span>Recent Activity</span>
                <Clock className="h-4 w-4" />
              </CardTitle>
              <CardDescription>Your latest activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {mockRecentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
