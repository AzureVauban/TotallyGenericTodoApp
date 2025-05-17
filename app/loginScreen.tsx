import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MemberListIcon from "../assets/icons/svg/fi-br-member-list.svg";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "expo-router";
import { colors } from "@theme/colors";
import { useTheme } from "@theme/ThemeContext";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { theme } = useTheme();

  /** Validate username & password against Supabase **/
  const handleSignIn = async () => {
    if (!username || !password) {
      console.warn("Username and password are required");
      return;
    }
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();
    if (error || !user) {
      console.warn("Invalid username or password");
      return;
    }
    router.push("/home");
  };

  return (
    <View style={styles.container}>
      <MemberListIcon width={32} height={32} style={styles.icon} />
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.description}>login to your account</Text>

      <TextInput
        style={[styles.input, { borderColor: colors[theme].tertiary }]}
        placeholder="Username"
        placeholderTextColor={colors[theme].secondary}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, { borderColor: colors[theme].tertiary }]}
        placeholder="Password"
        placeholderTextColor={colors[theme].secondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors[theme].primary }]}
        onPress={handleSignIn}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/resetPassword")}>
        <Text style={[styles.forgot]}>Forgot your password? Reset it here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
