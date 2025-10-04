"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { mockExamSessions } from "@/lib/mock-data/exam-sessions";

// Convert mock exam sessions to the format used in the UI
const mockExams = Object.values(mockExamSessions).map(session => ({
  id: session.id,
  subject: session.subject,
  examName: session.title,
  date: new Date(session.startTime).toLocaleDateString(),
  time: "09:00 AM - 11:00 AM", // Mock time
  duration: `${session.timeLimit} minutes`,
  status: "scheduled",
  score: null
}));

export default function ExamsPage() {
  const router = useRouter();
  
  const startExam = (examId: string) => {
    router.push(`/student/exam/${examId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 p-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Exams</h1>
        <p className="text-muted-foreground">View your upcoming and past exams</p>
      </div>

      <div className="grid gap-6">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Upcoming Exams</span>
            </CardTitle>
            <CardDescription>Your scheduled exams and assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockExams.map((exam) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h3 className="font-semibold">{exam.subject} - {exam.examName}</h3>
                    <p className="text-sm text-muted-foreground">{exam.date} at {exam.time}</p>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{exam.duration}</span>
                      <span className="capitalize">{exam.status}</span>
                    </div>
                  </div>
                  <Button onClick={() => startExam(exam.id)}>Start Exam</Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}