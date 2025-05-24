import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import MemberListIcon from "../../assets/icons/svg/fi-br-member-list.svg";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "expo-router";
import { colors } from "@theme/colors";
import { useTheme } from "@theme/ThemeContext";
import { playInvalidSound } from "utils/sounds/invalid";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
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

  return (
    <View
      style={[styles.container, { backgroundColor: colors[theme].background }]}
    >
      <MemberListIcon width={32} height={32} style={styles.icon} />
      <Text style={[styles.title, { color: colors[theme].text }]}>Sign In</Text>
      <Text style={[styles.description, { color: colors[theme].text }]}>
        login to your account
      </Text>

      {/* Username Field with Animated Background */}
      <Animated.View
        style={{
          borderRadius: 6,
          marginBottom: 12,
          backgroundColor: getBgColor(usernameBgAnim, usernameError),
        }}
      >
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors[theme].tertiary,
              color: colors[theme].text,
              backgroundColor: "transparent",
            },
          ]}
          placeholder="Username"
          placeholderTextColor={colors[theme].secondary}
          value={username}
          onChangeText={setUsername}
        />
      </Animated.View>
      {/* Password Field with Animated Background */}
      <Animated.View
        style={{
          borderRadius: 6,
          marginBottom: 12,
          backgroundColor: getBgColor(passwordBgAnim, passwordError),
        }}
      >
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors[theme].tertiary,
              color: colors[theme].text,
              backgroundColor: "transparent",
            },
          ]}
          placeholder="Password"
          placeholderTextColor={colors[theme].secondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </Animated.View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors[theme].primary }]}
        onPress={async () => {
          let hasError = false;
          if (!username) {
            setUsernameError(true);
            hasError = true;
          } else {
            setUsernameError(false);
          }
          if (!password) {
            setPasswordError(true);
            hasError = true;
          } else {
            setPasswordError(false);
          }
          if (hasError) {
            return;
          }
          // Lookup the email using the username
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("email")
            .eq("username", username)
            .maybeSingle();

          if (profileError || !profile?.email) {
            setUsernameError(true);
            return;
          }

          // Sign in with the fetched email
          const { error: authError } = await supabase.auth.signInWithPassword({
            email: profile.email,
            password,
          });

          if (authError) {
            setPasswordError(true);
            console.warn("Login failed:", authError.message);
          } else {
            console.log("Login successful!");
            router.replace("/home");
          }
        }}
      >
        <Text style={[styles.buttonText, { color: colors[theme].background }]}>
          Sign In
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/notfound")}>
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
