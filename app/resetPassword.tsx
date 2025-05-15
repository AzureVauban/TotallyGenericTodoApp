import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { PanGestureHandler } from "react-native-gesture-handler";
import { playInvalidSound } from "../utils/playInvalidSound";
import { useTheme } from "@theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "@theme/colors";

/**
 * **ResetPassword Screen**
 *
 * A three‑field form that lets the user reset their password. The screen workflow:
 *
 * 1. **User Input**
 *    * **Username / Email** – plain text field (not currently validated).
 *    * **Password** – secure entry, stored in local `pwd` state.
 *    * **Confirm password** – secure entry, must match `pwd`.
 * 2. **Validation**
 *    * Any empty field sets an error flag that highlights the input with `#450a0a`.
 *    * Mismatched passwords also flag an error on the confirm box.
 * 3. **Next →**
 *    * If validation passes, navigates to `/verificationMethod` via Expo Router.
 * 4. **Swipe‑to‑go‑back**
 *    * A rightward PanGesture (> 50 px) sends the user to `/login`.
 *
 * ### State
 * * `username`, `pwd`, `confirm` – user‑entered strings.
 * * `*_Error` booleans – input‑level validation flags.
 * * `isNavigating` – debounce so the swipe handler doesn’t fire twice.
 *
 * @returns A scrollable React‑Native form wrapped in `PanGestureHandler`.
 */
export default function ResetPassword() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  useFocusEffect(React.useCallback(() => {}, [theme]));

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [confirmError, setConfirmError] = useState(false);

  const handleNext = () => {
    let hasError = false;

    if (!username) {
      setUsernameError(true);
      hasError = true;
    } else {
      setUsernameError(false);
    }

    if (!pwd) {
      setPwdError(true);
      hasError = true;
    } else {
      setPwdError(false);
    }

    if (!confirm || confirm !== pwd) {
      setConfirmError(true);
      hasError = true;
    } else {
      setConfirmError(false);
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
      router.push("/login");
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  return (
    <PanGestureHandler onGestureEvent={handleSwipe}>
      <SafeAreaView
        style={[
          s.screen,
          {
            backgroundColor: isDark
              ? colors.dark.background
              : colors.light.background,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* ---------- header ---------- */}
          <View style={s.headerBlock}>
            <Text
              style={[
                s.title,
                { color: isDark ? colors.dark.accent : colors.light.accent },
              ]}
            >
              Reset{"\n"}Password
            </Text>
            <Text
              style={[
                s.subtitle,
                { color: isDark ? colors.dark.text : colors.light.text },
              ]}
            >
              input your username, phone number, or email
            </Text>
          </View>

          {/* ---------- form ---------- */}
          <View style={s.form}>
            <TextInput
              style={[
                s.input,
                usernameError && s.inputBackgroundError,
                {
                  backgroundColor: isDark
                    ? colors.dark.secondary
                    : colors.light.secondary,
                  color: isDark ? colors.dark.text : colors.light.text,
                },
              ]}
              placeholder="Username or Email"
              placeholderTextColor={
                isDark ? colors.dark.tertiary : colors.light.tertiary
              }
              autoCapitalize="none"
              keyboardType="email-address"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (text) setUsernameError(false);
              }}
            />

            <View
              style={{
                height: 1,
                backgroundColor: isDark
                  ? colors.dark.tertiary
                  : colors.light.tertiary,
                marginVertical: 0,
              }}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor={
                isDark ? colors.dark.tertiary : colors.light.tertiary
              }
              secureTextEntry
              value={pwd}
              onChangeText={(text) => {
                setPwd(text);
                if (text) setPwdError(false);
              }}
              style={[s.input, pwdError ? s.inputBackgroundError : null]}
            />

            <View
              style={{
                height: 1,
                backgroundColor: isDark
                  ? colors.dark.tertiary
                  : colors.light.tertiary,
                marginVertical: 0,
              }}
            />

            <TextInput
              placeholder="Confirm password"
              placeholderTextColor={
                isDark ? colors.dark.tertiary : colors.light.tertiary
              }
              secureTextEntry
              value={confirm}
              onChangeText={(text) => {
                setConfirm(text);
                if (text === pwd) setConfirmError(false);
              }}
              style={[s.input, confirmError ? s.inputBackgroundError : null]}
            />
          </View>

          {/* ---------- CTA ---------- */}
          <TouchableOpacity
            style={[
              s.nextBtn,
              {
                backgroundColor: isDark
                  ? colors.dark.accent
                  : colors.light.accent,
              },
            ]}
            onPress={handleNext}
          >
            <Text
              style={[
                s.nextTxt,
                { color: isDark ? colors.dark.text : colors.light.text },
              ]}
            >
              Next ›
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </PanGestureHandler>
  );
}

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingVertical: 48,
    justifyContent: "space-between",
  },

  headerBlock: { gap: 16 },

  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 14,
  },

  form: {
    gap: 16,
  },

  input: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
  },

  inputBackgroundError: {
    backgroundColor: "#450a0a", // Darker shade of red (Firebrick)
  },

  nextBtn: {
    alignSelf: "center",
    borderRadius: 12,
    paddingHorizontal: 64,
    paddingVertical: 14,
    marginTop: 24,
  },

  nextTxt: {
    fontSize: 16,
    fontWeight: "600",
  },
});
