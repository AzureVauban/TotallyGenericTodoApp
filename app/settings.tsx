/*
TODO FUTURE ADDITIONS
- display avatar of logged in user
- show UID (via a toggle)
- display user's display-name (via a toggle)

*/

/**
 * SettingsScreen provides user controls for theme and sound preferences.
 * Includes gesture navigation (right swipe to return to home).
 * Features logout, theme toggle, and sound enable switches.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "@theme/colors";
import { styles } from "@theme/styles";
import { useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "lib/ThemeContext";
import React, { useRef, useState } from "react";
import { Switch, Text, View } from "react-native";
import {
  GestureHandlerGestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from "react-native-gesture-handler";
import { useSettings } from "../lib/SettingsContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navibar } from "./components/Navibar";

export function RedirectToLogin() {
  console.log("RedirectToLogin component rendered");
  const router = useRouter();
  const isUserLoggedIn: boolean = false;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isUserLoggedIn) {
        console.log("USER REDIRECTED TO LOGIN FROM SETTINGS");
        router.replace("/welcome");
      } else {
        router.replace("/home");
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [isUserLoggedIn, router]);
}

export default function SettingsScreen() {
  console.log("SettingsScreen rendered");
  const router = useRouter();
  const hasNavigated = useRef(false);
  const [bgColor, setBgColor] = useState("#eef2ff");

  const {
    showNavibar,
    setShowNavibar,
    navibarTransparent,
    setNavibarTransparent,
    soundEnabled,
    setSoundEnabled,
  } = useSettings();
  // Add debug toggle state
  const [showDebug, setShowDebug] = useState(false);

  // Hydrate debug toggle from AsyncStorage on mount
  React.useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem("showDebug");
        if (value !== null) setShowDebug(value === "true");
      } catch {}
    })();
  }, []);

  // Persist debug toggle to AsyncStorage
  const handleDebugToggle = (value: boolean) => {
    setShowDebug(value);
    AsyncStorage.setItem("showDebug", value ? "true" : "false");
  };

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useFocusEffect(
    React.useCallback(() => {
      setBgColor(isDark ? colors.dark.background : colors.light.background);
      hasNavigated.current = false;
    }, [theme])
  );

  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = (
      event.nativeEvent as unknown as PanGestureHandlerEventPayload
    ).translationX;

    // Swipe right: go to profile
    if (translationX > 100 && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push("/profile");
    }
    // Swipe left: go to home
    if (translationX < -100 && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push("/task-calendar");
    }
    // No debug navigation from settings

    if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      setTimeout(() => {
        hasNavigated.current = false;
        setBgColor(isDark ? colors.dark.background : colors.light.background);
      }, 1500);
    }
  };

  // Add currentRoute and setCurrentRoute state for navibar highlighting
  const [currentRoute, setCurrentRoute] = useState("/settings");

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: isDark
            ? colors.dark.background
            : colors.light.background,
        }}
      >
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
            <View style={{ marginTop: 30 }}>
              <View style={styles.optionRow}>
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? colors.dark.text : colors.light.text },
                  ]}
                >
                  Enable Sound Effects
                </Text>
                <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
              </View>
              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: isDark
                      ? colors.dark.tertiary
                      : colors.light.tertiary,
                  },
                ]}
              />
              <View style={styles.optionRow}>
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? colors.dark.text : colors.light.text },
                  ]}
                >
                  Show Bottom Navigation Bar
                </Text>
                <Switch
                  value={showNavibar}
                  onValueChange={(value) => {
                    setShowNavibar(value);
                  }}
                />
              </View>
              {showNavibar && (
                <>
                  <View
                    style={[
                      styles.divider,
                      {
                        backgroundColor: isDark
                          ? colors.dark.tertiary
                          : colors.light.tertiary,
                      },
                    ]}
                  />
                  <View style={styles.optionRow}>
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: isDark ? colors.dark.text : colors.light.text,
                        },
                      ]}
                    >
                      Transparent Navibar Background
                    </Text>
                    <Switch
                      value={navibarTransparent}
                      onValueChange={setNavibarTransparent}
                    />
                  </View>
                </>
              )}
              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: isDark
                      ? colors.dark.tertiary
                      : colors.light.tertiary,
                  },
                ]}
              />
              <View style={styles.optionRow}>
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? colors.dark.text : colors.light.text },
                  ]}
                >
                  Light/Dark Theme
                </Text>
                <Switch
                  value={isDark}
                  onValueChange={() => {
                    console.log("Theme toggled, now dark:", !isDark);
                    toggleTheme();
                  }}
                />
              </View>
              <View
                style={[
                  styles.divider,
                  {
                    backgroundColor: isDark
                      ? colors.dark.tertiary
                      : colors.light.tertiary,
                  },
                ]}
              />
              <View style={styles.optionRow}>
                <Text
                  style={[
                    styles.optionText,
                    { color: isDark ? colors.dark.text : colors.light.text },
                  ]}
                >
                  Show Debug Screen
                </Text>
                <Switch value={showDebug} onValueChange={handleDebugToggle} />
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
      </SafeAreaView>
    </PanGestureHandler>
  );
}
