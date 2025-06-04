import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import { colors } from "@theme/colors";
import { styles } from "@theme/styles";
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
import { useSettings } from "../lib/SettingsContext";
import { supabase } from "../lib/supabaseClient";
import { playCompleteSound } from "../utils/sounds/completed";
import { playRemoveSound } from "../utils/sounds/trash";
import { playFlaggedSound } from "../utils/sounds/flag";
import { playUnflaggedSound } from "../utils/sounds/unflag";
import { playIndentTasksound } from "../utils/sounds/indent";
import { playRenameTaskSound } from "../utils/sounds/remove";
import { playInvalidSound } from "../utils/sounds/invalid";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navibar } from "./components/Navibar";
import { useAuth } from "./authentication/auth";

export default function RuntimeDebugScreen() {
  console.log("RuntimeDebugScreen rendered");
  const router = useRouter();
  const hasNavigated = useRef(false);
  const { showNavibar, navibarTransparent, soundEnabled } = useSettings();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showDebug, setShowDebug] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string>("/runtime-debug");
  // Use Auth context for user/session
  const { user, session } = useAuth();

  // Hydrate debug toggle from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem("showDebug");
        setShowDebug(value === "true");
      } catch {}
    })();
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark
          ? colors.dark.background
          : colors.light.background,
      }}
    >
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
                  User ID: {user?.id ?? "Not signed in"}
                </Text>
                <Text
                  style={{
                    color: isDark ? colors.dark.text : colors.light.text,
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                >
                  Display Name:{" "}
                  {user?.user_metadata?.display_name ||
                    user?.user_metadata?.username ||
                    user?.email ||
                    "N/A"}
                </Text>
                <Text
                  style={{
                    color: isDark ? colors.dark.text : colors.light.text,
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                >
                  Email: {user?.email ?? "N/A"}
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
              <Navibar
                currentRoute={currentRoute}
                setCurrentRoute={setCurrentRoute}
                router={router}
                isDark={isDark}
                showDebug={showDebug}
                showNavibar={showNavibar}
                navibarTransparent={navibarTransparent}
              />
            )}
          </View>
        </View>
      </PanGestureHandler>
    </SafeAreaView>
  );
}
