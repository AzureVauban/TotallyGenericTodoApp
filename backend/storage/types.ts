import AsyncStorage from "@react-native-async-storage/async-storage";

// Key under which tasks are persisted
const TASKS_STORAGE_KEY = "MY_TASK_LISTS";

// Task shape used throughout the app
export interface TaskItem {
  id: string;
  text: string;
  done: boolean;
  flagged: boolean;
  indent: number;
  scheduleDate?: string;
  recentlyDeleted?: boolean;
  listName?: string;
}

/**
 * Load all tasks from AsyncStorage.
 * @returns Promise resolving to an array of TaskItem.
 */
export async function loadTasks(): Promise<TaskItem[]> {
  try {
    const json = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (!json) return [];
    return JSON.parse(json) as TaskItem[];
  } catch (error) {
    console.warn("Error loading tasks:", error);
    return [];
  }
}

/**
 * Save the provided tasks array to AsyncStorage.
 * @param tasks Array of TaskItem to persist.
 */
export async function saveTasks(tasks: TaskItem[]): Promise<void> {
  try {
    const json = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, json);
  } catch (error) {
    console.warn("Error saving tasks:", error);
  }
}
