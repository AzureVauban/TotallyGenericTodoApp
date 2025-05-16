/**
 * Flagged Screen
 *
 * Shows every task that has been marked “flagged” and not deleted.
 */
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useTasks } from "../../../backend/storage/TasksContext";
import { colors } from "@theme/colors";
import { useTheme } from "../../theme/ThemeContext";
// …
export default function FlaggedTasks() {
  const { tasks } = useTasks();
  const { theme: themeMode } = useTheme();
  const isDark = themeMode === "dark";
  const flaggedTasks = tasks.filter((t) => !!t.flagged);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? colors.dark.background
            : colors.light.background,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: isDark
              ? colors.dark.bluebutton_background
              : colors.light.bluebutton_background,
          },
        ]}
      >
        Flagged
      </Text>
      <FlatList
        data={flaggedTasks}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{
          backgroundColor: isDark
            ? colors.dark.background
            : colors.light.background,
        }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.item,
              {
                backgroundColor: isDark
                  ? colors.dark.accent
                  : colors.light.accent,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                { color: isDark ? colors.dark.text : colors.light.text },
              ]}
            >
              {item.title}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.dark.primary },
  title: {
    fontSize: 24,
    color: colors.light.accent,
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  item: {
    backgroundColor: colors.dark.secondary,
    padding: 15,
    marginBottom: 6,
    borderRadius: 8,
  },
  text: { color: colors.dark.text, fontSize: 16 },
  completedText: {
    color: colors.dark.tertiary,
    textDecorationLine: "line-through",
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.tertiary,
    marginVertical: 10,
    width: "100%",
  },
  inlineButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    alignSelf: "stretch",
    paddingVertical: 15,
    marginBottom: 6,
    borderRadius: 8,
  },
});
