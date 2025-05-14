import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "MY_TASK_LISTS";

/**
 * Loads the saved tasks (returns [] if none).
 */
export async function loadTasks(): Promise<any[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.error("loadTasks error:", err);
    return [];
  }
}

/**
 * Saves the given tasks array.
 */
export async function saveTasks(tasks: any[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error("saveTasks error:", err);
  }
}
