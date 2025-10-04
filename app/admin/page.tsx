"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first item (Teachers under Management)
    router.replace("/admin/management/teachers");
  }, [router]);

  return null;
}