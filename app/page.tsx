"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin dashboard
    router.replace("/admin");
  }, [router]);

  return null;
}

export default Page;
