/*
TODO FINISH REWORKING THIS SCREEN
[x] ADD EMAIL FIELD
[x] ADD CONFIRM PASSWORD FIELD
[x] add invalid sound for when a required field is missing
- add visual feedback (input field becomes dark red) when required input is missing
- make sure to add/change respective functionality
- create a new screen for verifying account options and implement magic link
 */
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
import { styles } from "@theme/styles";
import { generateUsername } from "utils/generateUsername";
import { playFlaggedSound } from "utils/sounds/flag";
import { playInvalidSound } from "utils/sounds/invalid";

export default function LoginScreen() {
  const [initialUsername, setInitialUsername] = useState(generateUsername());
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const isGeneratedUsername = username.trim() === initialUsername;

  // Animated values for background colors
  const usernameBgAnim = useRef(new Animated.Value(0)).current;
  const emailBgAnim = useRef(new Animated.Value(0)).current;
  const passwordBgAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordBgAnim = useRef(new Animated.Value(0)).current;

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

  // Watch for error state changes and trigger animation
  useEffect(() => {
    if (usernameError && !isGeneratedUsername) {
      playInvalidSound();
      triggerErrorAnimation(usernameBgAnim);
    }
  }, [usernameError, isGeneratedUsername]);

  useEffect(() => {
    if (emailError) {
      playInvalidSound();
      triggerErrorAnimation(emailBgAnim);
    }
  }, [emailError]);

  useEffect(() => {
    if (passwordError) {
      playInvalidSound();
      triggerErrorAnimation(passwordBgAnim);
    }
  }, [passwordError]);

  useEffect(() => {
    if (confirmPasswordError) {
      playInvalidSound();
      triggerErrorAnimation(confirmPasswordBgAnim);
    }
  }, [confirmPasswordError]);

  // Interpolate background color
  const getBgColor = (animRef, error, isUsernameField = false) =>
    animRef.interpolate({
      inputRange: [0, 1],
      outputRange: [
        isUsernameField && usernameError && !isGeneratedUsername
          ? styles.inputBackgroundError.backgroundColor
          : colors[theme].background,
        styles.inputBackgroundError.backgroundColor,
      ],
    });

  return (
    <View
      style={[
        register_styles.container,
        { backgroundColor: colors[theme].background },
      ]}
    >
      <MemberListIcon width={32} height={32} style={register_styles.icon} />
      <Text style={[register_styles.title, { color: colors[theme].text }]}>
        Register
      </Text>
      <Text
        style={[register_styles.description, { color: colors[theme].text }]}
      >
        Sign up to the totally generic todo app!
      </Text>

      {/* Username Field with Animated Background */}
      <Animated.View
        style={{
          borderRadius: 6,
          marginBottom: 12,
          backgroundColor: getBgColor(usernameBgAnim, usernameError, true),
        }}
      >
        <TextInput
          style={[
            register_styles.input,
            {
              borderColor: colors[theme].tertiary,
              color: isGeneratedUsername
                ? isDark
                  ? "#22c55e"
                  : "#065f46"
                : colors[theme].text,
              fontWeight: isGeneratedUsername ? "bold" : "normal",
              backgroundColor: "transparent", // Let Animated.View handle bg
            },
          ]}
          placeholder="Username"
          placeholderTextColor={colors[theme].secondary}
          value={username}
          onChangeText={setUsername}
        />
      </Animated.View>

      {/* Email Field with Animated Background */}
      <Animated.View
        style={{
          borderRadius: 6,
          marginBottom: 12,
          backgroundColor: getBgColor(emailBgAnim, emailError),
        }}
      >
        <TextInput
          style={[
            register_styles.input,
            {
              borderColor: colors[theme].tertiary,
              color: colors[theme].text,
              backgroundColor: "transparent",
            },
          ]}
          placeholder="Email"
          placeholderTextColor={colors[theme].secondary}
          value={email}
          onChangeText={setEmail}
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
            register_styles.input,
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

      {/* Confirm Password Field with Animated Background */}
      <Animated.View
        style={{
          borderRadius: 6,
          marginBottom: 12,
          backgroundColor: getBgColor(
            confirmPasswordBgAnim,
            confirmPasswordError
          ),
        }}
      >
        <TextInput
          style={[
            register_styles.input,
            {
              borderColor: colors[theme].tertiary,
              color: colors[theme].text,
              backgroundColor: "transparent",
            },
          ]}
          placeholder="Confirm Password"
          placeholderTextColor={colors[theme].secondary}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </Animated.View>

      <TouchableOpacity
        style={[
          register_styles.button,
          { backgroundColor: colors[theme].primary },
        ]}
        onPress={async () => {
          const isUsernameValid = username.length >= 3;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const isEmailValid = emailRegex.test(email);
          const isPasswordValid = !!password;
          const isConfirmPasswordValid = password === confirmPassword;

          setUsernameError(!isUsernameValid);
          setEmailError(!isEmailValid);
          setPasswordError(!isPasswordValid);
          setConfirmPasswordError(!isConfirmPasswordValid);

          // Always trigger animation and sound if invalid, even if already in error state
          if (!isUsernameValid && !isGeneratedUsername) {
            playInvalidSound();
            triggerErrorAnimation(usernameBgAnim);
          }
          if (!isEmailValid) {
            playInvalidSound();
            triggerErrorAnimation(emailBgAnim);
          }
          if (!isPasswordValid) {
            playInvalidSound();
            triggerErrorAnimation(passwordBgAnim);
          }
          if (!isConfirmPasswordValid) {
            playInvalidSound();
            triggerErrorAnimation(confirmPasswordBgAnim);
          }

          if (
            !isUsernameValid ||
            !isEmailValid ||
            !isPasswordValid ||
            !isConfirmPasswordValid
          ) {
            console.warn("Please correct the highlighted fields.");
            return;
          }

          // Pass values to auth-choice screen
          router.push({
            pathname: "/authentication/auth-choice",
            params: {
              username,
              email,
              password,
            },
          });

          // After successful registration and email is known:
          await supabase.from("profiles").upsert({
            email,
            username,
            display_name: username,
          });
        }}
      >
        <Text
          style={[
            register_styles.buttonText,
            { color: colors[theme].background },
          ]}
        >
          Continue
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          register_styles.button,
          { backgroundColor: colors[theme].primary },
        ]}
        onPress={() => {
          playFlaggedSound();
          const newUsername = generateUsername();
          setUsername(newUsername);
          setInitialUsername(newUsername);
        }}
      >
        <Text
          style={[
            register_styles.buttonText,
            { color: colors[theme].background },
          ]}
        >
          Generate new username
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/notfound")}>
        <Text style={[register_styles.forgot, { color: colors[theme].accent }]}>
          Forgot your password? Reset it here
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const register_styles = StyleSheet.create({
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
