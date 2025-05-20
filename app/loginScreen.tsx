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
import { styles } from "@theme/styles";

export default function LoginScreen() {
  console.log(`Current file name: loginScreen`);
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
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
        },
        {
          backgroundColor: isDark
            ? colors.dark.background
            : colors.light.background,
        },
      ]}
    >
      <View
        style={[
          styles.content,
          {
            width: "100%",
            maxWidth: 380,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 32,
            paddingHorizontal: 24,
            borderRadius: 12,
          },
        ]}
      >
        <MemberListIcon
          width={48}
          height={48}
          style={[
            styles.icon,
            {
              marginBottom: 28,
              alignSelf: "center",
            },
          ]}
          fill={isDark ? colors.dark.icon : colors.light.icon}
        />
        <Text
          style={[
            styles.title,
            {
              fontSize: 28,
              fontWeight: "bold",
              marginBottom: 8,
              textAlign: "center",
              letterSpacing: 0.5,
              color: isDark ? colors.dark.text : colors.light.text,
            },
          ]}
        >
          Sign In
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              fontSize: 16,
              marginBottom: 28,
              textAlign: "center",
              color: isDark ? colors.dark.text : colors.light.text,
              fontWeight: "500",
              letterSpacing: 0.1,
            },
          ]}
        >
          Login to your account
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              width: "100%",
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 8,
              fontSize: 16,
              marginBottom: 18,
              color: isDark ? colors.dark.text : colors.light.text,
              backgroundColor: isDark
                ? colors.dark.background
                : colors.light.background,
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
            backgroundColor: isDark
              ? colors.dark.secondary
              : colors.light.secondary,
            marginVertical: 10,
          }}
        />
        <TextInput
          style={[
            styles.input,
            {
              width: "100%",
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 8,
              fontSize: 16,
              marginBottom: 18,
              color: isDark ? colors.dark.text : colors.light.text,
              backgroundColor: isDark
                ? colors.dark.background
                : colors.light.background,
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
              width: "100%",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
              marginTop: 12,
              marginBottom: 4,
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
                fontSize: 18,
                fontWeight: "700",
                letterSpacing: 0.5,
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
              {
                marginTop: 18,
                textAlign: "center",
                textDecorationLine: "underline",
                fontSize: 14,
                fontWeight: "500",
                color: isDark ? colors.dark.accent : colors.light.accent,
              },
            ]}
          >
            Forgot your password? Reset it here
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
