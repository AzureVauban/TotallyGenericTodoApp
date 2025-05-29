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
import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  PanGestureHandler,
  State,
  GestureHandlerGestureEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
//! import FiBrAddressCard from "../assets/icons/svg/fi-br-address-card.svg";
import FiBrListCheck from "../assets/icons/svg/fi-br-list-check.svg";
import FiBrSettings from "../assets/icons/svg/fi-br-settings.svg";
import FiBrMemberList from "../assets/icons/svg/fi-br-member-list.svg";
import FiBrCalendar from "../assets/icons/svg/fi-br-calendar.svg";
import { colors } from "@theme/colors";
import { useTheme } from "lib/ThemeContext";
import { styles, getNavibarIconActiveColor } from "@theme/styles";
//! import { supabase } from "../lib/supabaseClient";
import { useSettings } from "../lib/SettingsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FiBrSquareTerminal from "../assets/icons/svg/fi-br-square-terminal.svg";

export function RedirectToLogin() {
  const router = useRouter();
  const isUserLoggedIn: boolean = false; //! Replace with your actual login check

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
  const router = useRouter();
  const hasNavigated = useRef(false);
  const [bgColor, setBgColor] = useState("#eef2ff");

  const [soundEnabled, setSoundEnabled] = useState(true);
  const {
    showNavibar,
    setShowNavibar,
    navibarTransparent,
    setNavibarTransparent,
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
      router.push("/calendar");
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
              <Switch
                value={soundEnabled}
                onValueChange={(value) => {
                  console.log("Sound Effects toggled:", value);
                  setSoundEnabled(value);
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
                      { color: isDark ? colors.dark.text : colors.light.text },
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
                onPress={() => router.replace("/home")}
                style={{ alignItems: "center", flex: 1 }}
              >
                <FiBrListCheck
                  width={32}
                  height={32}
                  fill={isDark ? colors.dark.icon : colors.light.icon}
                />
                <Text
                  style={{
                    color: isDark ? colors.dark.icon : colors.light.icon,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Home
                </Text>
              </TouchableOpacity>
              {/* Calendar Icon */}
              <TouchableOpacity
                onPress={() => router.replace("/calendar")}
                style={{ alignItems: "center", flex: 1 }}
              >
                <FiBrCalendar
                  width={32}
                  height={32}
                  fill={isDark ? colors.dark.icon : colors.light.icon}
                />
                <Text
                  style={{
                    color: isDark ? colors.dark.icon : colors.light.icon,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Calendar
                </Text>
              </TouchableOpacity>
              {/* Settings Icon */}
              <TouchableOpacity
                onPress={() => router.replace("/settings")}
                style={{ alignItems: "center", flex: 1 }}
              >
                <FiBrSettings
                  width={32}
                  height={32}
                  fill={getNavibarIconActiveColor(isDark)}
                />
                <Text
                  style={{
                    color: getNavibarIconActiveColor(isDark),
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Settings
                </Text>
              </TouchableOpacity>
              {/* Profile Icon */}
              <TouchableOpacity
                onPress={() => router.replace("/profile")}
                style={{ alignItems: "center", flex: 1 }}
              >
                <FiBrMemberList
                  width={32}
                  height={32}
                  fill={isDark ? colors.dark.icon : colors.light.icon}
                />
                <Text
                  style={{
                    color: isDark ? colors.dark.icon : colors.light.icon,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Profile
                </Text>
              </TouchableOpacity>
              {/* Debug Icon (conditionally rendered) */}
              {showDebug && (
                <TouchableOpacity
                  onPress={() => router.replace("/runtime-debug")}
                  style={{ alignItems: "center", flex: 1 }}
                >
                  <FiBrSquareTerminal
                    width={32}
                    height={32}
                    fill={isDark ? colors.dark.icon : colors.light.icon}
                  />
                  <Text
                    style={{
                      color: isDark ? colors.dark.icon : colors.light.icon,
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
