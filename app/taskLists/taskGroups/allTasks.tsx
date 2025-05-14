/**
 * All Screen
 *
 * Shows every non-deleted task, regardless of state.
 */
import { colors } from "@theme/colors";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import FiBrtrash from "../../../assets/icons/svg/fi-br-trash.svg";
import { useTasks } from "../../../backend/storage/TasksContext";

export default function AllTasks() {
  const { tasks, removeTask } = useTasks();
  const visibleTasks = tasks.filter((t) => !t.recentlyDeleted);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Tasks</Text>
      <View style={styles.divider} />
      <FlatList
        data={visibleTasks}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                  style={[styles.inlineButton, { backgroundColor: "#7f1d1d" }]}
                  onPress={() => removeTask(item.id)}
                >
                  <FiBrtrash width={20} height={20} fill="#fecaca" />
                </Pressable>
              </View>
            )}
          >
            <View style={styles.item}>
              <Text
                style={[styles.text, item.completed && styles.completedText]}
              >
                {item.title}
              </Text>
            </View>
          </Swipeable>
        )}
        contentContainerStyle={{ backgroundColor: colors.dark.background }}
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
