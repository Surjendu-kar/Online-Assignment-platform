"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManagementPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first item (Teachers)
    router.replace("/admin/management/teachers");
  }, [router]);

  return null;
}
