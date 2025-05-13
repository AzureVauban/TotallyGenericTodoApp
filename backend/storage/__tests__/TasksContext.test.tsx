import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { TasksProvider, useTasks } from "../TasksContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

describe("TasksContext", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  /**
   * Adds a task correctly and verifies it is present in the task list.
   */
  it("should add a task correctly", async () => {
    const wrapper = ({ children }: any) => (
      <TasksProvider>{children}</TasksProvider>
    );
    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      result.current.addTask({ id: "1", title: "Test Task" });
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].title).toBe("Test Task");
    });
  });

  /**
   * Adds multiple tasks and verifies that all are present in the task list.
   */
  it("should add multiple tasks correctly", async () => {
    const wrapper = ({ children }: any) => (
      <TasksProvider>{children}</TasksProvider>
    );
    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      result.current.addTask({ id: "1", title: "Test Task" });
      result.current.addTask({ id: "2", title: "Second Task" });
      result.current.addTask({ id: "3", title: "Third Task" });
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(3);
      expect(result.current.tasks[1].title).toBe("Second Task");
      expect(result.current.tasks[2].title).toBe("Third Task");
    });
  });

  /**
   * Removes a list and checks that it no longer exists in the lists array.
   */
  it("should remove a list correctly", async () => {
    const wrapper = ({ children }: any) => (
      <TasksProvider>{children}</TasksProvider>
    );
    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      result.current.addList("List to Remove");
    });

    await waitFor(() => {
      expect(result.current.lists).toHaveLength(1);
    });

    // Capture the list ID after it's actually added
    const listId = result.current.lists[0]?.id;

    await act(async () => {
      if (listId) {
        result.current.removeList(listId);
      }
    });

    await waitFor(() => {
      expect(result.current.lists).toHaveLength(0);
    });
  });

  /**
   * Removes a task correctly and verifies it is no longer in the task list.
   */
  it("should remove a task correctly", async () => {
    const wrapper = ({ children }: any) => (
      <TasksProvider>{children}</TasksProvider>
    );
    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      result.current.addTask({ id: "4", title: "Task to Remove" });
      result.current.removeTask("4");
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(0);
    });
  });

  /**
   * Toggles task completion status correctly.
   */
  it("should toggle task completion correctly", async () => {
    const wrapper = ({ children }: any) => (
      <TasksProvider>{children}</TasksProvider>
    );
    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      result.current.addTask({ id: "5", title: "Toggle Task" });
      result.current.toggleTask("5");
    });

    await waitFor(() => {
      expect(result.current.tasks[0].completed).toBe(true);
    });

    await act(async () => {
      result.current.toggleTask("5");
    });

    await waitFor(() => {
      expect(result.current.tasks[0].completed).toBe(false);
    });
  });

  /**
   * Updates task text correctly.
   */
  it("should update task text correctly", async () => {
    const wrapper = ({ children }: any) => (
      <TasksProvider>{children}</TasksProvider>
    );
    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      result.current.addTask({ id: "6", title: "Original Title" });
      result.current.updateTaskText("6", "Updated Title");
    });

    await waitFor(() => {
      expect(result.current.tasks[0].title).toBe("Updated Title");
    });
  });

  /**
   * Adds a list correctly and verifies it is present in the lists array.
   */
  it("should add a list correctly", async () => {
    const wrapper = ({ children }: any) => (
      <TasksProvider>{children}</TasksProvider>
    );
    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      result.current.addList("New List");
    });

    await waitFor(() => {
      expect(result.current.lists).toHaveLength(1);
      expect(result.current.lists[0].name).toBe("New List");
    });
  });

  /**
   * Renames a list and verifies that the name has been updated.
   */
  it("should rename a list correctly", async () => {
    const wrapper = ({ children }: any) => (
      <TasksProvider>{children}</TasksProvider>
    );
    const { result } = renderHook(() => useTasks(), { wrapper });

    await act(async () => {
      result.current.addList("Original Name");
    });

    const listId = result.current.lists[0].id;

    await act(async () => {
      result.current.renameList(listId, "Updated Name");
    });

    await waitFor(() => {
      expect(result.current.lists[0].name).toBe("Updated Name");
    });
  });
});
/**
 * Updates the text (title) of a task correctly and verifies it persists.
 */
it("should update task text correctly and reflect in AsyncStorage", async () => {
  const wrapper = ({ children }: any) => (
    <TasksProvider>{children}</TasksProvider>
  );
  const { result } = renderHook(() => useTasks(), { wrapper });

  // Add a task
  await act(async () => {
    await result.current.addTask({ id: "7", title: "Initial Title" });
  });

  // **Wait for the state to refresh and hydrate from AsyncStorage**
  await waitFor(() => {
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Initial Title");
  });

  // Update the task's title
  await act(async () => {
    result.current.updateTaskText("7", "Updated Title");
  });

  // Wait for the state to update
  await waitFor(() => {
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Updated Title");
  });

  // Verify it is persisted in AsyncStorage
  const storedTasks = await AsyncStorage.getItem("TASKS_STORAGE_KEY");
  const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
  expect(parsedTasks[0].title).toBe("Updated Title");
});
