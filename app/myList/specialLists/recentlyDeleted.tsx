/**
 * Recently Deleted Screen
 *
 * Shows every task marked `recentlyDeleted` = true.
 * Allows long-press to prompt “restore” back to its original list.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTasks } from "../../../backend/storage/TasksContext";
// Local TaskItem shape
interface TaskItem {
  id: string;
  text: string;
  recentlyDeleted?: boolean;
  listName: string;
}

export default function RecentlyDeleted() {
  const { lists } = useTasks();
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    (async () => {
      const all: TaskItem[] = [];
      for (const list of lists) {
        const raw = await AsyncStorage.getItem(`TASKS_${list.name}`);
        const arr: TaskItem[] = raw ? JSON.parse(raw) : [];
        all.push(
          ...arr
            .filter((t) => t.recentlyDeleted)
            .map((t) => ({ ...t, listName: list.name }))
        );
      }
      setTasks(all);
    })();
  }, [lists]);

  const restore = async (task: TaskItem) => {
    Alert.alert(
      "Restore Task",
      `Restore "${task.text}" to list "${task.listName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          onPress: async () => {
            const key = `TASKS_${task.listName}`;
            const raw = await AsyncStorage.getItem(key);
            const arr: TaskItem[] = raw ? JSON.parse(raw) : [];
            const updated = arr.map((t) =>
              t.id === task.id ? { ...t, recentlyDeleted: false } : t
            );
            await AsyncStorage.setItem(key, JSON.stringify(updated));
            // refresh
            setTasks((prev) => prev.filter((t) => t.id !== task.id));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Deleted</Text>
      <FlatList
        data={tasks}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <Pressable onLongPress={() => restore(item)}>
            <View style={styles.item}>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#101010" },
  title: { fontSize: 24, color: "#4A90E2", marginBottom: 10 },
  item: {
    backgroundColor: "#1A1A1A",
    padding: 15,
    marginBottom: 6,
    borderRadius: 8,
  },
  text: { color: "#fff", fontSize: 16 },
});
