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

/* ---------- Palette shared through the app ---------- */
const COLORS = {
  dark_primary: "#101010",
  dark_secondary: "#1A1A1A",
  dark_tertiary: "#373737",
  dark_accents: "#F26C4F",
  dark_subaccents: "#C5C5C5",
  dark_senary: "#808080",
  dark_icon_text: "#F26C4F",

  light_primary: "#F26C4F",
  light_secondary: "#FFFFFF",
  light_tertiary: "#CCCCCC",
  light_accents: "#101010",
  light_subaccents: "#373737",
  light_senary: "#E8A87C",
  light_icon_text: "#101010",
};

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

    if (hasError) return;

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
      <SafeAreaView style={s.screen}>
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* ---------- header ---------- */}
          <View style={s.headerBlock}>
            <Text style={s.title}>Reset{"\n"}Password</Text>
            <Text style={s.subtitle}>
              input your username, phone number, or email
            </Text>
          </View>

          {/* ---------- form ---------- */}
          <View style={s.form}>
            <TextInput
              style={{
                backgroundColor: COLORS.dark_secondary,
                borderRadius: 8,
                padding: 12,
                color: COLORS.dark_subaccents,
                fontSize: 18,
                textAlign: "left",
                letterSpacing: 0,
                marginBottom: 16,
              }}
              placeholder="Username or Email"
              placeholderTextColor={COLORS.dark_senary}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor={COLORS.dark_senary}
              secureTextEntry
              value={pwd}
              onChangeText={(text) => {
                setPwd(text);
                if (text) setPwdError(false);
              }}
              style={[s.input, pwdError ? s.inputBackgroundError : null]}
            />

            <TextInput
              placeholder="Confirm password"
              placeholderTextColor={COLORS.dark_senary}
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
          <TouchableOpacity style={s.nextBtn} onPress={handleNext}>
            <Text style={s.nextTxt}>Next ›</Text>
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
    backgroundColor: COLORS.dark_primary,
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
    color: COLORS.light_secondary,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.dark_senary,
  },

  form: {
    gap: 16,
  },

  input: {
    backgroundColor: COLORS.dark_secondary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.light_secondary,
  },

  inputBackgroundError: {
    backgroundColor: "#450a0a", // Darker shade of red (Firebrick)
  },

  nextBtn: {
    alignSelf: "center",
    backgroundColor: COLORS.dark_accents,
    borderRadius: 12,
    paddingHorizontal: 64,
    paddingVertical: 14,
    marginTop: 24,
  },

  nextTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.light_secondary,
  },
});
