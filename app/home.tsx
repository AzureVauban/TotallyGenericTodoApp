import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StyleSheet } from "react-native";
import FiBr from "../assets/icons/svg/fi-br-house-chimney-blank.svg";

import {
  PanGestureHandler,
  State,
  GestureHandlerGestureEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
//import { Container } from "@/my-expo-app/components/Container";

const COLORS = {
  //! make sure to change these colors to match design when the times comes
  // color scheme (dark)
  dark_primary: "#1B2929", // #1B2929
  dark_secondary: "#453F43", // #453F43
  dark_tertiary: "#5B6264", // #5B6264
  dark_accents: "#9E9190", // #9E9190
  dark_subaccents: "#C6C6D0", // #C6C6D0
  dark_senary: "#FEA57E", // #FEA57E
  dark_icon_text: "#FEA57E", // #FEA57E

  // color scheme (light)
  light_primary: "#0D1D25", // #0D1D25
  light_secondary: "#104C64", // #104C64
  light_tertiary: "#C6C6D0", // #C6C6D0
  light_accents: "#D59D80", // #D59D80
  light_subaccents: "#C0754D", // #C0754D
  light_senary: "#B6410F", // #B6410F
  light_icon_text: "#C6C6D0", // #C6C6D0
};
const styles = StyleSheet.create({
  screenbackground: {
    flex: 1,
    backgroundColor: COLORS.dark_primary,
    color: " #104C64",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#104C64",
  },
  content: {
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: COLORS.dark_subaccents,
  },
  subtitle: {
    fontSize: 16,
    color: "#C6C6D0",
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: " #D59D80",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#C6C6D0",
    fontWeight: "bold",
  },
  buttonSecondary: {
    backgroundColor: " #104C64",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    color: " #D59D80",
    backgroundColor: " #D59D80",
  },
});

// THIS IS THE HOME SCREEN
export default function HomeScreen() {
  const router = useRouter();
  const hasNavigated = useRef(false);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      hasNavigated.current = false;
    }, [])
  );

  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = (
      event.nativeEvent as unknown as PanGestureHandlerEventPayload
    ).translationX;

    if (translationX < -100 && !hasNavigated.current) {
      hasNavigated.current = true;
      console.log("USER: HOME <= SETTINGS");
      router.push("/settings");
    }
    if (translationX > 100 && !hasNavigated.current) {
      hasNavigated.current = true;
      console.log("USER: HOME => LEADERBOARD");
      router.push("/leaderboard");
    }

    if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      setTimeout(() => {
        hasNavigated.current = false;
      }, 1500);
    }
  };

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View style={styles.screenbackground}>
        <FiBr
          width={50}
          height={50}
          fill={COLORS.dark_subaccents}
          style={styles.icon}
        />
        <Text style={styles.title}>HOME</Text>
      </View>
    </PanGestureHandler>
  );
}
