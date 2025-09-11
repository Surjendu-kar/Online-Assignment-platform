"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first item (Platform Stats)
    router.replace("/admin/analytics/platform-stats");
  }, [router]);

  return null;
}
