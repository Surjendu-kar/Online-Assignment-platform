"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AnimatedSidebar } from "@/components/AnimatedSidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="student">
      <AnimatedSidebar>{children}</AnimatedSidebar>
    </ProtectedRoute>
  );
}