import { TableCell, TableRow } from "@/components/ui/table";

export default function TeacherTableSkeleton() {
  // Create 5 skeleton rows to match the itemsPerPage
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
          </TableCell>
          <TableCell>
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-8 bg-muted rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-8 bg-muted rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}