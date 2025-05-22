import Auth from "./authentication/auth";
import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TasksProvider } from "../backend/storage/TasksContext";
import { ThemeProvider } from "@theme/ThemeContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  console.log(`Current file name: _layout()`);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden />
      <Auth>
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
      </Auth>
    </GestureHandlerRootView>
  );
}
