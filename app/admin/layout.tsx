"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AnimatedSidebar } from "@/components/AnimatedSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="admin">
      <AnimatedSidebar>{children}</AnimatedSidebar>
    </ProtectedRoute>
  );
}