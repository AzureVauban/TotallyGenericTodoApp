import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ViewStyle,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Link } from "@react-navigation/native";
import FISignatureIcon from "../assets/icons/svg/fi-br-chart-scatter-3d.svg";
const SCREEN_WIDTH = Dimensions.get("window").width;
const BUTTON_WIDTH = SCREEN_WIDTH * 0.7;

/*
  Dark theme palette (left UI) with original hex codes:
    dark_primary:    #101010
    dark_secondary:  #1A1A1A
    dark_tertiary:   #373737
    dark_accents:    #F26C4F
    dark_subaccents: #C5C5C5
    dark_senary:     #808080
    dark_icon_text:  #F26C4F

  Light theme palette (right UI) with original hex codes:
    light_primary:   #F26C4F
    light_secondary: #FFFFFF
    light_tertiary:  #CCCCCC
    light_accents:   #101010
    light_subaccents:#373737
    light_senary:    #E8A87C
    light_icon_text: #101010
*/
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
    color: COLORS.dark_senary,
    marginBottom: 20,
  },
  linktext: {
    fontSize: 16,
    color: COLORS.dark_senary,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: COLORS.dark_accents,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    // width removed
  },
  buttonText: {
    color: COLORS.dark_secondary,
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
export default function LoginScreen() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const router = useRouter();
  // Helper to compute the complementary color of a hex code
  const getComplement = (hex: string): string => {
    // Remove the hash if it exists
    hex = hex.replace("#", "");
    // Parse the red, green, blue components
    const r = 255 - parseInt(hex.substring(0, 2), 16);
    const g = 255 - parseInt(hex.substring(2, 4), 16);
    const b = 255 - parseInt(hex.substring(4, 6), 16);

    // Convert the components back to hex, ensuring 2 digits for each
    const rHex = r.toString(16).padStart(2, "0");
    const gHex = g.toString(16).padStart(2, "0");
    const bHex = b.toString(16).padStart(2, "0");
    return `#${rHex}${gHex}${bHex}`;
  };
  useEffect(() => {
    if (isUserLoggedIn) {
      router.replace("/home");
    }
  }, [isUserLoggedIn, router]);

  // Shared button style so both buttons have the same width.

  return (
    <View style={styles.screenbackground}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 150,
        }}
      >
        <FISignatureIcon
          style={styles.icon}
          width={300}
          height={300}
          fill={COLORS.dark_accents}
        />
        <Text
          style={[
            styles.title,
            {
              /* NONE */
            },
          ]}
        >
          Welcome to{" "}
          <Text style={{ color: getComplement(COLORS.dark_accents) }}>
            Divide
          </Text>
          &
          <Text style={{ color: COLORS.dark_accents, fontWeight: "bold" }}>
            Do
          </Text>
          !
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              paddingBottom: 50,
              /* NONE */
            },
          ]}
        >
          Compete with your friends to be the best!
        </Text>
        <TouchableOpacity
          style={[styles.button, { flexDirection: "row", width: BUTTON_WIDTH }]}
          onPress={() => {
            console.log("USER LOGGED IN");
            setIsUserLoggedIn(true);
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Login with Email
          </Text>
        </TouchableOpacity>
        {/* Reset password button */}
        <TouchableOpacity
          style={[
            styles.buttonSecondary,
            { flexDirection: "row", width: BUTTON_WIDTH, marginBottom: 20 },
          ]}
          onPress={() => {
            console.log("User pressed reset password");
            router.push("/resetPassword");
          }}
        >
          <Text style={{ color: COLORS.dark_subaccents, fontWeight: "600" }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[styles.subtitle, { fontWeight: "500" }]}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              console.log("User pressed signup");
              router.push("/signup");
            }}
          >
            <Text style={[styles.linktext]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
