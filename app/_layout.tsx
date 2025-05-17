import Auth from "./Auth";
import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TasksProvider } from "../backend/storage/TasksContext";
import { ThemeProvider } from "@theme/ThemeContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Auth>
        <ThemeProvider>
          <TasksProvider>
            <Stack
              screenOptions={{
                gestureEnabled: true,
                gestureDirection: "horizontal",
                headerShown: false,
              }}
            >
              {/* add other screens here as needed */}
            </Stack>
          </TasksProvider>
        </ThemeProvider>
      </Auth>
    </GestureHandlerRootView>
  );
}
