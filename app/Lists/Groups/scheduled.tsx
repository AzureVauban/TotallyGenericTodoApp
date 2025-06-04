import React from "react";

import { FlatList, Pressable, Text, View } from "react-native";

import { useLocalSearchParams } from "expo-router";

import Swipeable from "react-native-gesture-handler/Swipeable";
import { colors } from "@theme/colors";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "lib/ThemeContext";

import FiBrflagAlt from "../../../assets/icons/svg/fi-br-flag-alt.svg";
import FiBrtrash from "../../../assets/icons/svg/fi-br-trash.svg";
import { useTasks } from "../../../backend/storage/TasksContext";
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
  console.log("ScheduledTasks rendered");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { tasks, removeTask, exportDataAsJSON } = useTasks();
  const params = useLocalSearchParams();
  const selectedDate =
    typeof params.date === "string" ? params.date : undefined;

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
    // Accept both ISO and MM-DD-YYYY
    let taskDate = "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(t.scheduleDate)) {
      taskDate = t.scheduleDate;
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(t.scheduleDate)) {
      const [mm, dd, yyyy] = t.scheduleDate.split("-");
      taskDate = `${yyyy}-${mm}-${dd}`;
    }
    if (selectedDate) {
      return taskDate === selectedDate;
    }
    return true;
  });

  const TASK_ROW_HEIGHT = 48;

  const renderTaskRow = (item: any) => (
    <Swipeable
      renderRightActions={() => (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-end",
            height: "100%",
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
                justifyContent: "center",
                alignItems: "center",
                marginRight: 4,
                height: TASK_ROW_HEIGHT,
                minHeight: TASK_ROW_HEIGHT,
                paddingTop: 0,
                paddingBottom: 0,
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
          { height: TASK_ROW_HEIGHT },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
