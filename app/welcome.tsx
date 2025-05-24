/**
 * GreetScreen displays a welcome interface with theme toggling and navigation.
 * Provides access to the home screen, forgot password screen, and sign up/sign in links.
 * Layout and button colors respond dynamically to light/dark theme selection.
 */
import "react-native-url-polyfill/auto";
import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import FISignatureIcon from "../assets/icons/svg/fi-br-list-check.svg";
import { colors } from "@theme/colors";
import { useTheme } from "@theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "@theme/styles";
import { supabase } from "../lib/supabaseClient";
const SCREEN_WIDTH = Dimensions.get("window").width;
const BUTTON_WIDTH = SCREEN_WIDTH * 0.7;

export default function WelcomeScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  useFocusEffect(React.useCallback(() => {}, [theme]));
  const router = useRouter();

  const handleContinue = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      // Show warning if not authenticated
      alert(
        "You must sign in and validate your account before continuing to the home screen."
      );
      return;
    }
    router.push("/home");
  };

  return (
    <View
      style={[
        styles.screenbackground,
        {
          backgroundColor: isDark
            ? colors.dark.background
            : colors.light.background,
          // paddingTop: Platform.OS === "android" ? 32 : 0, // Add padding for Android
        },
      ]}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 75,
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
            {
              color: isDark ? colors.dark.accent : colors.light.accent,
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 20,
            },
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
              fontSize: 18,
              marginBottom: 20,
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
          onPress={handleContinue}
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
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              width: BUTTON_WIDTH,
              marginBottom: 20,
              backgroundColor: isDark
                ? colors.dark.bluebutton_background
                : colors.light.bluebutton_background,
            },
          ]}
          onPress={() => {
            router.push("/notfound");
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
              alignItems: "baseline",
              marginVertical: -15,
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
                router.push("/authentication/register");
              }}
            >
              <Text
                style={[
                  styles.link,
                  {
                    fontSize: 16,
                    fontWeight: "bold",
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
              alignItems: "baseline",
              marginVertical: 0,
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
                router.push("/authentication/login"); //! REPLACE WITH /login when ready
              }}
            >
              <Text
                style={[
                  styles.link,
                  {
                    color: isDark
                      ? colors.dark.bluebutton_text_icon
                      : colors.light.bluebutton_text_icon,
                    lineHeight: 22,
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
