// SETTINGS.tsx
import React, { useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  PanGestureHandler,
  State,
  GestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import FiBrAddressCard from "../assets/icons/svg/fi-br-address-card.svg";

// Theme colors from home.tsx
const COLORS = {
  dark_primary: "#101010",
  dark_secondary: "#1A1A1A",
  dark_tertiary: "#373737",
  dark_accents: "#F26C4F",
  dark_subaccents: "#C5C5C5",
};

const settingsStyles = StyleSheet.create({
  screenbackground: {
    flex: 1,
    backgroundColor: COLORS.dark_primary,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 20,
    color: COLORS.dark_accents,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  optionText: {
    color: COLORS.dark_subaccents,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#b91c1c",
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
    color: "#fee2e2",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#444",
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
        router.replace("/login");
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
  const [themeEnabled, setThemeEnabled] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setBgColor("#eef2ff");
      hasNavigated.current = false;
    }, [])
  );

  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = (
      event.nativeEvent as unknown as { translationX: number }
    ).translationX;

    //?    if (translationX < 0) {
    //?      // Left swipe: interpolate from white to orange
    //?      if (translationX > -150) {
    //?        const percent = Math.min(Math.abs(translationX) / 150, 1);
    //?        const r = 255;
    //?        const g = Math.floor(255 - 90 * percent);
    //?        const b = Math.floor(255 - 255 * percent);
    //?        setBgColor(`rgb(${r},${g},${b})`);
    //?      } else {
    //?        setBgColor("rgb(255,165,0)");
    //?      }
    //?      /* if (translationX < -100 && !hasNavigated.current) {
    //?        hasNavigated.current = true;
    //?        console.log("USER: SETTINGS <= LEADERBOARD");
    //?        router.push("/leaderboard");
    //?      } */
    //?    }
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
      setBgColor("#eef2ff");
    }

    if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      setTimeout(() => {
        hasNavigated.current = false;
        setBgColor("#eef2ff");
      }, 1500);
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View style={settingsStyles.screenbackground}>
        <Text style={settingsStyles.title}>SETTINGS</Text>
        <View style={settingsStyles.divider} />
        <View style={{ marginTop: 30 }}>
          <View style={settingsStyles.optionRow}>
            <Text style={settingsStyles.optionText}>Enable Sound Effects</Text>
            <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
          </View>
          <View style={settingsStyles.divider} />
          <View style={settingsStyles.optionRow}>
            <Text style={settingsStyles.optionText}>Light/Dark Theme</Text>
            <Switch value={themeEnabled} onValueChange={setThemeEnabled} />
          </View>
        </View>
        <View style={settingsStyles.divider} />
        <TouchableOpacity
          style={settingsStyles.logoutButton}
          onPress={() => {
            console.log("USER LOGGED OUT");
            router.push("/login");
          }}
        >
          <FiBrAddressCard
            width={20}
            height={20}
            fill={settingsStyles.logoutButtonText.color}
            style={{ marginRight: 8 }}
          />
          <Text style={settingsStyles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </PanGestureHandler>
  );
}
