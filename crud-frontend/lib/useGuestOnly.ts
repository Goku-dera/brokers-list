// lib/useGuestOnly.ts — redirect logged-in users away from login/register

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export function useGuestOnly(redirectTo = "/dashboard") {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace(redirectTo);
      return;
    }
    setReady(true);
  }, [router, redirectTo]);

  return ready;
}
