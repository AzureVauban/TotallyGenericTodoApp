import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const COLORS = {
  //  Dark theme palette (left UI) with original hex codes:
  dark_primary: "#101010",
  dark_secondary: "#1A1A1A",
  dark_tertiary: "#373737",
  dark_accents: "#F26C4F",
  dark_subaccents: "#C5C5C5",

  // Light theme palette (right UI) with original hex codes:
  light_primary: "#E76F51",
  light_secondary: "#F4A261",
  light_tertiary: "#E9C46A",
  light_accents: "#2A9D8F",
  light_subaccents: "#264653",
};

const styles = StyleSheet.create({
  screenbackground: {
    flex: 1,
    backgroundColor: COLORS.dark_primary,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.dark_accents,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.dark_subaccents,
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.dark_secondary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 320,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.dark_subaccents,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default function verifyPhone() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screenbackground}>
      <View style={styles.container}>
        <Text style={styles.title}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>
          Please enter your phone number to receive a verification code.
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Send Verification Code</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: COLORS.dark_tertiary, marginTop: 12 },
          ]}
          onPress={() => router.push("/inputCode")}
        >
          <Text style={styles.buttonText}>Input Code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
