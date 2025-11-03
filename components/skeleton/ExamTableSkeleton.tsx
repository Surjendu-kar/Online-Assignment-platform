import { TableCell, TableRow } from "@/components/ui/table";

export default function ExamTableSkeleton() {
  // Create 5 skeleton rows to match the itemsPerPage
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          {/* Checkbox column */}
          <TableCell>
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          </TableCell>
          {/* Name column with icon */}
          <TableCell className="border-r">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            </div>
          </TableCell>
          {/* Department column */}
          <TableCell className="border-r">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          </TableCell>
          {/* Duration column */}
          <TableCell className="border-r">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 bg-muted rounded animate-pulse" />
              <div className="h-4 w-12 bg-muted rounded animate-pulse" />
            </div>
          </TableCell>
          {/* Schedule column */}
          <TableCell className="border-r">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 bg-muted rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 bg-muted rounded animate-pulse" />
                <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </TableCell>
          {/* Status column */}
          <TableCell className="border-r">
            <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
          </TableCell>
          {/* Assigned Students column */}
          <TableCell>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 bg-muted rounded animate-pulse" />
              <div className="h-4 w-8 bg-muted rounded animate-pulse" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
