/**
 * Completed Screen
 *
 * Shows every task marked done (and not deleted).
 */
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useTasks } from "../../../backend/storage/TasksContext";



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
  completed: boolean;
  recentlyDeleted?: boolean;
  listName: string;
}

export default function AllTasks() {
  const { tasks, removeTask } = useTasks();
  const visibleTasks = tasks.filter((t) => t.completed && !t.recentlyDeleted);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Tasks</Text>
      <View style={styles.divider} />
      <FlatList
        data={visibleTasks}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <View style={{ flexDirection: "row", alignItems: "stretch", alignSelf: "stretch" }}>
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
              <Text style={[styles.text, item.completed && styles.completedText]}>
                {item.title}
              </Text>
            </View>
          </Swipeable>
        )}
        contentContainerStyle={{ backgroundColor: "#101010" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#101010" },
  title: {
    fontSize: 24,
    color: "#4A90E2",
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  item: {
    backgroundColor: "#1A1A1A",
    padding: 15,
    marginBottom: 6,
    borderRadius: 8,
  },
  text: { color: "#fff", fontSize: 16 },
  completedText: {
    color: "#888",
    textDecorationLine: "line-through",
  },
  divider: {
    height: 1,
    backgroundColor: "#444",
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
