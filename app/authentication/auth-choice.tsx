import React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { colors } from "@theme/colors";
import { useTheme } from "lib/ThemeContext";

import MemberListIcon from "../../assets/icons/svg/fi-br-member-list.svg";
import { supabase } from "../../lib/supabaseClient";

const AuthChoiceScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const { username, email, password } = params;

  // These values can be used for verification methods
  // console.log(username, email, password);

  return (
    <View
      style={[
        register_styles.container,
        { backgroundColor: colors[theme].background },
      ]}
    >
      <MemberListIcon width={32} height={32} style={register_styles.icon} />
      <Text style={[register_styles.title, { color: colors[theme].text }]}>
        Choose Verification Method
      </Text>
      <TouchableOpacity
        style={[
          register_styles.button,
          { backgroundColor: colors[theme].primary },
        ]}
        onPress={async () => {
          // Send magic link
          const { data, error } = await supabase.auth.signInWithOtp({
            email: email as string,
            options: {
              // Set display_name in user_metadata for auth.users
              data: { display_name: username },
            },
          });
          if (error) {
            console.warn("Magic link error:", error.message);
          } else {
            // Set display_name in profiles table for this email
            const { error: updateError } = await supabase
              .from("profiles")
              .update({ display_name: username })
              .eq("email", email);
            if (updateError) {
              console.warn("Failed to set display name:", updateError.message);
            } else {
              console.log("Display name set for:", email);
            }
            console.log("Magic link sent to:", email);
            //!router.push("/verify");
          }
        }}
      >
        <Text
          style={[
            register_styles.buttonText,
            { color: colors[theme].background },
          ]}
        >
          Magical Link
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          register_styles.button,
          { backgroundColor: colors[theme].primary },
        ]}
        onPress={() => {
          console.warn("NOT IMPLEMENTED");
          router.push("/notfound");
        }}
      >
        <Text
          style={[
            register_styles.buttonText,
            { color: colors[theme].background },
          ]}
        >
          OTP (One Time Password)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const register_styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  icon: {
    marginBottom: 16,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    color: "#000",
    letterSpacing: 0,
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  forgot: {
    marginTop: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  inputBackgroundError: {
    backgroundColor: "#7f1d1d",
  },
});

export default AuthChoiceScreen;
