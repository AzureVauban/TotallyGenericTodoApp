import Auth from "./authentication/auth";
import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TasksProvider } from "../backend/storage/TasksContext";
import { ThemeProvider } from "lib/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { SettingsProvider } from "../lib/SettingsContext";

export default function RootLayout() {
  console.log(`Current file name: _layout()`);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden />
      <Auth>
        <SettingsProvider>
          <ThemeProvider>
            <TasksProvider>
              <Stack
                screenOptions={{
                  gestureEnabled: true,
                  gestureDirection: "horizontal",
                  headerShown: false,
                }}
              ></Stack>
            </TasksProvider>
          </ThemeProvider>
        </SettingsProvider>
      </Auth>
    </GestureHandlerRootView>
  );
}
