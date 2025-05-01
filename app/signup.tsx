import React from "react";
import { View, Image, TouchableOpacity, Text, ViewStyle } from "react-native";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const router = useRouter();

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
        source={require("../assets/images/test5.png")}
      />

      <TouchableOpacity
        style={{
          ...sharedButtonStyle,
          backgroundColor: "#007aff",
          marginBottom: 12,
        }}
        onPress={() => {
          console.log("Navigating to home");
          router.replace("/home");
        }}
      >
        <Text style={{ color: "#bae6fd", fontSize: 16 }}>Signup & Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          ...sharedButtonStyle,
          backgroundColor: "#dc2626",
        }}
        onPress={() => router.replace("/login")}
      >
        <Text style={{ color: "#fecaca", fontSize: 16 }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}
