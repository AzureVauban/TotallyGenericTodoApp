/**
 * NotFoundScreen displays a themed 404 error screen.
 * Shows a "Go Back" button that returns the user to the previous screen.
 * Styles adapt based on light or dark mode using the system color scheme.
 */
import { colors } from "@theme/colors";
import { useRouter } from "expo-router";
import { useTheme } from "lib/ThemeContext";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: themeColors.background,
          },
        ]}
      >
        <Text style={[styles.title, { color: themeColors.text }]}>404</Text>
        <Text style={[styles.subtitle, { color: themeColors.text }]}>
          Page Not Found
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: themeColors.redbutton_background,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { color: themeColors.redbutton_text_icon },
            ]}
          >
            Go Back
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 96,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 32,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
