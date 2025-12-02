import { Card, CardContent } from "@/components/ui/card";

export default function ViewResultSkeleton() {
  return (
    <>
      {/* Score, Percentage, Department Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        <div className="flex items-center gap-4 pt-2">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          <div className="h-4 w-28 bg-muted rounded animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden mr-5">
        {/* Question Navigator Sidebar Skeleton */}
        <div className="w-48 bg-muted/30 rounded-lg p-4">
          <div className="h-4 w-20 bg-muted rounded animate-pulse mb-3" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-8 w-full bg-muted rounded animate-pulse"
              />
            ))}
          </div>
          {/* Legend Skeleton */}
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="h-3 w-12 bg-muted rounded animate-pulse" />
            <div className="space-y-1">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Question Display Area Skeleton */}
        <div className="flex flex-col overflow-hidden min-h-0 w-full">
          <div className="overflow-y-auto overflow-x-hidden h-[380px]">
            <Card className="gap-2">
              <CardContent className="space-y-4 h-78"></CardContent>
            </Card>
          </div>

          {/* Navigation Buttons Skeleton */}
          <div className="flex items-center justify-between pt-4">
            <div className="h-10 w-28 bg-muted rounded animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </>
  );
}
