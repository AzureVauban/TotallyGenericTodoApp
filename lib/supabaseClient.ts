import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";

const isNgrok = (): boolean => {
  return (
    process.env.EXPO_PUBLIC_SITE_URL?.includes("ngrok.io") ||
    process.env.EXPO_PUBLIC_SUPABASE_URL?.includes("ngrok.io")
  );
};

const SUPABASE_URL = isNgrok()
  ? process.env.EXPO_PUBLIC_SITE_URL
  : process.env.EXPO_PUBLIC_SUPABASE_URL;

if (!SUPABASE_URL) {
  throw new Error("Supabase URL is not defined in environment variables.");
}

export const supabase = createClient(
  SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: { enabled: false } as any,
    global: { fetch: fetch.bind(globalThis) },
  }
);

let appStateListener: any;

if (!appStateListener) {
  appStateListener = AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
