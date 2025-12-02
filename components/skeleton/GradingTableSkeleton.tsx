import { TableCell, TableRow } from "@/components/ui/table";

export default function GradingTableSkeleton() {
  // Create 5 skeleton rows to match the itemsPerPage
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          {/* Checkbox column */}
          <TableCell>
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          </TableCell>
          {/* Student Name column */}
          <TableCell className="border-r">
            <div className="space-y-1">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-40 bg-muted rounded animate-pulse" />
            </div>
          </TableCell>
          {/* Exam Title column */}
          <TableCell className="border-r">
            <div className="h-4 w-40 bg-muted rounded animate-pulse" />
          </TableCell>
          {/* Department column */}
          <TableCell className="border-r">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </TableCell>
          {/* Submitted At column */}
          <TableCell className="border-r">
            <div className="h-4 w-36 bg-muted rounded animate-pulse" />
          </TableCell>
          {/* Questions column */}
          <TableCell className="text-center border-r">
            <div className="flex flex-col items-center space-y-1">
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            </div>
          </TableCell>
          {/* Pending column */}
          <TableCell className="text-center border-r">
            <div className="h-4 w-8 bg-muted rounded animate-pulse mx-auto" />
          </TableCell>
          {/* Status column */}
          <TableCell className="text-center border-r">
            <div className="h-6 w-20 bg-muted rounded-full animate-pulse mx-auto" />
          </TableCell>
          {/* Action column */}
          <TableCell className="text-center">
            <div className="h-8 w-16 bg-muted rounded animate-pulse mx-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
