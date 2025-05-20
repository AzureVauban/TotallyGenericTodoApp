import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { PanGestureHandler } from "react-native-gesture-handler";
import { playInvalidSound } from "../utils/playInvalidSound";
import { useTheme } from "@theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "@theme/colors";
import { styles } from "@theme/styles";
/**
 * **ResetPassword Screen**
 *
 * A three‑field form that lets the user reset their password. The screen workflow:
 *
 * 1. **User Input**
 *    * **Username / Email** – plain text field (not currently validated).
 *    * **Password** – secure entry, stored in local `pwd` state.
 * 2. **Validation**
 *    * Any empty field sets an error flag that highlights the input with `#450a0a`.
 * 3. **Next →**
 *    * If validation passes, navigates to `/verificationMethod` via Expo Router.
 * 4. **Swipe‑to‑go‑back**
 *    * A rightward PanGesture (> 50 px) sends the user to `/login`.
 *
 * ### State
 * * `username`, `email`, `password` – user‑entered strings.
 * * `*_Error` booleans – input‑level validation flags.
 * * `isNavigating` – debounce so the swipe handler doesn’t fire twice.
 *
 * @returns A scrollable React‑Native form wrapped in `PanGestureHandler`.
 */
export default function ResetPassword() {
  console.log("Current file name: ResetPassword");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  useFocusEffect(React.useCallback(() => {}, [theme]));

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState(true);
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);

  // Simple email validation regex
  const validateEmail = (emailToValidate) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(emailToValidate);
  };

  const handleNext = () => {
    let hasError = false;

    if (!username.trim()) {
      setUsernameValid(false);
      hasError = true;
    } else {
      setUsernameValid(true);
    }

    if (!password.trim()) {
      setPasswordValid(false);
      hasError = true;
    } else {
      setPasswordValid(true);
    }

    if (!email.trim() || !validateEmail(email)) {
      setEmailValid(false);
      hasError = true;
    } else {
      setEmailValid(true);
    }

    if (hasError) {
      playInvalidSound();
      return;
    }

    console.log("User pressed reset password");
    router.push("/verificationMethod");
  };

  const [isNavigating, setIsNavigating] = useState(false);

  const handleSwipe = ({ nativeEvent }) => {
    if (nativeEvent.translationX > 50 && !isNavigating) {
      setIsNavigating(true);
      router.back();
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  return (
    <PanGestureHandler onHandlerStateChange={handleSwipe}>
      <SafeAreaView
        style={[
          styles.screenbackground,
          {
            backgroundColor: isDark
              ? colors.light.primary
              : colors.dark.primary,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 32,
            paddingVertical: 48,
          }}
        >
          {/* Header + Logo */}
          <View style={{ alignItems: "center", marginTop: 150 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 20,
                color: isDark ? colors.light.accent : colors.dark.accent,
              }}
            >
              Reset password
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? colors.light.text : colors.dark.text },
              ]}
            >
              reset your account's password
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: 16 }}>
            {/* Username */}
            <TextInput
              style={[
                {
                  fontWeight: "700",
                  borderRadius: 8,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                },
                {
                  backgroundColor: usernameValid
                    ? isDark
                      ? colors.light.primary
                      : colors.dark.primary
                    : "#450a0a",
                  color: isDark ? colors.light.text : colors.dark.text,
                  marginBottom: 4,
                },
              ]}
              placeholder="Username"
              placeholderTextColor={
                isDark ? colors.light.text : colors.dark.text
              }
              value={username}
              onChangeText={(t) => {
                setUsername(t);
                setUsernameValid(true);
              }}
            />
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: isDark
                  ? colors.dark.secondary
                  : colors.light.secondary,
                marginTop: 4,
              }}
            />

            {/* Email */}
            <TextInput
              style={[
                {
                  fontWeight: "700",
                  borderRadius: 8,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                },
                {
                  backgroundColor: emailValid
                    ? isDark
                      ? colors.light.primary
                      : colors.dark.primary
                    : "#450a0a",
                  color: isDark ? colors.light.text : colors.dark.text,
                  marginBottom: 4,
                },
              ]}
              placeholder="Email"
              placeholderTextColor={
                isDark ? colors.light.text : colors.dark.text
              }
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setEmailValid(true);
              }}
              onBlur={() => setEmailValid(validateEmail(email))}
            />
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: isDark
                  ? colors.dark.secondary
                  : colors.light.secondary,
                marginTop: 4,
              }}
            />

            {/* Password */}
            <TextInput
              style={[
                styles.input,
                {
                  width: "100%",
                  paddingVertical: 14,
                  paddingHorizontal: 16,

                  fontSize: 16,
                  marginBottom: 4,
                  color: isDark ? colors.dark.text : colors.light.text,
                  backgroundColor: isDark
                    ? colors.dark.background
                    : colors.light.background,
                },
              ]}
              placeholder="Password"
              placeholderTextColor={
                isDark ? colors.dark.icon : colors.light.icon
              }
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                width: "100%",
                paddingVertical: 16,

                alignItems: "center",
                marginTop: 12,
                marginBottom: 4,
                backgroundColor: isDark
                  ? colors.dark.purplebutton_background
                  : colors.light.purplebutton_background,
              },
            ]}
            onPress={() => handleNext}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  fontSize: 18,
                  fontWeight: "500",
                  letterSpacing: 0.5,
                  color: isDark
                    ? colors.dark.purplebutton_text_icon
                    : colors.light.purplebutton_text_icon,
                },
              ]}
            >
              Reset Password
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </PanGestureHandler>
  );
}
