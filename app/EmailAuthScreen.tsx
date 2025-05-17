import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native";
import { supabase } from "../lib/supabaseClient";
import { useTheme } from "@theme/ThemeContext";
import { useRouter } from "expo-router";
import { colors } from "@theme/colors";

const styles = StyleSheet.create({
  screenbackground: {
    flex: 1,
    backgroundColor: colors.dark.primary,
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
    color: colors.dark.accent,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark.text,
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.dark.secondary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 320,
    elevation: 2,
    marginTop: 16,
  },
  buttonText: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: colors.dark.text,
    backgroundColor: "#222",
  },
});

export default function EmailAuthScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [email, setEmail] = useState("");

  const sendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      Alert.alert("Error sending OTP", error.message);
    } else {
      Alert.alert("OTP sent", "Please check your email for the code.");
      router.replace("/inputCode");
    }
  };

  return (
    <SafeAreaView style={[styles.screenbackground, { backgroundColor: isDark ? colors.dark.background : colors.light.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDark ? colors.dark.accent : colors.light.accent }]}>Verify Your Email</Text>
        <Text style={[styles.subtitle, { color: isDark ? colors.dark.text : colors.light.text }]}>
          Enter your email to receive a one-time code.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        <TouchableOpacity style={styles.button} onPress={sendOtp}>
          <Text style={[styles.buttonText, { color: isDark ? colors.dark.text : colors.light.text }]}>
            Send Verification Code
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
