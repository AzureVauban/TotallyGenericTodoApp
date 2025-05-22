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
} from "react-native-gesture-handler";
import FiBrAddressCard from "../assets/icons/svg/fi-br-address-card.svg";
import { colors } from "@theme/colors";
import { useTheme } from "@theme/ThemeContext";
import { styles } from "@theme/styles";

export function RedirectToLogin() {
  const router = useRouter();
  const isUserLoggedIn: boolean = false; // Replace with your actual login check

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
      event.nativeEvent as unknown as { translationX: number }
    ).translationX;

    if (translationX > 0) {
      // Right swipe: interpolate from white to blue
      if (translationX < 150) {
      }
      if (translationX > 100 && !hasNavigated.current) {
        hasNavigated.current = true;
        console.log("USER: SETTINGS => HOME");
        router.push("/home");
      }
    } else {
      setBgColor(isDark ? colors.dark.background : colors.light.background);
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
        <Text
          style={[
            styles.title,
            { color: isDark ? colors.dark.accent : colors.light.accent },
          ]}
        >
          SETTINGS
        </Text>
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
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: isDark
                ? colors.dark.redbutton_background
                : colors.light.redbutton_background,
            },
          ]}
          onPress={() => {
            console.log("USER LOGGED OUT");
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
    </PanGestureHandler>
  );
}
