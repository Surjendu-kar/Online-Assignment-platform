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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, Trash } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email: string;
  status: "accepted" | "pending";
  createdExams: number;
  invitedStudents: number;
  dateJoined: Date;
  createdBy?: string;
  profileImage?: string;
  phone?: string;
  department?: string;
  subjects?: string[];
  expirationDate?: string;
}

interface ViewTeacherDialogProps {
  trigger?: React.ReactNode;
  teacher: Teacher | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEdit?: (teacher: Teacher) => void;
  onSendEmail?: (teacher: Teacher) => void;
  onDelete?: (teacher: Teacher) => void;
}

export const ViewTeacherDialog = ({
  trigger,
  teacher,
  open,
  onOpenChange,
  onEdit,
  onSendEmail,
  onDelete,
}: ViewTeacherDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpenChange = (openState: boolean) => {
    if (onOpenChange) {
      onOpenChange(openState);
    } else {
      setIsOpen(openState);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
            Teacher Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this teacher
          </DialogDescription>
        </DialogHeader>

        {teacher && (
          <div className="space-y-6 py-4">
            {/* Teacher Profile Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={teacher.profileImage} alt={teacher.name} />
                <AvatarFallback className="text-lg">
                  {teacher.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{teacher.name}</h3>
                <p className="text-muted-foreground">{teacher.email}</p>
                <Badge
                  variant={
                    teacher.status === "accepted" ? "default" : "secondary"
                  }
                  className={
                    teacher.status === "accepted"
                      ? "bg-green-100 text-green-800 mt-1"
                      : "bg-yellow-100 text-yellow-800 mt-1"
                  }
                >
                  {teacher.status.charAt(0).toUpperCase() +
                    teacher.status.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Teacher Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p className="font-medium">{teacher.phone || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Department
                </label>
                <p className="font-medium">
                  {teacher.department || "Not assigned"}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Created Exams
                </label>
                <p className="font-medium">{teacher.createdExams}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Invited Students
                </label>
                <p className="font-medium">{teacher.invitedStudents}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Date Joined
                </label>
                <p className="font-medium">{formatDate(teacher.dateJoined)}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Created By
                </label>
                <p className="font-medium">
                  {teacher.createdBy || "Unknown"}
                </p>
              </div>
            </div>

            {/* Subjects Section */}
            {teacher.subjects && teacher.subjects.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Subjects
                </label>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.map((subject, index) => (
                    <Badge key={index} variant="outline">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            {teacher && onEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit(teacher)}
                className="flex-1 sm:flex-none"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
            {teacher && onSendEmail && (
              <Button
                variant="outline"
                onClick={() => onSendEmail(teacher)}
                className="flex-1 sm:flex-none"
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
            )}
            {teacher && onDelete && (
              <Button
                variant="destructive"
                onClick={() => onDelete(teacher)}
                className="flex-1 sm:flex-none"
              >
                <Trash className="h-4 w-4" />
                Delete
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
