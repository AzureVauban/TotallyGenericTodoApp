import React, { useEffect } from "react";
import { useRouter } from "expo-router";

export default function IndexRedirect() {
  const router = useRouter();
  const isUserLoggedIn: boolean = false; // Replace with your actual login check

  useEffect(() => {
    // Defer navigation to the next tick to ensure layout is mounted
    const timeout = setTimeout(() => {
      if (!isUserLoggedIn) {
        router.replace("/login");
      } else {
        router.replace("/home");
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [isUserLoggedIn, router]);

  return null; // Render nothing while redirecting
}
