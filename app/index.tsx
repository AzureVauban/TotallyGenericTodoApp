import React, { useEffect } from "react";
import { useRouter } from "expo-router";
/**
 * **IndexRedirect Component**
 *
 * Serves as the root route (`/`) entry point for the app. The component renders
 * nothing and immediately decides—on the first React effect tick—whether the
 * user should be sent to login or home
 *
 * ### Logic
 * 1. Reads `isUserLoggedIn` (boolean placeholder). Replace this with your real
 *    authentication check.
 * 2. Inside a `useEffect`, sets a zero‑delay `setTimeout` so navigation occurs
 *    after the layout phase, avoiding *“Cannot update a component while rendering”*
 *    warnings.
 * 3. Calls `router.replace()` to swap the current history entry, ensuring the
 *    splash route is not left in the back stack.
 *
 * @returns `null` — the component does not render any UI.
 */

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
