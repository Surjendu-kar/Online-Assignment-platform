"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/animate-ui/components/radix/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Calendar, Trophy, Play } from "lucide-react";
import { formatDuration } from "@/lib/format-duration";

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

interface ViewExamDialogProps {
  trigger?: React.ReactNode;
  exam: Exam | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onStartExam?: (exam: Exam) => void;
  onContinueExam?: (exam: Exam) => void;
  onViewResult?: (exam: Exam) => void;
}

export const ViewExamDialog = ({
  trigger,
  exam,
  open,
  onOpenChange,
  onStartExam,
  onContinueExam,
  onViewResult,
}: ViewExamDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpenChange = (openState: boolean) => {
    if (onOpenChange) {
      onOpenChange(openState);
    } else {
      setIsOpen(openState);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "upcoming":
        return "bg-purple-100 text-purple-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  };

  const dialogOpen = open !== undefined ? open : isOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        from="bottom"
        showCloseButton={true}
        className="sm:max-w-[500px]"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            Exam Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this exam
          </DialogDescription>
        </DialogHeader>

        {exam && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-xl">{exam.title}</h3>
              <p className="text-muted-foreground">{exam.department}</p>
              <Badge className={getStatusColor(exam.status)}>
                {getStatusLabel(exam.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Duration
                </label>
                <p className="font-medium">{formatDuration(exam.duration)}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Questions
                </label>
                <p className="font-medium">{exam.totalQuestions}</p>
              </div>
              {exam.startTime && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Start Time
                  </label>
                  <p className="font-medium">
                    {new Date(exam.startTime).toLocaleString()}
                  </p>
                </div>
              )}
              {exam.endTime && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    End Time
                  </label>
                  <p className="font-medium">
                    {new Date(exam.endTime).toLocaleString()}
                  </p>
                </div>
              )}
              {exam.score !== null && exam.score !== undefined && (
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    Score
                  </label>
                  <p className="font-medium text-2xl text-yellow-600">{exam.score}%</p>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            {exam && exam.status === "pending" && onStartExam && (
              <Button
                onClick={() => onStartExam(exam)}
                className="flex-1 sm:flex-none"
              >
                <Play className="h-4 w-4" />
                View Details
              </Button>
            )}
            {exam && exam.status === "in-progress" && onContinueExam && (
              <Button
                onClick={() => onContinueExam(exam)}
                className="flex-1 sm:flex-none"
              >
                <Play className="h-4 w-4" />
                Continue Exam
              </Button>
            )}
            {exam && exam.status === "completed" && onViewResult && (
              <Button
                variant="outline"
                onClick={() => onViewResult(exam)}
                className="flex-1 sm:flex-none"
              >
                View Result
              </Button>
            )}
          </div>
          <DialogClose asChild>
            <Button variant="default" type="button">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
