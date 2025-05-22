<<<<<<< HEAD
import Auth from "./Auth";
=======
/**
 * Root layout of the application.
 * Wraps the app in required providers: GestureHandler, Theme, and Tasks context.
 * Uses a Stack navigator with gesture-based horizontal screen transitions.
 */
>>>>>>> develop
import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TasksProvider } from "../backend/storage/TasksContext";
import { ThemeProvider } from "@theme/ThemeContext";

export default function RootLayout() {
  console.log(`Current file name: _layout()`);
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
