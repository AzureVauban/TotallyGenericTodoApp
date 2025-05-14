// SETTINGS.tsx
import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  PanGestureHandler,
  State,
  GestureHandlerGestureEvent,
} from "react-native-gesture-handler";

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

    if (translationX < 0) {
      // Left swipe: interpolate from white to orange
      if (translationX > -150) {
        const percent = Math.min(Math.abs(translationX) / 150, 1);
        const r = 255;
        const g = Math.floor(255 - 90 * percent);
        const b = Math.floor(255 - 255 * percent);
        setBgColor(`rgb(${r},${g},${b})`);
      } else {
        setBgColor("rgb(255,165,0)");
      }
      /* if (translationX < -100 && !hasNavigated.current) {
        hasNavigated.current = true;
        console.log("USER: SETTINGS <= LEADERBOARD");
        router.push("/leaderboard");
      } */
    } else if (translationX > 0) {
      // Right swipe: interpolate from white to blue
      if (translationX < 150) {
        const percent = Math.min(translationX / 150, 1);
        const r = Math.floor(255 - 255 * percent);
        const g = Math.floor(255 - 255 * percent);
        const b = 255;
        setBgColor(`rgb(${r},${g},${b})`);
      } else {
        setBgColor("blue");
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: bgColor,
        }}
      >
        <Image
          style={{
            width: 200,
            height: 200,
            marginBottom: 40,
            marginTop: -80,
          }}
          source={require("../assets/images/test4.png")}
        />
        <Text style={{ fontWeight: "bold" }}>SETTINGS</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#b91c1c",
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 50,
          }}
          onPress={() => {
            console.log("USER LOGGED OUT");
            router.push("/login");
          }}
        >
          <Text style={{ color: "#fee2e2", fontWeight: "bold" }}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </PanGestureHandler>
  );
}
