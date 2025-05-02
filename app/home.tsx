import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StyleSheet } from "react-native";
import FiBr from "../assets/icons/svg/fi-br-house-chimney-blank.svg";
import FiBrplus from "../assets/icons/svg/fi-br-plus.svg";
import { TouchableOpacity } from "react-native";
import {
  PanGestureHandler,
  State,
  GestureHandlerGestureEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
//import { Container } from "@/my-expo-app/components/Container";

/*
  Dark theme palette (left UI) with original hex codes:
    dark_primary:    #101010
    dark_secondary:  #1A1A1A
    dark_tertiary:   #373737
    dark_accents:    #F26C4F
    dark_subaccents: #C5C5C5

  Light theme palette (right UI) with original hex codes:
    light_primary:   #F26C4F
    light_secondary: #FFFFFF
    light_tertiary:  #CCCCCC
    light_accents:   #101010
    light_subaccents:#373737
*/
const COLORS = {
  //  Dark theme palette (left UI) with original hex codes:
  dark_primary: "#101010", // #101010
  dark_secondary: "#1A1A1A", // #1A1A1A
  dark_tertiary: "#373737", // #373737
  dark_accents: "#F26C4F", // #F26C4F
  dark_subaccents: "#C5C5C5", // #C5C5C5

  // Light theme palette (right UI) with original hex codes:
  light_primary: "#E76F51", // #E76F51
  light_secondary: "#F4A261", // #F4A261
  light_tertiary: "#E9C46A", // #E9C46A
  light_accents: "#2A9D8F", // #2A9D8F
  light_subaccents: "#264653", // #264653
};
const styles = StyleSheet.create({
  screenbackground: {
    flex: 1,
    backgroundColor: COLORS.dark_primary,
    color: COLORS.dark_primary,
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
    color: COLORS.dark_accents,
  },
  subtitle: {
    fontSize: 16,
    color: "#C6C6D0",
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: COLORS.dark_secondary,
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
    backgroundColor: COLORS.dark_secondary,
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
    //color: " #D59D80",
    //fill: COLORS.dark_secondary,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.dark_secondary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 24,
    right: 24,
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
          fill={COLORS.dark_accents}
          style={styles.icon}
        />
        <Text style={styles.title}>HOME</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // todo feature/add-task
            console.log("ADD TASK NOT IMPLEMENTED");
            console.log("USER: HOME => ADD");
          }}
        >
          <FiBrplus width={25} height={25} fill={COLORS.dark_accents} />
        </TouchableOpacity>
      </View>
    </PanGestureHandler>
  );
}
