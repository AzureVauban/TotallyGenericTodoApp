/**
 * Completed Screen
 *
 * Shows every task marked done (and not deleted).
 */
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTasks } from "../../../backend/storage/TasksContext";
// Local TaskItem shape
interface TaskItem {
  id: string;
  text: string;
  done: boolean;
  recentlyDeleted?: boolean;
  listName: string;
}

export default function CompletedTasks() {
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
            .filter((t) => t.done && !t.recentlyDeleted)
            .map((t) => ({ ...t, listName: list.name }))
        );
      }
      setTasks(all);
    })();
  }, [lists]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed</Text>
      <FlatList
        data={tasks}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
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
