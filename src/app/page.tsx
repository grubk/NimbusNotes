"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToWelcome() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/welcome");
  }, [router]);

  return null;
}
