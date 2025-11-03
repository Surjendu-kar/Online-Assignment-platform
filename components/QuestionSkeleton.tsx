import { Skeleton } from "@/components/ui/skeleton";

export function QuestionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          {/* Question Header Skeleton */}
          <div className="flex items-start justify-between gap-3 pb-2 border-b">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {/* Q badge skeleton */}
                <Skeleton className="h-5 w-8" />
                {/* Question text skeleton */}
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>
            {/* Type badge skeleton */}
            <Skeleton className="h-5 w-12" />
          </div>

          {/* Options/Answers Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Points Skeleton */}
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
