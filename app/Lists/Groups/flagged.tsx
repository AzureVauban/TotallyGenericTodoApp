import React from "react";

import { FlatList, Pressable, Text, View } from "react-native";

import Swipeable from "react-native-gesture-handler/Swipeable";
import { colors } from "@theme/colors";
import { useFocusEffect } from "@react-navigation/native";

import FiBrflagAlt from "../../../assets/icons/svg/fi-br-flag-alt.svg";
import FiBrtrash from "../../../assets/icons/svg/fi-br-trash.svg";
import { styles } from "../../theme/styles";
import { useTasks } from "../../../backend/storage/TasksContext";
import { useTheme } from "../../../lib/ThemeContext";

// …
export default function FlaggedTasks() {
  console.log("FlaggedTasks rendered");
  const { tasks, removeTask, exportDataAsJSON } = useTasks();
  const { theme: themeMode } = useTheme();
  const isDark = themeMode === "dark";
  useFocusEffect(
    React.useCallback(() => {
      exportDataAsJSON();
    }, [themeMode])
  );
  const flaggedTasks = tasks.filter((t) => !!t.flagged);
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
        {"Flagged Tasks"}
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
        data={flaggedTasks}
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
