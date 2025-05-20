/**
 * All Screen
 *
 * Shows every non-deleted task, regardless of state.
 */
import { colors } from "@theme/colors";
import { useTheme } from "../../theme/ThemeContext";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useFocusEffect } from "@react-navigation/native";
import FiBrtrash from "../../../assets/icons/svg/fi-br-trash.svg";
import { useTasks } from "../../../backend/storage/TasksContext";
import { styles } from "../../theme/styles";

export default function AllTasks() {
  const { tasks, removeTask, exportDataAsJSON } = useTasks();
  const { theme: themeMode } = useTheme();
  const isDark = themeMode === "dark";
  const visibleTasks = tasks.filter((t) => !t.recentlyDeleted);

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
          styles.listTitle,
          {
            color: isDark
              ? colors.dark.bluebutton_background
              : colors.light.bluebutton_background,
            textAlign: "center",
          },
        ]}
      >
        {"All Tasks"}
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
                item.indent === 1 && styles.indentedTask,
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
