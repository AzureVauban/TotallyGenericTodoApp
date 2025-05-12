// src/context/TasksContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { loadTasks, saveTasks } from "../backend/storage/tasksStorage";

type TasksContextType = {
  lists: any[];
  setLists: React.Dispatch<React.SetStateAction<any[]>>;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<any[]>([]);

  // load once
  useEffect(() => {
    (async () => {
      const stored = await loadTasks();
      setLists(stored);
    })();
  }, []);

  // save on every change
  useEffect(() => {
    saveTasks(lists);
  }, [lists]);

  return (
    <TasksContext.Provider value={{ lists, setLists }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be inside TasksProvider");
  return ctx;
}
