"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CommunicationsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first item (Invitations)
    router.replace("/admin/communications/invitations");
  }, [router]);

  return null;
}
