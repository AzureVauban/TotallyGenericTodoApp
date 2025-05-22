/**
 * Root layout of the application.
 * Wraps the app in required providers: GestureHandler, Theme, and Tasks context.
 * Uses a Stack navigator with gesture-based horizontal screen transitions.
 */
import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TasksProvider } from "../backend/storage/TasksContext";
import { ThemeProvider } from "@theme/ThemeContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <TasksProvider>
          <Stack
            screenOptions={{
              gestureEnabled: true,
              gestureDirection: "horizontal",
              headerShown: false,
            }}
          >
            <Stack.Screen name="home" options={{ headerShown: false }} />
          </Stack>
        </TasksProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
