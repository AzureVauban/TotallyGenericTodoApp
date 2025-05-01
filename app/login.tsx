import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, Text, ViewStyle } from "react-native";
import { useRouter } from "expo-router";

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
