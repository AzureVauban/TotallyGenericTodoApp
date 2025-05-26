import "react-native-url-polyfill/auto";
import React, { createContext, useContext, useState, useEffect } from "react";
import { ActivityIndicator, View, Linking } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export default function Auth({ children }: { children: React.ReactNode }) {
  console.log(`Current file name: Auth()`);
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial session
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      })
      .catch((error) => console.error("Error fetching session:", error))
      .finally(() => setLoading(false));

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (event === "SIGNED_IN") {
        router.replace("/home");
      }
      // Remove automatic redirect on SIGNED_OUT to keep user signed in unless they explicitly log out
      // Only redirect to /welcome on explicit logout (handled in settings)
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Listen for deep link events
    const handleDeepLink = async (event: { url: string }) => {
      // Wait for session to be available
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        // Fetch username from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("email", session.user.email)
          .maybeSingle();

        // If no profile, insert one using display_name from user_metadata
        if (!profile) {
          const displayName =
            session.user.user_metadata?.display_name ||
            session.user.user_metadata?.username ||
            session.user.email;
          await supabase.from("profiles").insert([
            {
              email: session.user.email,
              display_name: displayName,
              username: displayName,
            },
          ]);
          console.log(`Created profile for ${displayName}`);
        } else if (!profile.display_name) {
          // If profile exists but missing display_name, update it
          const displayName =
            session.user.user_metadata?.display_name ||
            session.user.user_metadata?.username ||
            session.user.email;
          await supabase
            .from("profiles")
            .update({ display_name: displayName, username: displayName })
            .eq("email", session.user.email);
          console.log(`Updated profile for ${displayName}`);
        } else {
          console.log(`Welcome back ${profile.display_name}`);
        }
      }
    };

    // Subscribe to deep link events
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Also check if app was opened from a deep link initially
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, session }}>
      {children}
    </AuthContext.Provider>
  );
}
