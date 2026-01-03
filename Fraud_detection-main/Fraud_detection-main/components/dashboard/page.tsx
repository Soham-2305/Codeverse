"use client";

import { useEffect } from "react";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
    }
  }, []);

  return <h2>Protected Dashboard</h2>;
}
