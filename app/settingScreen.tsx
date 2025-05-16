// SETTINGS.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  PanGestureHandler,
  State,
  GestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import FiBrAddressCard from "../assets/icons/svg/fi-br-address-card.svg";
import { colors } from "@theme/colors";
import { useTheme } from "@theme/ThemeContext";

const settingsStyles = StyleSheet.create({
  screenbackground: {
    flex: 1,
    backgroundColor: colors.dark.primary,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 20,
    color: colors.dark.accent,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  optionText: {
    color: colors.dark.text,
    fontSize: 16,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: 300,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  logoutButtonText: {
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.tertiary,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
  },
});

/**
 * **SettingsScreen**
 *
 * Displays the Settings page with a swipe‑gesture background‑color transition and
 * a “Log Out” button.  The component supports two key gestures:
 *
 * ### Hooks & State
 * * `bgColor` – current background colour (updated every `onGestureEvent` frame).
 * * `hasNavigated` (ref) – debounce so gesture navigation triggers only once.
 * * `useFocusEffect` – resets colour & debounce whenever the screen regains focus.
 *
 * ### Components
 * * **PanGestureHandler** from *react‑native‑gesture‑handler* wraps the entire screen.
 * * **Image** – centred app logo.
 * * **TouchableOpacity** – red “Log Out” button that routes to `/login`.
 *
 * @returns A full‑screen `View` wrapped in a `PanGestureHandler`.
 */
export function RedirectToLogin() {
  const router = useRouter();
  const isUserLoggedIn: boolean = false; // Replace with your actual login check

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isUserLoggedIn) {
        console.log("USER REDIRECTED TO LOGIN FROM SETTINGS");
        router.replace("/loginScreen");
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
          settingsStyles.screenbackground,
          {
            backgroundColor: isDark
              ? colors.dark.background
              : colors.light.background,
          },
        ]}
      >
        <Text
          style={[
            settingsStyles.title,
            { color: isDark ? colors.dark.accent : colors.light.accent },
          ]}
        >
          SETTINGS
        </Text>
        <View
          style={[
            settingsStyles.divider,
            {
              backgroundColor: isDark
                ? colors.dark.tertiary
                : colors.light.tertiary,
            },
          ]}
        />
        <View style={{ marginTop: 30 }}>
          <View style={settingsStyles.optionRow}>
            <Text
              style={[
                settingsStyles.optionText,
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
              settingsStyles.divider,
              {
                backgroundColor: isDark
                  ? colors.dark.tertiary
                  : colors.light.tertiary,
              },
            ]}
          />
          <View style={settingsStyles.optionRow}>
            <Text
              style={[
                settingsStyles.optionText,
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
            settingsStyles.divider,
            {
              backgroundColor: isDark
                ? colors.dark.tertiary
                : colors.light.tertiary,
            },
          ]}
        />
        <TouchableOpacity
          style={[
            settingsStyles.logoutButton,
            {
              backgroundColor: isDark
                ? colors.dark.redbutton_background
                : colors.light.redbutton_background,
            },
          ]}
          onPress={() => {
            console.log("USER LOGGED OUT");
            router.push("/loginScreen");
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
              settingsStyles.logoutButtonText,
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
