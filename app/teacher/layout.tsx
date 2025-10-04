"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AnimatedSidebar } from "@/components/AnimatedSidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="teacher">
      <AnimatedSidebar>{children}</AnimatedSidebar>
    </ProtectedRoute>
  );
}