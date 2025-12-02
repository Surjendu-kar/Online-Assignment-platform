import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function GradingDialogSkeleton() {
  return (
    <>
      {/* Details Section Skeleton */}
      <div className="bg-muted/30 rounded-lg overflow-hidden mr-4">
        {/* Info Bar Skeleton */}
        <div className="flex items-center justify-between gap-4 p-3">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Student Name Skeleton */}
            <div className="min-w-0 space-y-1">
              <div className="h-3 w-12 bg-muted rounded animate-pulse" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            </div>
            <Separator orientation="vertical" className="h-8" />
            {/* Exam Title Skeleton */}
            <div className="min-w-0 space-y-1">
              <div className="h-3 w-10 bg-muted rounded animate-pulse" />
              <div className="h-4 w-40 bg-muted rounded animate-pulse" />
            </div>
            <Separator orientation="vertical" className="h-8" />
            {/* Score Skeleton */}
            <div className="space-y-1">
              <div className="h-3 w-10 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div>
            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden mr-4">
        {/* Question Navigator Sidebar Skeleton */}
        <div className="w-48 bg-muted/30 rounded-lg p-4"></div>

        {/* Question Display Area Skeleton */}
        <div className="flex flex-col overflow-hidden min-h-0 w-full">
          <div className="overflow-y-auto overflow-x-hidden h-[380px]">
            <Card className="gap-2">
              <CardContent className="space-y-4 h-78"></CardContent>
            </Card>
          </div>

          {/* Navigation and Save Buttons Skeleton */}
          <div className="flex items-center justify-between pt-4">
            <div className="h-10 w-28 bg-muted rounded animate-pulse" />
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </>
  );
}
