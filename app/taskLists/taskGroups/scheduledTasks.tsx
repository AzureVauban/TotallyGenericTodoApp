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
import { styles } from "../../theme/styles";

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
  const { tasks, removeTask, exportDataAsJSON } = useTasks();
  useFocusEffect(
    React.useCallback(() => {
      exportDataAsJSON();
      // no-op, but ensures re-render on theme change
    }, [theme])
  );
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
          styles.listTitle,
          {
            color: isDark
              ? colors.dark.bluebutton_background
              : colors.light.bluebutton_background,
            textAlign: "center",
          },
        ]}
      >
        {"Scheduled Tasks"}
      </Text>
      <View
        style={[
          styles.divider,
          {
            backgroundColor: isDark
              ? colors.dark.tertiary
              : colors.light.tertiary,
          },
        ]}
      />
      <FlatList
        data={visibleTasks}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                  style={[styles.inlineButton, { backgroundColor: "#7f1d1d" }]}
                  onPress={() => {
                    removeTask(item.id);
                    exportDataAsJSON();
                  }}
                >
                  <FiBrtrash width={20} height={20} fill="#fecaca" />
                </Pressable>
              </View>
            )}
          >
            <View
              style={[
                styles.taskItem,
                // Use only styles from styles.ts for taskItem, indentedTask
                item.completed
                  ? { backgroundColor: colors.dark.secondary }
                  : item.buttonColor
                  ? { backgroundColor: item.buttonColor }
                  : {
                      backgroundColor: isDark
                        ? colors.dark.primary
                        : colors.light.accent,
                    },
              ]}
            >
              <Text
                style={[
                  styles.taskText,
                  item.completed
                    ? styles.completedText
                    : {
                        color: isDark ? colors.dark.text : colors.dark.primary,
                      },
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
