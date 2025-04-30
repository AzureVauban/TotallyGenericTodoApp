import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  PanGestureHandler,
  State,
  GestureHandlerGestureEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";

// THIS IS THE HOME SCREEN
export default function HomeScreen() {
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const router = useRouter();
  const hasNavigated = useRef(false);
  const [bgColor, setBgColor] = useState("#fff");

  // Reset hasNavigated when screen is focused

  useFocusEffect(
    React.useCallback(() => {
      hasNavigated.current = false;
      setBgColor("#fff");
    }, [])
  );

  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = (
      event.nativeEvent as unknown as PanGestureHandlerEventPayload
    ).translationX;

    // Visual feedback: interpolate color as user swipes left
    if (translationX < 0 && translationX > -150) {
      const percent = Math.min(Math.abs(translationX) / 150, 1);
      const r = 255;
      const g = Math.floor(255 - 90 * percent);
      const b = Math.floor(255 - 255 * percent);
      setBgColor(`rgb(${r},${g},${b})`);
    } else if (translationX >= 0) {
      setBgColor("#fff");
    }

    // Navigate to settings if swiped far enough left
    if (translationX < -100 && !hasNavigated.current) {
      hasNavigated.current = true;
      setBgColor("#b6fcb6");
      router.push("/settings");
    }
    // Visual feedback: interpolate color as user swipes right
    if (translationX > 0 && translationX < 150) {
      const percent = Math.min(translationX / 150, 1);
      const r = 255;
      const g = Math.floor(255 - 90 * percent);
      const b = Math.floor(255 - 255 * percent);
      setBgColor(`rgb(${r},${g},${b})`);
    } else if (translationX <= 0) {
      setBgColor("#fff");
    }

    // Navigate to menu1 if swiped far enough right
    if (translationX > 100 && !hasNavigated.current) {
      hasNavigated.current = true;
      setBgColor("#b6fcb6");
      router.push("/menu1");
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
          source={require("../assets/images/test1.png")}
        />
        {
          <Text style={{ fontWeight: "bold" }}>INDEX</Text>
        }
      </View>
    </PanGestureHandler>
  );
}
