import React from "react";
import { Slot, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TasksProvider } from "../backend/storage/TasksContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
