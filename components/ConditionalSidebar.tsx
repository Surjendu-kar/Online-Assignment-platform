"use client";

import { usePathname } from "next/navigation";
import { AnimatedSidebar } from "@/components/AnimatedSidebar";

export default function ConditionalSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages that should not show the sidebar
  const noSidebarPages = [
    "/login",
    "/teacher_signup",
    "/student-invitation",
    "/teacher-invitation",
  ];

  // Check if current path starts with any no-sidebar path
  const shouldShowSidebar = !noSidebarPages.some((path) =>
    pathname.startsWith(path)
  );

  if (shouldShowSidebar) {
    return <AnimatedSidebar>{children}</AnimatedSidebar>;
  }

  return <>{children}</>;
}
