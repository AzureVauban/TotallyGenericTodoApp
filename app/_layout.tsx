import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "lib/ThemeContext";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TasksProvider } from "../backend/storage/TasksContext";
import { SettingsProvider } from "../lib/SettingsContext";
import Auth from "./authentication/auth";

export default function RootLayout() {
  console.log("RootLayout rendered");
  return (
    <Auth>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar hidden />
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
      </GestureHandlerRootView>
    </Auth>
  );
}
