import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import type { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { supabase } from "../../lib/supabaseClient";

type AuthContextType = {
  user: User | null;
  session: Session | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
});

export function useAuth(): AuthContextType {
  console.log("Auth component rendered (AuthContextType() function called)");

  if (!AuthContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  console.log("Auth component rendered (AuthContextType() function called)");

  if (!AuthContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return useContext(AuthContext);
}

export default function Auth({ children }: { children: React.ReactNode }) {
  console.log("Auth component rendered");

  console.log("Auth component rendered");

  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        setUser(initialSession?.user ?? null);
        setSession(initialSession);
        console.log("[Auth] Initial session:", initialSession);
      })
      .catch((error) => console.error("Error fetching session:", error))
      .finally(() => setLoading(false));

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      console.log("[Auth] Auth state changed:", event, newSession);
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
      console.log("[Auth] Deep link event:", event.url);

      // Parse tokens from the URL fragment (after #)
      const fragment = event.url.split("#")[1];
      if (fragment) {
        const params = new URLSearchParams(fragment);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        if (access_token && refresh_token) {
          // Set the session in Supabase
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (error) {
            console.error(
              "[Auth] Error setting session from magic link:",
              error
            );
          } else {
            console.log("[Auth] Session set from magic link:", data.session);
            setSession(data.session);
            setUser(data.session?.user ?? null);
          }
        }
      }

      // Fallback: fetch session as usual
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("[Auth] Session after deep link:", session);
      setSession(session);
      setUser(session?.user ?? null);
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Optionally check initial URL on mount
    Linking.getInitialURL().then(async (url) => {
      if (url) {
        await handleDeepLink({ url });
      }
    });

    return () => subscription.remove();
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
