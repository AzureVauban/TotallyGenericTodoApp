import { playInvalidSound } from "../utils/playInvalidSound";
import { colors } from "@theme/colors";
import React, { useState, useEffect } from "react";
import { generateUsername } from "../utils/generateUsername";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextInput,
  TextStyle,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";

const styles = StyleSheet.create({
  screenbackground: {
    flex: 1,
    // backgroundColor and color will be set via isDark in component
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor will be set via isDark in component
  },
  content: {
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    // color will be set via isDark in component
  },
  subtitle: {
    fontSize: 16,
    // color will be set via isDark in component
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    // backgroundColor will be set via isDark in component
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    // color will be set via isDark in component
    fontWeight: "bold",
  },
  buttonSecondary: {
    backgroundColor: colors.dark.secondary,
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
    color: colors.dark.secondary,
    backgroundColor: colors.dark.secondary,
  },
});

/**
 * **SignUpScreen**
 *
 * Presents the four‑field sign‑up form (username, password, email, phone) and a
 * single **“Signup & Login”** button.  Field‑level validation colours the
 * background `#450a0a` when invalid.
 *
 * ### Interaction
 * * **Swipe → Back** – A right‑swipe (> 50 px) handled by
 *   `PanGestureHandler` navigates to the previous screen.
 * * **Signup & Login** – When all four inputs are non‑empty and *email* / *phone*
 *   match their regex patterns, calls `router.replace("/verificationMethod")`.
 *
 * ### State
 * * `username`, `password`, `email`, `phone` – controlled text inputs.
 * * `*_Valid` booleans – toggle per‑field background colour.
 *
 * ### Visuals
 * * A centred logo (`../assets/images/test5.png`) sits above the form.
 * * Shared button styles (`sharedButtonStyle`) ensure uniform width.
 *
 * @returns A `PanGestureHandler`‑wrapped `View` containing the sign‑up form.
 */

export default function SignUpScreen() {
  console.log(`Current file name: registerAccount`);

  const router = useRouter();
  const navigation = useNavigation();

  const { theme } = useTheme();
  const isDark = theme === "dark";
  useFocusEffect(React.useCallback(() => {}, [theme]));

  const handleSwipe = ({ nativeEvent }) => {
    if (nativeEvent.translationX > 50) {
      navigation.goBack();
    }
  };

  // Shared button style so both buttons have the same width.
  const sharedButtonStyle: TextStyle = {
    width: 250,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  };

  const [username, setUsername] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  useEffect(() => {
    const generated = generateUsername();
    setUsername(generated);
    setInitialUsername(generated);
  }, []);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [usernameValid, setUsernameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) => /^\d{10,15}$/.test(phone); // adjust pattern if needed

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
          <View
            style={{ alignItems: "center", marginTop: 150, marginBottom: 32 }}
          >
            <Text
              style={[
                styles.title,
                { color: isDark ? colors.light.accent : colors.dark.accent },
              ]}
            >
              Register
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? colors.light.text : colors.dark.text },
              ]}
            >
              Create your account
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: 16 }}>
            {/* Username */}
            <TextInput
              style={[
                sharedButtonStyle,
                {
                  fontWeight: "700",
                  backgroundColor: usernameValid
                    ? isDark
                      ? colors.light.primary
                      : colors.dark.primary
                    : "#450a0a",
                  color:
                    username === initialUsername
                      ? isDark
                        ? colors.light.yellowbutton_text_icon
                        : colors.dark.yellowbutton_text_icon
                      : isDark
                      ? colors.light.text
                      : colors.dark.text,
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
                backgroundColor: isDark
                  ? colors.light.tertiary
                  : colors.dark.tertiary,
              }}
            />

            {/* Password */}
            <TextInput
              style={[
                sharedButtonStyle,
                {
                  fontWeight: "700",
                  backgroundColor: passwordValid
                    ? isDark
                      ? colors.light.primary
                      : colors.dark.primary
                    : "#450a0a",
                  color: isDark ? colors.light.text : colors.dark.text,
                },
              ]}
              placeholder="Password"
              placeholderTextColor={
                isDark ? colors.light.text : colors.dark.text
              }
              secureTextEntry
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setPasswordValid(true);
              }}
            />
            <View
              style={{
                height: 1,
                backgroundColor: isDark
                  ? colors.light.tertiary
                  : colors.dark.tertiary,
              }}
            />

            {/* Email */}
            <TextInput
              style={[
                sharedButtonStyle,
                {
                  fontWeight: "700",
                  backgroundColor: emailValid
                    ? isDark
                      ? colors.light.primary
                      : colors.dark.primary
                    : "#450a0a",
                  color: isDark ? colors.light.text : colors.dark.text,
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
                backgroundColor: isDark
                  ? colors.light.tertiary
                  : colors.dark.tertiary,
              }}
            />

            {/* Phone */}
            <TextInput
              style={[
                sharedButtonStyle,
                {
                  fontWeight: "700",
                  backgroundColor: phoneValid
                    ? isDark
                      ? colors.light.primary
                      : colors.dark.primary
                    : "#450a0a",
                  color: isDark ? colors.light.text : colors.dark.text,
                },
              ]}
              placeholder="Phone Number"
              placeholderTextColor={
                isDark ? colors.light.text : colors.dark.text
              }
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                setPhoneValid(true);
              }}
              onBlur={() => setPhoneValid(validatePhone(phone))}
            />
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[
              sharedButtonStyle as ViewStyle,
              {
                backgroundColor: isDark
                  ? colors.light.purplebutton_background
                  : colors.dark.purplebutton_background,
                alignSelf: "center",
                marginTop: 20,
              },
            ]}
            onPress={() => {
              const isEmailValid = validateEmail(email);
              const isPhoneValid = validatePhone(phone);
              const isUsernameValid = username.trim().length > 0;
              const isPasswordValid = password.trim().length > 0;

              setEmailValid(isEmailValid);
              setPhoneValid(isPhoneValid);
              setUsernameValid(isUsernameValid);
              setPasswordValid(isPasswordValid);

              if (
                isEmailValid &&
                isPhoneValid &&
                isUsernameValid &&
                isPasswordValid
              ) {
                // Registration logic removed; just show alert for now.
                alert("Registration failed. Please try again.");
              } else {
                playInvalidSound();
              }
            }}
          >
            <Text
              style={{
                color: isDark
                  ? colors.light.purplebutton_text_icon
                  : colors.dark.purplebutton_text_icon,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Register Account
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              sharedButtonStyle as ViewStyle,
              {
                backgroundColor: isDark
                  ? colors.light.bluebutton_background
                  : colors.dark.bluebutton_background,
                alignSelf: "center",
                marginTop: 10,
              },
            ]}
            onPress={() => {
              const newGeneratedUsername = generateUsername();
              setUsername(newGeneratedUsername);
              setInitialUsername(newGeneratedUsername);
            }}
          >
            <Text
              style={{
                color: isDark
                  ? colors.light.bluebutton_text_icon
                  : colors.dark.bluebutton_text_icon,
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Generate Username
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </PanGestureHandler>
  );
}
