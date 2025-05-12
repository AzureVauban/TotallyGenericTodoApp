import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";
import { TasksProvider } from "../context/TasksContext";

/**
 * Root layout component for Expo Router navigation.
 *
 * This file establishes the overall structure for the mobile application by rendering
 * a higher-level layout component (in this case, "Stack"). It acts as the base component
 * upon which other UI elements, components, or pages are layered.
 *
 * Conceptually, this file serves as the entry point for the app's structure, akin to a
 * directory or map that outlines the overarching layout and navigation patterns.
 *
 * @component
 */

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      console.log("DETECTED PLATFORM IS ANDROID");
      // Or to make it transparent:
      // NavigationBar.setBackgroundColorAsync("transparent");
      // NavigationBar.setButtonStyleAsync("light");
    }
  }, []);
  return (
    <TasksProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            gestureEnabled: true, // enables swipe gestures
            gestureDirection: "horizontal", // swipe right/left
            headerShown: false, // hides the header
            contentStyle: { backgroundColor: "#eef2ff" }, // background color for the content
          }}
        />
      </GestureHandlerRootView>
    </TasksProvider>
  );
}
