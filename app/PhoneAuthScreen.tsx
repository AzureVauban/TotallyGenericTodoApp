import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@theme/colors";
import { useTheme } from "@theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import SmartphoneIcon from "../assets/icons/svg/fi-br-smartphone.svg";

const styles = StyleSheet.create({
  screenbackground: {
    flex: 1,
    backgroundColor: colors.dark.primary,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.dark.accent,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark.text,
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.dark.secondary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 320,
    elevation: 2,
  },
  buttonText: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

/**
 * **PhoneAuthScreen Screen**
 *
 * Mirrors **EmailAuthScreen** but for SMS verification. Displays four code boxes
 * and a numeric keypad; once the user enters all four digits, the **Verify →**
 * button becomes active.
 *
 * #### Interaction
 * • **Digit tap** – appends a digit (cap 4).
 * • **⌫ Backspace** – deletes the most recent digit.
 * • **← Back** – returns to `/verificationMethod`.
 * • **Verify →** – active when `code` is full; navigates to `/home`.
 *
 * #### State / Hooks
 * • `code` – 4-digit SMS code.
 * • `useRouter` – Expo Router navigation.
 *
 * @returns A `SafeAreaView` wrapping the verification UI.
 */

export default function PhoneAuthScreen() {
  console.log("User navigated to phone authentication screen");
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  useFocusEffect(React.useCallback(() => {}, [theme]));

  return (
    <SafeAreaView
      style={[
        styles.screenbackground,
        {
          backgroundColor: isDark
            ? colors.dark.background
            : colors.light.background,
        },
      ]}
    >
      <View style={styles.container}>
        <SmartphoneIcon
          width={250}
          height={250}
          fill={isDark ? colors.dark.accent : colors.light.accent}
          style={{ alignSelf: "center", marginBottom: 75 }}
        />
        <Text
          style={[
            styles.title,
            {
              color: isDark
                ? colors.dark.purplebutton_background
                : colors.dark.purplebutton_background,
            },
          ]}
        >
          Verify Your Phone
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isDark ? colors.dark.text : colors.light.text },
          ]}
        >
          Please enter your phone number to receive a verification code.
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isDark
                ? colors.dark.purplebutton_background
                : colors.light.purplebutton_text_icon,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: isDark
                  ? colors.dark.purplebutton_text_icon
                  : colors.light.purplebutton_background,
              },
            ]}
          >
            Send Verification Code
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isDark
                ? colors.dark.purplebutton_background
                : colors.light.purplebutton_text_icon,
              marginTop: 12,
            },
          ]}
          onPress={() => router.push("/inputCode")}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: isDark
                  ? colors.dark.purplebutton_text_icon
                  : colors.light.purplebutton_background,
              },
            ]}
          >
            Input Code
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
