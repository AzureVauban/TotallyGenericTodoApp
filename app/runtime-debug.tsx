import React, { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  PanGestureHandler,
  State,
  GestureHandlerGestureEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { colors } from "@theme/colors";
import { useTheme } from "lib/ThemeContext";
import { styles, getNavibarIconActiveColor } from "@theme/styles";
import { useSettings } from "../lib/SettingsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FiBrListCheck from "../assets/icons/svg/fi-br-list-check.svg";
import FiBrSettings from "../assets/icons/svg/fi-br-settings.svg";
import FiBrMemberList from "../assets/icons/svg/fi-br-member-list.svg";
import FiBrSquareTerminal from "../assets/icons/svg/fi-br-square-terminal.svg";
import { supabase } from "../lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

export default function RuntimeDebugScreen() {
  const router = useRouter();
  const hasNavigated = useRef(false);
  const { showNavibar } = useSettings();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showDebug, setShowDebug] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string>("/runtime-debug");
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Hydrate debug toggle from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem("showDebug");
        setShowDebug(value === "true");
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      // Get the current session
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session ?? null);

      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      setUserId(user?.id || null);
      setDisplayName(
        user?.user_metadata?.display_name ||
          user?.user_metadata?.username ||
          user?.email ||
          null
      );
      setUserEmail(user?.email || null);
    };
    fetchUserInfo();
  }, []);

  // Gesture navigation logic
  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = (
      event.nativeEvent as unknown as PanGestureHandlerEventPayload
    ).translationX;

    // Swipe right: go to home (if debug enabled)
    if (translationX > 100 && showDebug && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push("/home");
    }
    // Swipe left: go to profile (if debug enabled)
    if (translationX < -100 && showDebug && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push("/profile");
    }

    if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      setTimeout(() => {
        hasNavigated.current = false;
      }, 1500);
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.screenbackground,
            {
              backgroundColor: isDark
                ? colors.dark.background
                : colors.light.background,
            },
          ]}
        >
          <View
            style={{
              marginTop: 30,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: isDark ? colors.dark.text : colors.light.text,
              }}
            >
              Debug Screen
            </Text>
            <Text
              style={{
                marginTop: 16,
                color: isDark ? colors.dark.text : colors.light.text,
              }}
            >
              Runtime debug info goes here.
            </Text>
            <View style={{ marginTop: 18, alignItems: "center" }}>
              <Text
                style={{
                  color: isDark ? colors.dark.text : colors.light.text,
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                User ID: {userId ?? "Not signed in"}
              </Text>
              <Text
                style={{
                  color: isDark ? colors.dark.text : colors.light.text,
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                Display Name: {displayName ?? "N/A"}
              </Text>
              <Text
                style={{
                  color: isDark ? colors.dark.text : colors.light.text,
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                Email: {userEmail ?? "N/A"}
              </Text>
              <Text
                style={{
                  color: isDark ? colors.dark.text : colors.light.text,
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                Session: {session ? "Active" : "None"}
              </Text>
              {session && (
                <Text
                  style={{
                    color: isDark ? colors.dark.text : colors.light.text,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                  selectable
                >
                  Access Token: {session.access_token}
                </Text>
              )}
            </View>
          </View>
          {/* Bottom Navibar */}
          {showNavibar && (
            <View
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: 16,
                paddingVertical: 10,
                flexDirection: "row",
                backgroundColor:
                  (isDark ? colors.dark.secondary : colors.light.secondary) +
                  "80", // 50% opacity
                borderTopWidth: 0,
                justifyContent: "space-around",
                alignItems: "center",
                zIndex: 100,
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.18,
                shadowRadius: 8,
                elevation: 8,
                overflow: "hidden",
              }}
            >
              {/* Home Icon */}
              <TouchableOpacity
                onPress={() => {
                  setCurrentRoute("/home");
                  router.replace("/home");
                }}
                style={{ alignItems: "center", flex: 1 }}
              >
                <FiBrListCheck
                  width={32}
                  height={32}
                  fill={
                    currentRoute === "/home"
                      ? getNavibarIconActiveColor(isDark)
                      : isDark
                      ? colors.dark.icon
                      : colors.light.icon
                  }
                />
                <Text
                  style={{
                    color:
                      currentRoute === "/home"
                        ? getNavibarIconActiveColor(isDark)
                        : isDark
                        ? colors.dark.icon
                        : colors.light.icon,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Home
                </Text>
              </TouchableOpacity>
              {/* Settings Icon */}
              <TouchableOpacity
                onPress={() => {
                  setCurrentRoute("/settings");
                  router.replace("/settings");
                }}
                style={{ alignItems: "center", flex: 1 }}
              >
                <FiBrSettings
                  width={32}
                  height={32}
                  fill={
                    currentRoute === "/settings"
                      ? getNavibarIconActiveColor(isDark)
                      : isDark
                      ? colors.dark.icon
                      : colors.light.icon
                  }
                />
                <Text
                  style={{
                    color:
                      currentRoute === "/settings"
                        ? getNavibarIconActiveColor(isDark)
                        : isDark
                        ? colors.dark.icon
                        : colors.light.icon,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Settings
                </Text>
              </TouchableOpacity>
              {/* Profile Icon */}
              <TouchableOpacity
                onPress={() => {
                  setCurrentRoute("/profile");
                  router.replace("/profile");
                }}
                style={{ alignItems: "center", flex: 1 }}
              >
                <FiBrMemberList
                  width={32}
                  height={32}
                  fill={
                    currentRoute === "/profile"
                      ? getNavibarIconActiveColor(isDark)
                      : isDark
                      ? colors.dark.icon
                      : colors.light.icon
                  }
                />
                <Text
                  style={{
                    color:
                      currentRoute === "/profile"
                        ? getNavibarIconActiveColor(isDark)
                        : isDark
                        ? colors.dark.icon
                        : colors.light.icon,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Profile
                </Text>
              </TouchableOpacity>
              {/* Debug Icon (always shown on this screen if toggle is enabled) */}
              {showDebug && (
                <TouchableOpacity
                  onPress={() => {
                    setCurrentRoute("/runtime-debug");
                    router.replace("/runtime-debug");
                  }}
                  style={{ alignItems: "center", flex: 1 }}
                >
                  <FiBrSquareTerminal
                    width={32}
                    height={32}
                    fill={
                      currentRoute === "/runtime-debug"
                        ? getNavibarIconActiveColor(isDark)
                        : isDark
                        ? colors.dark.icon
                        : colors.light.icon
                    }
                  />
                  <Text
                    style={{
                      color:
                        currentRoute === "/runtime-debug"
                          ? getNavibarIconActiveColor(isDark)
                          : isDark
                          ? colors.dark.icon
                          : colors.light.icon,
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    Debug
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </PanGestureHandler>
  );
}
