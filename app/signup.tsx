import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextInput,
  TextStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const COLORS = {
  //  Dark theme palette (left UI) with original hex codes:
  dark_primary: "#101010", // #101010
  dark_secondary: "#1A1A1A", // #1A1A1A
  dark_tertiary: "#373737", // #373737
  dark_accents: "#F26C4F", // #F26C4F
  dark_subaccents: "#C5C5C5", // #C5C5C5
  dark_senary: "#808080", // #808080
  dark_icon_text: "#F26C4F", // #F26C4F

  // Light theme palette (right UI) with original hex codes:
  light_primary: "#F26C4F", // #F26C4F
  light_secondary: "#FFFFFF", // #FFFFFF
  light_tertiary: "#CCCCCC", // #CCCCCC
  light_accents: "#101010", // #101010
  light_subaccents: "#373737", // #373737
  light_senary: "#E8A87C", // #E8A87C
  light_icon_text: "#101010", // #101010
};
const styles = StyleSheet.create({
  screenbackground: {
    flex: 1,
    backgroundColor: COLORS.dark_primary,
    color: COLORS.dark_primary,
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
    color: COLORS.dark_subaccents,
  },
  subtitle: {
    fontSize: 16,
    color: "#C6C6D0",
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: " #D59D80",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#C6C6D0",
    fontWeight: "bold",
  },
  buttonSecondary: {
    backgroundColor: " #104C64",
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
    color: " #D59D80",
    backgroundColor: " #D59D80",
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
  const router = useRouter();
  const navigation = useNavigation();

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
      <View style={styles.screenbackground}>
        <Image
          style={{
            width: 200,
            height: 200,
            marginBottom: 40,
            marginTop: -80,
          }}
          source={require("../assets/images/test5.png")}
        />

        <TextInput
          style={[
            sharedButtonStyle,
            {
              backgroundColor: usernameValid ? "#1A1A1A" : "#450a0a",
              color: "#fff",
              marginBottom: 12,
            },
          ]}
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setUsernameValid(true);
          }}
        />

        <TextInput
          style={[
            sharedButtonStyle,
            {
              backgroundColor: passwordValid ? "#1A1A1A" : "#450a0a",
              color: "#fff",
              marginBottom: 12,
            },
          ]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordValid(true);
          }}
        />

        <TextInput
          style={[
            sharedButtonStyle,
            {
              backgroundColor: emailValid ? "#1A1A1A" : "#450a0a",
              color: "#fff",
              marginBottom: 12,
            },
          ]}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailValid(true);
          }}
          onBlur={() => setEmailValid(validateEmail(email))}
        />

        <TextInput
          style={[
            sharedButtonStyle,
            {
              backgroundColor: phoneValid ? "#1A1A1A" : "#450a0a",
              color: "#fff",
              marginBottom: 12,
            },
          ]}
          placeholder="Phone Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            setPhoneValid(true);
          }}
          onBlur={() => setPhoneValid(validatePhone(phone))}
        />

        <TouchableOpacity
          style={[
            sharedButtonStyle as ViewStyle,
            {
              backgroundColor: "#F26C4F",
              marginBottom: 12,
              alignItems: "center", // This ensures the text is centered
              justifyContent: "center",
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
              console.log("Navigating to verificationMethod");
              router.replace("/verificationMethod");
            }
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>
            Signup & Login
          </Text>
        </TouchableOpacity>
      </View>
    </PanGestureHandler>
  );
}
