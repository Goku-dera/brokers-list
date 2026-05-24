// lib/useAuthGuard.ts

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

/**
 * Protects a page behind login. Returns false until mounted so SSR and
 * the first client render match (avoids hydration mismatch).
 */
export function useAuthGuard() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    setAllowed(true);
  }, [router]);

  return allowed;
}
