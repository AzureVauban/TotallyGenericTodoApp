import * as FileSystem from "expo-file-system";
import { Task } from "./types";

const FILE = FileSystem.documentDirectory + "tasks.json";

/**
 * Read tasks.json (returns [] if the file doesn't exist)
 */
export async function loadTasks(): Promise<Task[]> {
  try {
    const data = await FileSystem.readAsStringAsync(FILE);
    return JSON.parse(data) as Task[];
  } catch (e) {
    // File might not exist on first launch – that's fine
    return [];
  }
}

/**
 * Persist the entire task list
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  await FileSystem.writeAsStringAsync(FILE, JSON.stringify(tasks));
}
