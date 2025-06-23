"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function redirectToHome() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return null;
}