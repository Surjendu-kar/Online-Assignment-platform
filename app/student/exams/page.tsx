"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Calendar,
  FileText,
  Play,
  Trophy,
} from "lucide-react";
import { formatDuration } from "@/lib/format-duration";
import { ExamsListSkeleton } from "@/components/ExamsListSkeleton";

interface Exam {
  id: string;
  title: string;
  department: string;
  startTime: string | null;
  endTime: string | null;
  duration: number;
  totalQuestions: number;
  status: "pending" | "in-progress" | "completed" | "expired" | "upcoming";
  score?: number | null;
  sessionId?: string | null;
}

export default function ExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigatingExamId, setNavigatingExamId] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "completed" | "expired"
  >("all");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/student/assigned-exams");
      const data = await response.json();

      if (response.ok) {
        setExams(data);
      } else {
        console.error("Error fetching exams:", data.error);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const startExam = (examId: string) => {
    setNavigatingExamId(examId);
    router.push(`/student/exam/${examId}`);
  };

  const filteredExams = exams.filter((exam) => {
    if (filter === "all") return true;
    if (filter === "pending")
      return exam.status === "pending" || exam.status === "upcoming";
    if (filter === "completed") return exam.status === "completed";
    if (filter === "expired") return exam.status === "expired";
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 p-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Exams</h1>
        <p className="text-muted-foreground">
          View your upcoming and past exams
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          size="sm"
        >
          All ({exams.length})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
          size="sm"
        >
          Pending (
          {
            exams.filter(
              (e) => e.status === "pending" || e.status === "upcoming"
            ).length
          }
          )
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
          size="sm"
        >
          Completed ({exams.filter((e) => e.status === "completed").length})
        </Button>
        <Button
          variant={filter === "expired" ? "default" : "outline"}
          onClick={() => setFilter("expired")}
          size="sm"
        >
          Expired ({exams.filter((e) => e.status === "expired").length})
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="gap-0">
            <CardDescription>
              All your assigned exams and assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ExamsListSkeleton />
            ) : filteredExams.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No exams found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredExams.map((exam) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between rounded-lg border p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{exam.title}</h3>
                        <Badge className={getStatusColor(exam.status)}>
                          {getStatusLabel(exam.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {exam.department}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(exam.duration)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{exam.totalQuestions} questions</span>
                        </div>
                        {exam.endTime && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Due: {new Date(exam.endTime).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {exam.score !== null && exam.score !== undefined && (
                          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                            <Trophy className="h-4 w-4" />
                            <span className="font-semibold">{exam.score}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      {exam.status === "upcoming" && (
                        <Button
                          onClick={() => startExam(exam.id)}
                          disabled
                          className="cursor-pointer"
                        >
                          <Play className="h-4 w-4" />
                          Not Started
                        </Button>
                      )}
                      {exam.status === "pending" && (
                        <Button
                          onClick={() => startExam(exam.id)}
                          className="cursor-pointer"
                          disabled={navigatingExamId === exam.id}
                        >
                          {navigatingExamId === exam.id ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              View Details
                            </>
                          )}
                        </Button>
                      )}
                      {exam.status === "in-progress" && (
                        <Button
                          onClick={() => {
                            setNavigatingExamId(exam.id);
                            router.push(`/student/exam/${exam.id}/start`);
                          }}
                          disabled={navigatingExamId === exam.id}
                        >
                          {navigatingExamId === exam.id ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              Continue
                            </>
                          )}
                        </Button>
                      )}

                      {exam.status === "expired" && (
                        <Button disabled variant="outline">
                          Expired
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
