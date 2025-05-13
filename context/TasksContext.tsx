import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface ListEntry {
  name: string;
}

export interface TasksContextValue {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  lists: ListEntry[];
  setLists: React.Dispatch<React.SetStateAction<ListEntry[]>>;
  // …any other actions (addTask, toggleTask, removeTask)…
}
// Hook to consume TasksContext
export function useTasks(): TasksContextValue {
  return React.useContext(TasksContext);
}
export const TasksContext = createContext<TasksContextValue>({
  tasks: [],
  setTasks: () => {},
  lists: [],
  setLists: () => {},
});

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<ListEntry[]>([]);

  // Load persisted tasks on mount
  useEffect(() => {
    AsyncStorage.getItem("TASKS_STORAGE_KEY").then((json) => {
      if (json) {
        try {
          setTasks(JSON.parse(json));
        } catch {
          console.warn("Failed to parse saved tasks JSON");
        }
      }
    });
  }, []);

  // Persist tasks on every change
  useEffect(() => {
    AsyncStorage.setItem("TASKS_STORAGE_KEY", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <TasksContext.Provider
      value={{ tasks, setTasks, lists, setLists /* …other actions… */ }}
    >
      {children}
    </TasksContext.Provider>
  );
}
