"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first item (System Config)
    router.replace("/admin/settings/system-config");
  }, [router]);

  return null;
}
