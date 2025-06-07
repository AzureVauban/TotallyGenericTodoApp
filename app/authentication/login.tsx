import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { colors } from "@theme/colors";
import { playInvalidSound } from "utils/sounds/invalid";
import { useTheme } from "lib/ThemeContext";

import MemberListIcon from "../../assets/icons/svg/fi-br-member-list.svg";
import { getAuthErrorMessage } from "../../lib/auth-exceptions";
import { supabase } from "../../lib/supabaseClient";

export default function LoginScreen() {
  console.log("LoginScreen rendered");

  const [identifier, setIdentifier] = useState(""); // replaces username
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [magicEmail, setMagicEmail] = useState("");
  const router = useRouter();
  const { theme } = useTheme();

  // Animated values for background colors
  const usernameBgAnim = useRef(new Animated.Value(0)).current;
  const passwordBgAnim = useRef(new Animated.Value(0)).current;

  // Helper to animate error background
  const triggerErrorAnimation = (animRef) => {
    Animated.sequence([
      Animated.timing(animRef, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(animRef, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();
  };

  useEffect(() => {
    if (usernameError) {
      playInvalidSound();
      triggerErrorAnimation(usernameBgAnim);
    }
  }, [usernameError]);

  useEffect(() => {
    if (passwordError) {
      playInvalidSound();
      triggerErrorAnimation(passwordBgAnim);
    }
  }, [passwordError]);

  // Interpolate background color
  const getBgColor = (animRef, error) =>
    animRef.interpolate({
      inputRange: [0, 1],
      outputRange: [
        colors[theme].background,
        styles.inputBackgroundError.backgroundColor,
      ],
    });

  const handleMagicLink = async (email: string) => {
    console.log("[Login] handleMagicLink called with email:", email);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: "sussysushi://home", // or your deep link
        },
      });
      if (error) throw error;
      alert("Magic link sent! Check your email.");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    }
  };

  // Detect if app was opened via magic link
  useEffect(() => {
    const checkInitialUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        console.log("[Magic Link] App opened via URL:", url);
        // Try to get the current user session
        const { data, error } = await supabase.auth.getUser();
        if (data?.user) {
          console.log(
            `[Magic Link] Authenticated user via magic link: userID=${data.user.id}, email=${data.user.email}`
          );
        } else {
          console.log(
            "[Magic Link] No authenticated user found after magic link.",
            error
          );
        }
      } else {
        console.log(
          "[Expo Debug] App opened via regular Expo session (no magic link URL)."
        );
      }
    };
    checkInitialUrl();
  }, []);

  // After successful login or magic link:
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("[Login] Session after login:", session);
    };
    fetchSession();
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: colors[theme].background }]}
    >
      <MemberListIcon
        width={32}
        height={32}
        style={styles.icon}
        fill={colors[theme].text}
      />
      <Text style={[styles.title, { color: colors[theme].text }]}>Sign In</Text>
      <Text style={[styles.description, { color: colors[theme].text }]}>
        login to your account
      </Text>
      {errorMessage ? (
        <Text
          style={{ color: "#dc2626", textAlign: "center", marginBottom: 8 }}
        >
          {errorMessage}
        </Text>
      ) : null}

      {/* Magic Link Section */}
      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors[theme].tertiary,
            color: colors[theme].text,
            backgroundColor: "transparent",
          },
        ]}
        placeholder="Email for magic link"
        placeholderTextColor={colors[theme].secondary}
        value={magicEmail}
        onChangeText={setMagicEmail}
      />
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: colors[theme].purplebutton_background },
        ]}
        onPress={() => handleMagicLink(magicEmail)}
      >
        <Text
          style={[
            styles.buttonText,
            { color: colors[theme].purplebutton_text_icon },
          ]}
        >
          Send Magic Link
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          console.log("[Login] Forgot password link pressed");
          router.push("/notfound");
        }}
      >
        <Text style={[styles.forgot, { color: colors[theme].accent }]}>
          Forgot your password? Reset it here
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  icon: {
    marginBottom: 16,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    color: "#000",
    letterSpacing: 0,
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  forgot: {
    marginTop: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  inputBackgroundError: {
    backgroundColor: "#7f1d1d",
  },
});
