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
  const router = useRouter();
  const hasNavigated = useRef(false);
  const [bgColor, setBgColor] = useState("#eef2ff");

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      hasNavigated.current = false;
      setBgColor("#eef2ff");
    }, [])
  );

  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = (
      event.nativeEvent as unknown as PanGestureHandlerEventPayload
    ).translationX;

    if (translationX < 0) {
      // For left swipe, interpolate from white to orange (rgb(255,165,0))
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
        console.log("USER: HOME <= SETTINGS");
        router.push("/settings");
      }
    } else if (translationX > 0) {
      // For right swipe, interpolate from white to blue (rgb(0,0,255))
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
        console.log("USER: HOME => LEADERBOARD");
        router.push("/leaderboard");
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
          source={require("../assets/images/test1.png")}
        />
        <Text style={{ fontWeight: "bold" }}>HOME</Text>
      </View>
    </PanGestureHandler>
  );
}
