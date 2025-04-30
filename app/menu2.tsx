// MENU2.tsx
/*
This menu is currently a placeholder.
Future updates will replace this with the actual menu implementation.
*/
import React, { useRef, useState } from "react";
import { View, Text, Image } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  PanGestureHandler,
  State,
  GestureHandlerGestureEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";

export default function Menu2Screen() {
  const router = useRouter();
  const hasNavigated = useRef(false);
  const [bgColor, setBgColor] = useState("#fff");

  // Force background to white when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setBgColor("#fff");
      hasNavigated.current = false;
    }, [])
  );

  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = (
      event.nativeEvent as unknown as PanGestureHandlerEventPayload
    ).translationX;

    // Handle right swipe (positive translationX)
    if (translationX > 0) {
      if (translationX < 150) {
        const percent = Math.min(translationX / 150, 1);
        const r = Math.floor(255 - 55 * percent);
        const g = Math.floor(255 - (255 - 230) * percent);
        const b = Math.floor(255 - 55 * percent);
        setBgColor(`rgb(${r},${g},${b})`);
      }

      if (translationX > 100 && !hasNavigated.current) {
        hasNavigated.current = true;
        setBgColor("#b6fcb6");
        router.push("/settings");
      }
    }
    // Handle left swipe (negative translationX)
    if (translationX < 0) {
      const absTranslation = Math.abs(translationX);
      if (absTranslation < 150) {
        const percent = Math.min(absTranslation / 150, 1);
        // Interpolate from white (255, 255, 255) to a light red (255, 182, 182)
        const r = Math.floor(255 - 243 * percent);
        const g = Math.floor(255 - 134 * percent);
        const b = Math.floor(255 - 51 * percent);
        setBgColor(`rgb(${r},${g},${b})`);
      }

      if (absTranslation > 100 && !hasNavigated.current) {
        hasNavigated.current = true;
        setBgColor("fff");
        router.push("/menu1");
      }
    }
    // Optionally reset background if no significant swipe
    else {
      setBgColor("#fff");
    }

    // Reset when gesture ends after a delay
    if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      setTimeout(() => {
        hasNavigated.current = false;
        setBgColor("#fff");
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
            marginBottom: 40, // space below the image
            marginTop: -80, // move image higher up (adjust as needed)
          }}
          source={require("../assets/images/test3.png")}
        />
        <Text style={{ fontWeight: "bold" }}>
          MENU2
        </Text>
      </View>
    </PanGestureHandler>
  );
}
