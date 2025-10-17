import { TableCell, TableRow } from "@/components/ui/table";

export default function StudentTableSkeleton() {
  // Create 5 skeleton rows to match the itemsPerPage
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          {/* Checkbox */}
          <TableCell>
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          </TableCell>
          {/* Name with Avatar */}
          <TableCell>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
          </TableCell>
          {/* Email */}
          <TableCell>
            <div className="h-4 w-40 bg-muted rounded animate-pulse" />
          </TableCell>
          {/* Status Badge */}
          <TableCell>
            <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
          </TableCell>
          {/* Department */}
          <TableCell>
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </TableCell>
          {/* Assigned Exam */}
          <TableCell>
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </TableCell>
          {/* Average Score */}
          <TableCell>
            <div className="h-4 w-12 bg-muted rounded animate-pulse" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
