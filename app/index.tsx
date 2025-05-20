<<<<<<< HEAD
=======
import { useRouter } from "expo-router";
import { useEffect } from "react";
>>>>>>> bcef344 (Squashed commit of the following:)
/**
 * Entry point redirect for the app.
 * Determines whether the user is logged in and navigates to the appropriate screen.
 * Temporarily renders nothing while deciding the redirect path.
 */
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function IndexRedirect() {
  const router = useRouter();
  const isUserLoggedIn: boolean = false; // Replace with your actual login check

  useEffect(() => {
    // Defer navigation to the next tick to ensure layout is mounted
    const timeout = setTimeout(() => {
      if (!isUserLoggedIn) {
<<<<<<< HEAD
        router.replace("/welcome");
=======
        router.replace("/greetScreen");
>>>>>>> bcef344 (Squashed commit of the following:)
      } else {
        router.replace("/home");
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [isUserLoggedIn, router]);

  return null; // Render nothing while redirecting
}
