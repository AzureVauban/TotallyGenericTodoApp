import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "@theme/colors";
import { useTheme } from "@theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";

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
 * **VerifyEmail Screen**
 *
 * Shows the 4-digit OTP interface for email verification. Four boxes fill as
 * the user taps digits on a custom keypad rendered below.
 *
 * #### Interaction
 * • **Digit tap** – appends the digit to `code` (max 4).
 * • **⌫ Backspace** – removes the last digit.
 * • **← Back** – navigates back to `/verificationMethod`.
 * • **Verify →** – enabled only when `code.length === 4`; routes to `/home`.
 *
 * #### State / Hooks
 * • `code` – string holding the current 4-digit OTP.
 * • `useRouter` – Expo Router instance for navigation.
 *
 * @returns A `SafeAreaView` containing the code boxes and numeric keypad.
 */

export default function verifyPhone() {
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
        <Text
          style={[
            styles.title,
            { color: isDark ? colors.dark.accent : colors.light.accent },
          ]}
        >
          Verify Your Email
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isDark ? colors.dark.text : colors.light.text },
          ]}
        >
          Please enter your address to receive a verification code.
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isDark
                ? colors.dark.secondary
                : colors.light.secondary,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { color: isDark ? colors.dark.text : colors.light.text },
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
                ? colors.dark.tertiary
                : colors.light.tertiary,
              marginTop: 12,
            },
          ]}
          onPress={() => router.push("/inputCode")}
        >
          <Text
            style={[
              styles.buttonText,
              { color: isDark ? colors.dark.text : colors.light.text },
            ]}
          >
            Input Code
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
