import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function ExamDialogSkeleton() {
  return (
    <div className="grid gap-4 py-4">
      {/* First row: Exam Name, Duration, and Status */}
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label htmlFor="exam-name">Exam Name *</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Duration */}
          <div className="grid gap-2">
            <Label htmlFor="duration">Duration (minutes) *</Label>
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Status */}
          <div className="grid gap-2">
            <Label htmlFor="status">Status *</Label>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Second row: Start Date and End Date */}
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label htmlFor="start-date">Start Date *</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="end-date">End Date *</Label>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Footer with disabled Next button */}
      <div className="flex justify-end pt-4">
        <Button disabled>
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
