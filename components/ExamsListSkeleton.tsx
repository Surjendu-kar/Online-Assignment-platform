"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ExamsListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-32 mb-3" />
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <div>
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}
