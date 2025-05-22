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
import FiBrAddressCard from "../assets/icons/svg/fi-br-address-card.svg";
import FiBrListCheck from "../assets/icons/svg/fi-br-list-check.svg";
import FiBrSettings from "../assets/icons/svg/fi-br-settings.svg";
import FiBrMemberList from "../assets/icons/svg/fi-br-member-list.svg";
import { colors } from "@theme/colors";
import { useTheme } from "lib/ThemeContext";
import { styles, getNavibarIconActiveColor } from "@theme/styles";
import { supabase } from "../lib/supabaseClient";
import { useSettings } from "../lib/SettingsContext";

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
  const { showNavibar, setShowNavibar } = useSettings();

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
      router.push("/home");
    }

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
                onValueChange={(value) => {
                  console.log("Theme toggled, now dark:", value);
                  toggleTheme();
                }}
              />
            </View>
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
          {/* Remove the logout button from settings screen */}
          {/* 
          <View
            style={{
              marginTop: 24,
              marginBottom: showNavibar ? 80 : 24,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={[
                styles.logoutButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.redbutton_background
                    : colors.light.redbutton_background,
                },
              ]}
              onPress={async () => {
                console.log("USER LOGGED OUT");
                await supabase.auth.signOut();
                router.push("/welcome");
              }}
            >
              <FiBrAddressCard
                width={20}
                height={20}
                fill={
                  isDark
                    ? colors.dark.redbutton_text_icon
                    : colors.light.redbutton_text_icon
                }
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.logoutButtonText,
                  {
                    color: isDark
                      ? colors.dark.redbutton_text_icon
                      : colors.light.redbutton_text_icon,
                  },
                ]}
              >
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
          */}
          {/* Bottom Navibar */}
          {showNavibar && (
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 64,
                flexDirection: "row",
                backgroundColor: isDark
                  ? colors.dark.secondary
                  : colors.light.secondary,
                borderTopWidth: 1,
                borderTopColor: isDark
                  ? colors.dark.tertiary
                  : colors.light.tertiary,
                justifyContent: "space-around",
                alignItems: "center",
                zIndex: 100,
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
                    marginTop: 2,
                  }}
                >
                  Home
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
                    marginTop: 2,
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
                    marginTop: 2,
                  }}
                >
                  Profile
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </PanGestureHandler>
  );
}
