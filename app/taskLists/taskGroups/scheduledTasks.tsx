import { colors } from "@theme/colors";
import { useTheme } from "@theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
/**
 * Scheduled Screen
 *
 * Shows all non-deleted tasks that have any `scheduleDate` set.
 */

import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Pressable } from "react-native";
import FiBrtrash from "../../../assets/icons/svg/fi-br-trash.svg";
import {
  useTasks,
  Task as ContextTask,
} from "../../../backend/storage/TasksContext";
// Local TaskItem shape
interface TaskItem {
  id: string;
  text: string;
  scheduleDate?: string;
  recentlyDeleted?: boolean;
  listName: string;
}

export default function ScheduledTasks() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  useFocusEffect(
    React.useCallback(() => {
      // no-op, but ensures re-render on theme change
    }, [theme])
  );
  const { tasks, removeTask } = useTasks();
  const today = new Date();
  const visibleTasks = tasks.filter((t) => {
    if (t.recentlyDeleted) return false;
    if (!t.scheduleDate) return false;
    const sd = new Date(t.scheduleDate);
    return (
      sd.getFullYear() === today.getFullYear() &&
      sd.getMonth() === today.getMonth() &&
      sd.getDate() === today.getDate()
    );
  });

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
          { color: isDark ? colors.dark.accent : colors.light.accent },
        ]}
      >
        Scheduled Tasks
      </Text>
      <View style={styles.divider} />
      <FlatList
        data={visibleTasks}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                  style={[
                    styles.inlineButton,
                    { backgroundColor: colors.dark.accent },
                  ]}
                  onPress={() => removeTask(item.id)}
                >
                  <FiBrtrash
                    width={20}
                    height={20}
                    fill={colors.light.secondary}
                  />
                </Pressable>
              </View>
            )}
          >
            <View
              style={[
                styles.item,
                {
                  backgroundColor: isDark
                    ? colors.dark.secondary
                    : colors.light.secondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.text,
                  { color: isDark ? colors.dark.text : colors.light.text },
                  item.completed && styles.completedText,
                ]}
              >
                {item.title}
              </Text>
            </View>
          </Swipeable>
        )}
        contentContainerStyle={{
          backgroundColor: isDark
            ? colors.dark.background
            : colors.light.background,
        }}
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
