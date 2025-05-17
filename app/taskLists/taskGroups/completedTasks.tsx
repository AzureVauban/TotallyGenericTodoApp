/**
 * Completed Screen
 *
 * Shows every task marked done (and not deleted).
 */
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
// import { useTasks } from "../../../backend/storage/TasksContext";

import Swipeable from "react-native-gesture-handler/Swipeable";
import { Pressable } from "react-native";
import FiBrtrash from "../../../assets/icons/svg/fi-br-trash.svg";
import { useTasks } from "../../../backend/storage/TasksContext";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "@theme/colors";
import { useTheme } from "../../theme/ThemeContext";
// Local TaskItem shape
interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  recentlyDeleted?: boolean;
  listName: string;
}

export default function AllTasks() {
  const { tasks, removeTask, exportDataAsJSON } = useTasks();
  const { theme: themeMode } = useTheme();
  const isDark = themeMode === "dark";
  const visibleTasks = tasks.filter((t) => t.completed && !t.recentlyDeleted);

  useFocusEffect(
    React.useCallback(() => {
      exportDataAsJSON();
    }, [themeMode])
  );

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
        Completed Tasks
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "stretch",
                  alignSelf: "stretch",
                }}
              >
                <Pressable
                  style={[
                    styles.inlineButton,
                    { backgroundColor: colors.dark.primary },
                  ]}
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
                styles.item,
                {
                  backgroundColor: isDark
                    ? colors.dark.secondary
                    : colors.light.primary,
                },
              ]}
            >
              <Text
                style={[
                  {
                    color: isDark ? colors.dark.text : colors.light.text,
                    fontSize: 16,
                  },
                  item.completed && {
                    color: isDark
                      ? colors.dark.tertiary
                      : colors.light.tertiary,
                    textDecorationLine: "line-through",
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.dark.background },
  title: {
    fontSize: 24,
    color: colors.dark.accent,
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
