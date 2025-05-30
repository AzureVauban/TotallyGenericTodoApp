import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import { colors } from "@theme/colors";
import { getNavibarIconActiveColor, styles } from "@theme/styles";
import { useRouter } from "expo-router";
import { useTheme } from "lib/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  GestureHandlerGestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from "react-native-gesture-handler";
import FiBrCalendar from "../assets/icons/svg/fi-br-calendar.svg";
import FiBrListCheck from "../assets/icons/svg/fi-br-list-check.svg";
import FiBrMemberList from "../assets/icons/svg/fi-br-member-list.svg";
import FiBrSettings from "../assets/icons/svg/fi-br-settings.svg";
import FiBrSquareTerminal from "../assets/icons/svg/fi-br-square-terminal.svg";
import { useSettings } from "../lib/SettingsContext";
import { supabase } from "../lib/supabaseClient";
import { playCompleteSound } from "../utils/sounds/completed";
import { playRemoveSound } from "../utils/sounds/trash";
import { playFlaggedSound } from "../utils/sounds/flag";
import { playUnflaggedSound } from "../utils/sounds/unflag";
import { playIndentTasksound } from "../utils/sounds/indent";
import { playRenameTaskSound } from "../utils/sounds/remove";
import { playInvalidSound } from "../utils/sounds/invalid";

export default function RuntimeDebugScreen() {
  const router = useRouter();
  const hasNavigated = useRef(false);
  const { showNavibar, navibarTransparent, soundEnabled } = useSettings();
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
          {/* Sound Effect Test Buttons */}
          <View
            style={{ marginTop: 32, alignItems: "center", marginBottom: 24 }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: isDark ? colors.dark.text : colors.light.text,
                marginBottom: 8,
              }}
            >
              Sound Effect Test Buttons
            </Text>
            <View style={{ maxHeight: 400, width: "100%" }}>
              <ScrollView
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingBottom: 16,
                }}
                style={{ width: "100%" }}
              >
                {[
                  { label: "Complete", fn: playCompleteSound },
                  { label: "Remove", fn: playRemoveSound },
                  { label: "Flag", fn: playFlaggedSound },
                  { label: "Unflag", fn: playUnflaggedSound },
                  { label: "Indent", fn: playIndentTasksound },
                  { label: "Rename", fn: playRenameTaskSound },
                  { label: "Invalid", fn: playInvalidSound },
                ].map(({ label, fn }) => (
                  <TouchableOpacity
                    key={label}
                    onPress={fn}
                    disabled={!soundEnabled}
                    style={[
                      styles.addTaskListButton,
                      {
                        width: 300,
                        marginVertical: 6,
                        backgroundColor: soundEnabled
                          ? isDark
                            ? colors.dark.bluebutton_background
                            : colors.light.bluebutton_background
                          : isDark
                          ? colors.dark.tertiary
                          : colors.light.tertiary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.addTaskListButtonText,
                        {
                          color: soundEnabled
                            ? isDark
                              ? colors.dark.bluebutton_text_icon
                              : colors.light.bluebutton_text_icon
                            : isDark
                            ? colors.dark.tertiary
                            : colors.light.tertiary,
                          fontWeight: "bold",
                          fontSize: 15,
                        },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
                backgroundColor: navibarTransparent
                  ? isDark
                    ? colors.dark.background
                    : colors.light.background
                  : (isDark ? colors.dark.secondary : colors.light.secondary) +
                    "80",
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
              {/* Calendar Icon */}
              <TouchableOpacity
                onPress={() => {
                  setCurrentRoute("/task-calendar");
                  router.replace("/task-calendar");
                }}
                style={{ alignItems: "center", flex: 1 }}
              >
                <FiBrCalendar
                  width={32}
                  height={32}
                  fill={
                    currentRoute === "/task-calendar"
                      ? getNavibarIconActiveColor(isDark)
                      : isDark
                      ? colors.dark.icon
                      : colors.light.icon
                  }
                />
                <Text
                  style={{
                    color:
                      currentRoute === "/task-calendar"
                        ? getNavibarIconActiveColor(isDark)
                        : isDark
                        ? colors.dark.icon
                        : colors.light.icon,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Calendar
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
