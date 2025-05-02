import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, Text, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

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
export default function LoginScreen() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isUserLoggedIn) {
      router.replace("/home");
    }
  }, [isUserLoggedIn, router]);

  // Shared button style so both buttons have the same width.
  const sharedButtonStyle: ViewStyle = {
    width: 250, // Adjust the width as needed
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        style={{
          width: 200,
          height: 200,
          marginBottom: 40,
          marginTop: -80,
        }}
        source={require("../assets/images/test6.png")}
      />
      <TouchableOpacity
        style={{
          ...sharedButtonStyle,
          backgroundColor: "#007aff",
          marginBottom: 12,
        }}
        onPress={() => {
          console.log("USER LOGGED IN");
          setIsUserLoggedIn(true);
        }}
      >
        <Text style={{ color: "#bae6fd", fontSize: 16 }}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...sharedButtonStyle,
          backgroundColor: "#4da6ff",
        }}
        onPress={() => router.push("/signup")}
      >
        <Text style={{ color: "#bae6fd", fontSize: 16 }}>
          Create an Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}
