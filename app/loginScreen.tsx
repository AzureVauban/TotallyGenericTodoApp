import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MemberListIcon from "../assets/icons/svg/fi-br-member-list.svg";
import { useRouter } from "expo-router";
import { colors } from "@theme/colors";
import { useTheme } from "@theme/ThemeContext";

export default function LoginScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <View
      style={[
        styles.screenbackground,
        {
          backgroundColor: isDark
            ? colors.dark.background
            : colors.light.background,
        },
      ]}
    >
      <View style={styles.content}>
        <MemberListIcon
          width={48}
          height={48}
          style={styles.icon}
          fill={isDark ? colors.dark.icon : colors.light.icon}
        />
        <Text
          style={[
            styles.title,
            { color: isDark ? colors.dark.text : colors.light.text },
          ]}
        >
          Sign In
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isDark ? colors.dark.text : colors.light.text },
          ]}
        >
          Login to your account
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? colors.dark.background : colors.light.background,
              color: isDark ? colors.dark.text : colors.light.text,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 0,
              fontSize: 16,
              marginBottom: 18,
            },
          ]}
          placeholder="Username"
          placeholderTextColor={isDark ? colors.dark.icon : colors.light.icon}
          value={username}
          onChangeText={setUsername}
        />
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: isDark ? colors.dark.secondary : colors.light.secondary,
            marginVertical: 10,
          }}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? colors.dark.background : colors.light.background,
              color: isDark ? colors.dark.text : colors.light.text,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 0,
              fontSize: 16,
              marginBottom: 18,
            },
          ]}
          placeholder="Password"
          placeholderTextColor={isDark ? colors.dark.icon : colors.light.icon}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isDark
                ? colors.dark.purplebutton_background
                : colors.light.purplebutton_background,
            },
          ]}
          onPress={() => console.log("Sign In pressed")}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: isDark
                  ? colors.dark.purplebutton_text_icon
                  : colors.light.purplebutton_text_icon,
              },
            ]}
          >
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/resetPassword")}>
          <Text
            style={[
              styles.forgot,
              { color: isDark ? colors.dark.accent : colors.light.accent },
            ]}
          >
            Forgot your password? Reset it here
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenbackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  content: {
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 12,
    // Optionally add shadow
  },
  icon: {
    marginBottom: 28,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 28,
    textAlign: "center",
    color: "#7A7A7A",
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 18,
    color: "#000",
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 4,
    // backgroundColor set inline for theme
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#fff",
  },
  forgot: {
    marginTop: 18,
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 14,
    fontWeight: "500",
  },
});
