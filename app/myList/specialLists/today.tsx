/**
 * Today Screen
 *
 * Aggregates all tasks from every user list, then filters
 * in-memory to only those scheduled for today (mm-dd-yyyy).
 */
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTasks } from "../../../context/TasksContext";
import type { TaskItem } from "../_types";

export default function Today() {
  const { lists } = useTasks();
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    (async () => {
      const all: TaskItem[] = [];
      const today = new Date();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const yyyy = today.getFullYear();
      const key = `${mm}-${dd}-${yyyy}`;

      for (const list of lists) {
        const raw = await AsyncStorage.getItem(`TASKS_${list.name}`);
        const arr: TaskItem[] = raw ? JSON.parse(raw) : [];
        all.push(
          ...arr
            .filter((t) => t.scheduleDate === key && !t.recentlyDeleted)
            .map((t) => ({ ...t, listName: list.name }))
        );
      }

      setTasks(all);
    })();
  }, [lists]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today</Text>
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
