// MENU1.tsx
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

export default function Menu1Screen() {
  const router = useRouter();
  const hasNavigated = useRef(false);
  const [bgColor, setBgColor] = useState("#eef2ff");

  // Force background to color when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setBgColor("#eef2ff");
      hasNavigated.current = false;
    }, [])
  );

  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = (
      event.nativeEvent as unknown as PanGestureHandlerEventPayload
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
      if (translationX < -100 && !hasNavigated.current) {
        hasNavigated.current = true;
        // ...existing navigation logic...
        console.log("USER: MENU1 <= HOME");
        router.push("/home");
      }
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
        // ...existing navigation logic...
        console.log("USER: MENU1 => MENU2");
        router.push("/menu2");
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
            marginBottom: 40, // space below the image
            marginTop: -80, // move image higher up (adjust as needed)
          }}
          source={require("../assets/images/test3.png")}
        />
        <Text style={{ fontWeight: "bold" }}> MENU1</Text>
      </View>
    </PanGestureHandler>
  );
}
