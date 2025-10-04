"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TeacherPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first item (Students under Management)
    router.replace("/teacher/management/students");
  }, [router]);

  return null;
}