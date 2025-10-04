"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Trophy,
  Target,
  Users,
  Play,
  FileText,
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
  timeLimit: number;
  totalQuestions: number;
  completedQuestions?: number;
  score?: number;
}

interface RecentActivity {
  id: string;
  type: "exam" | "assignment" | "grade";
  title: string;
  time: string;
  score?: number;
  status: "completed" | "graded" | "submitted";
}

const mockAssignments: Assignment[] = [
  {
    id: "exam-001",
    title: "Mathematics Final Exam",
    subject: "Mathematics",
    dueDate: "2024-01-15",
    status: "pending",
    timeLimit: 120,
    totalQuestions: 50,
  },
  {
    id: "exam-002",
    title: "Physics Quiz Chapter 5",
    subject: "Physics",
    dueDate: "2024-01-10",
    status: "in-progress",
    timeLimit: 45,
    totalQuestions: 20,
    completedQuestions: 12,
  },
  {
    id: "3",
    title: "Chemistry Lab Report",
    subject: "Chemistry",
    dueDate: "2024-01-05",
    status: "completed",
    timeLimit: 90,
    totalQuestions: 30,
    score: 85,
  },
  {
    id: "4",
    title: "English Literature Essay",
    subject: "English",
    dueDate: "2024-01-01",
    status: "overdue",
    timeLimit: 180,
    totalQuestions: 5,
  },
];

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
      <Card>
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
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const progress = assignment.completedQuestions
    ? (assignment.completedQuestions / assignment.totalQuestions) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{assignment.title}</CardTitle>
              <CardDescription>{assignment.subject}</CardDescription>
            </div>
            <Badge className={getStatusColor(assignment.status)}>
              {assignment.status.charAt(0).toUpperCase() +
                assignment.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{assignment.timeLimit} minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>{assignment.totalQuestions} questions</span>
            </div>
          </div>

          {assignment.status === "in-progress" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {assignment.completedQuestions}/{assignment.totalQuestions}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {assignment.score && (
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">{assignment.score}%</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            </div>

            {assignment.status === "pending" && (
              <Button
                size="sm"
                onClick={() => router.push(`/student/exam/${assignment.id}`)}
              >
                <Play className="h-4 w-4 mr-2" />
                View Exam
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
  const router = useRouter();
  
  // Mock student data
  const studentData = {
    name: "John Doe",
    email: "john.doe@university.edu",
    studentId: "STU123456",
    department: "Computer Science",
    semester: "Spring 2024",
    avatar: "",
  };

  const stats = {
    totalAssignments: mockAssignments.length,
    completedAssignments: mockAssignments.filter(
      (a) => a.status === "completed"
    ).length,
    averageScore: 89,
    pendingAssignments: mockAssignments.filter((a) => a.status === "pending")
      .length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6"
      >
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarImage src={studentData.avatar} alt={studentData.name} />
            <AvatarFallback className="text-blue-600 font-semibold text-lg">
              {studentData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {studentData.name}!
            </h1>
            <p className="text-blue-100">
              {studentData.department} • {studentData.semester}
            </p>
            <p className="text-blue-200 text-sm">
              Student ID: {studentData.studentId}
            </p>
          </div>
        </div>
      </motion.div>

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
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>My Assignments</span>
              </CardTitle>
              <CardDescription>
                Your current and upcoming assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAssignments.map((assignment, index) => (
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Your latest activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockRecentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push("/student/exams")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View All Assignments
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Trophy className="h-4 w-4 mr-2" />
                View Grades
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Class Schedule
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}