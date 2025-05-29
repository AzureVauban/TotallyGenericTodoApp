/**
 * All Screen
 *
 * Shows every non-deleted task, regardless of state.
 */
import { colors } from "@theme/colors";
import { useTheme } from "../../../lib/ThemeContext";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useFocusEffect } from "@react-navigation/native";
import FiBrtrash from "../../../assets/icons/svg/fi-br-trash.svg";
import FiBrflagAlt from "../../../assets/icons/svg/fi-br-flag-alt.svg";
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

  const TASK_ROW_HEIGHT = 48; // Match your taskItem height if not explicitly set in styles

  const renderTaskRow = (item: any) => (
    <Swipeable
      renderRightActions={() => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "stretch",
            height: TASK_ROW_HEIGHT,
          }}
        >
          <Pressable
            style={[
              styles.inlineButton,
              {
                backgroundColor: isDark
                  ? colors.dark.redbutton_background
                  : colors.light.redbutton_background,
                borderRadius: 8,
                height: TASK_ROW_HEIGHT,
                minWidth: 48,
                marginRight: 4,
                justifyContent: "center",
                alignItems: "center",
                // Remove all padding for flush alignment
                padding: 0,
              },
            ]}
            onPress={() => {
              removeTask(item.id);
              exportDataAsJSON();
            }}
          >
            <FiBrtrash
              width={20}
              height={20}
              fill={
                isDark
                  ? colors.dark.redbutton_text_icon
                  : colors.light.redbutton_text_icon
              }
            />
          </Pressable>
        </View>
      )}
    >
      <View
        style={[
          styles.taskItem,
          item.indent === 1 && styles.indentedTask,
          item.completed
            ? { backgroundColor: colors.dark.secondary }
            : item.buttonColor
            ? { backgroundColor: item.buttonColor }
            : {
                backgroundColor: isDark
                  ? colors.dark.primary
                  : colors.light.accent,
              },
          {
            minHeight: TASK_ROW_HEIGHT,
            flexDirection: "row",
            alignItems: "center",
          },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Text
            style={[
              styles.taskText,
              item.completed
                ? {
                    textDecorationLine: "line-through",
                    color: colors.dark.tertiary,
                  }
                : {
                    color: isDark ? colors.dark.text : colors.dark.primary,
                  },
            ]}
          >
            {item.title}
          </Text>
          {item.flagged && (
            <FiBrflagAlt
              width={18}
              height={18}
              style={{ marginLeft: 8 }}
              fill={isDark ? "#fbbf24" : "#d97706"}
            />
          )}
        </View>
      </View>
    </Swipeable>
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
        renderItem={({ item }) => renderTaskRow(item)}
        contentContainerStyle={{
          backgroundColor: isDark
            ? colors.dark.background
            : colors.light.background,
        }}
      />
    </View>
  );
}
