import "react-native-url-polyfill/auto";
import React from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import FISignatureIcon from "../assets/icons/svg/fi-br-list-check.svg";
import { colors } from "@theme/colors";
import { useTheme } from "@theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
const SCREEN_WIDTH = Dimensions.get("window").width;
const BUTTON_WIDTH = SCREEN_WIDTH * 0.7;

const styles = StyleSheet.create({
  screenbackground: {
    flex: 1,
    backgroundColor: colors.dark.primary,
    color: colors.dark.text,
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
    color: colors.dark.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark.text,
    marginBottom: 20,
  },
  linktext: {
    fontSize: 16,
    color: colors.dark.text,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: colors.dark.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    // width removed
  },
  buttonText: {
    color: colors.dark.secondary,
    fontWeight: "bold",
  },
  buttonSecondary: {
    backgroundColor: "#104C64",
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
  },
});

/**
 * **LoginScreen**
 *
 * Presents the root login interface where a user may:
 *  • Tap **“Login with Email”** – sets `isUserLoggedIn` and redirects to `/homeScreen`.
 *  • Tap **“Forgot Password?”** – pushes the `/resetPassword` route.
 *  • Tap **“Sign Up”** – pushes the `/registerAccount` route.
 *
 * ### Visuals
 * * Displays the Divide&Do signature SVG in brand colours.
 * * Shows the app welcome title with the accent colour’s complementary hue computed at runtime.
 *
 * ### State / Hooks
 * * `isUserLoggedIn` – local `useState` boolean; when `true`, a `useEffect` redirects with
 *   `router.replace("/homeScreen")`.
 * * `getComplement(hex)` – helper that returns the complementary colour of a hex string.
 * * `useRouter` from **expo-router** handles navigation.
 *
 * @returns A centred React‑Native view containing the login buttons and links.
 */

export default function GreetScreen() {
  console.log(`Current file name: GreetScreen`);

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  useFocusEffect(React.useCallback(() => {}, [theme]));

  const router = useRouter();

  // Shared button style so both buttons have the same width.

  return (
    <View
      style={[
        styles.screenbackground,
        {
          backgroundColor: isDark
            ? colors.dark.background
            : colors.light.background,
        },
      ]}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 150,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            console.log("Theme icon pressed. Toggling theme...");
            toggleTheme();
          }}
        >
          <FISignatureIcon
            style={styles.icon}
            width={250}
            height={250}
            fill={isDark ? colors.dark.accent : colors.light.accent}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.title,
            { color: isDark ? colors.dark.accent : colors.light.accent },
          ]}
        >
          {" "}
          This is a cool todo app!
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              paddingBottom: 50,
              color: isDark ? colors.dark.text : colors.light.text,
            },
          ]}
        >
          Complete tasks, get stuff done!
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            {
              flexDirection: "row",
              width: BUTTON_WIDTH,
              backgroundColor: isDark
                ? colors.dark.bluebutton_background
                : colors.light.bluebutton_background,
            },
          ]}
          onPress={() => {
            router.push("/home");
          }}
        >
          <Text
            style={[
              { fontSize: 16, fontWeight: "600" },
              {
                color: isDark
                  ? colors.dark.bluebutton_text_icon
                  : colors.light.bluebutton_text_icon,
              },
            ]}
          >
            Continue to home screen
          </Text>
        </TouchableOpacity>
        {/* Reset password button */}
        <TouchableOpacity
          style={[
            styles.buttonSecondary,
            {
              flexDirection: "row",
              width: BUTTON_WIDTH,
              marginBottom: 20,
              backgroundColor: isDark
                ? colors.dark.bluebutton_background
                : colors.light.bluebutton_background,
            },
          ]}
          onPress={() => {
            console.log("User pressed reset password");
            router.push("/resetPassword");
          }}
        >
          <Text
            style={{
              color: isDark
                ? colors.dark.bluebutton_text_icon
                : colors.light.bluebutton_text_icon,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              style={[
                styles.subtitle,
                {
                  fontWeight: "500",
                  color: isDark
                    ? colors.dark.secondary
                    : colors.light.secondary,
                },
              ]}
            >
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                console.log("User went to account register page");
                router.push("/registerAccount");
              }}
            >
              <Text
                style={[
                  styles.linktext,
                  {
                    color: isDark
                      ? colors.dark.bluebutton_text_icon
                      : colors.light.bluebutton_text_icon,
                  },
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: -15,
            }}
          >
            <Text
              style={[
                styles.subtitle,
                {
                  fontWeight: "500",
                  color: isDark
                    ? colors.dark.secondary
                    : colors.light.secondary,
                },
              ]}
            >
              Have an account already?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                console.log("User went to login page");
                router.push("/loginScreen");
              }}
            >
              <Text
                style={[
                  styles.linktext,
                  {
                    color: isDark
                      ? colors.dark.bluebutton_text_icon
                      : colors.light.bluebutton_text_icon,
                  },
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
