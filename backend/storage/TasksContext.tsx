import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";
const TASKS_STORAGE_KEY = "TASKS_STORAGE_KEY";
const LISTS_STORAGE_KEY = "LISTS_STORAGE_KEY";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  flagged?: boolean;
  indent?: number;
  listName?: string;
  scheduleDate?: string;
  buttonColor?: string;
  recentlyDeleted?: boolean;
}

export interface ListEntry {
  id: string;
  name: string;
}
export interface TasksContextValue {
  tasks: Task[];
  addTask: (t: Omit<Task, "completed">) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  lists: ListEntry[];
  addList: (name: string) => void;
  removeList: (id: string) => void;
  renameList: (id: string, newName: string) => void;
  renameTask: (id: string, newName: string) => void;
  updateTaskText: (id: string, newText: string) => void;
  updateTask: (id: string, updatedTask: Task) => void;
  indentTask: (id: string, indentLevel: number) => void;
  reorderTasks: (listName: string, newOrder: Task[]) => void;
  flagTask: (id: string, isFlagged: boolean) => void;
}

// Hook to consume TasksContext
export function useTasks(): TasksContextValue {
  return React.useContext(TasksContext);
}

export const TasksContext = createContext<TasksContextValue>({
  tasks: [],
  addTask: () => {},
  toggleTask: () => {},
  removeTask: () => {},
  lists: [],
  addList: () => {},
  removeList: () => {},
  renameList: () => {},
  renameTask: () => {},
  updateTaskText: () => {},
  updateTask: () => {},
  indentTask: () => {},
  reorderTasks: () => {},
  flagTask: () => {},
});

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<ListEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(TASKS_STORAGE_KEY),
      AsyncStorage.getItem(LISTS_STORAGE_KEY),
    ])
      .then(([tasksJson, listsJson]) => {
        if (tasksJson) {
          try {
            setTasks(JSON.parse(tasksJson));
          } catch {
            console.warn("Failed to parse tasks JSON");
          }
        }
        if (listsJson) {
          try {
            setLists(JSON.parse(listsJson));
          } catch {
            console.warn("Failed to parse lists JSON");
          }
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    AsyncStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(lists));
  }, [tasks, lists, hydrated]);

  /**
   * Adds a task and synchronizes with AsyncStorage.
   * This ensures the task is persisted across sessions.
   */
  const addTask = async (t: Omit<Task, "completed">) => {
    const newTask = { ...t, completed: false };

    // Immediate state update
    setTasks((old) => [...old, newTask]);

    // Write to AsyncStorage
    const currentTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    const parsedTasks = currentTasks ? JSON.parse(currentTasks) : [];
    parsedTasks.push(newTask);

    // Ensure unique IDs before storing
    const uniqueTasks = Array.from(
      new Map(parsedTasks.map((task) => [task.id, task])).values()
    );
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(uniqueTasks));

    // Force-refresh to verify it's persisted
    await new Promise((resolve) => setTimeout(resolve, 500)); // Give it time to sync
    const refreshedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

    if (refreshedTasks) {
      console.log(
        "🔄 Force-refreshing tasks from AsyncStorage",
        JSON.parse(refreshedTasks)
      );
      setTasks(JSON.parse(refreshedTasks));
    }
  };

  // Corrected toggleTask with proper AsyncStorage synchronization
  const toggleTask = (id: string) => {
    setTasks((old) => {
      const updated = old.map((x) =>
        x.id === id ? { ...x, completed: !x.completed } : x
      );
      AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Corrected removeTask with proper AsyncStorage synchronization
  const removeTask = (id: string) => {
    setTasks((old) => {
      const updated = old.filter((x) => x.id !== id);
      AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Corrected addList with proper AsyncStorage synchronization
  const addList = (name: string) => {
    setLists((old) => {
      const newList = { id: Date.now().toString(), name };
      const updated = [...old, newList];
      AsyncStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * Removes a list from state and AsyncStorage.
   * Ensures the list is deleted from both local memory and persistent storage.
   */
  const removeList = (id: string) => {
    setLists((old) => {
      const updated = old.filter((x) => x.id !== id);
      AsyncStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Corrected renameList with proper AsyncStorage synchronization
  const renameList = (id: string, newName: string) => {
    if (newName.trim() === "") {
      console.warn("Invalid name. Rename failed.");
      return;
    }
    setLists((old) => {
      const updated = old.map((list) =>
        list.id === id ? { ...list, name: newName } : list
      );
      AsyncStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const renameTask = (id: string, newName: string) => {
    if (newName.trim() === "") {
      console.warn("Invalid name. Rename failed.");
      return;
    }
    setLists((old) => {
      const updated = old.map((list) =>
        list.id === id ? { ...list, name: newName } : list
      );
      AsyncStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * Updates the text (title) of a task and synchronizes with AsyncStorage.
   * This ensures changes are reflected immediately and persist across sessions.
   * After updating, verifies that AsyncStorage reflects the change;
   * if not, forces the update and refreshes state.
   */
  const updateTaskText = (id: string, newText: string) => {
    setTasks((old) => {
      const updated = old.map((task) =>
        task.id === id ? { ...task, title: newText } : task
      );
      AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    // Force a refresh to re-render the list with updated data
    AsyncStorage.getItem(TASKS_STORAGE_KEY).then((data) => {
      if (data) {
        const parsed = JSON.parse(data);
        console.log("Force-refreshing tasks from AsyncStorage", parsed);

        // If the update didn't take, force it here
        if (
          !parsed.find((task: Task) => task.id === id && task.title === newText)
        ) {
          console.warn("Title did not sync. Forcing update.");
          const forceUpdated = parsed.map((task: Task) =>
            task.id === id ? { ...task, title: newText } : task
          );
          AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(forceUpdated));
          setTasks(forceUpdated);
        } else {
          setTasks(parsed);
        }
      }
    });
  };

  const updateTask = (id: string, updatedTask: Task) => {
    setTasks((old) =>
      old.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const flagTask = (id: string, isFlagged: boolean) => {
    setTasks((old) => {
      const updated = old.map((task) =>
        task.id === id ? { ...task, flagged: isFlagged } : task
      );
      AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const indentTask = (id: string, indentLevel: number) => {
    setTasks((old) => {
      const updated = old.map((task) =>
        task.id === id ? { ...task, indent: indentLevel } : task
      );
      AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Reorders tasks within a specific list and persists the new order
  const reorderTasks = (listName: string, newOrder: Task[]) => {
    setTasks((old) => {
      // Keep tasks from other lists intact
      const other = old.filter((t) => t.listName !== listName);
      const reordered = [...other, ...newOrder];
      AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(reordered));
      return reordered;
    });
  };
  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        removeTask,
        lists,
        addList,
        removeList,
        renameList,
        renameTask,
        updateTaskText,
        updateTask,
        indentTask,
        reorderTasks: reorderTasks,
        flagTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
