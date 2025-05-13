import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

const homeScreenStyles = StyleSheet.create({
  taskListButton: {
    backgroundColor: "#2980EF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: "100%", // Full width display restored
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inlineButton: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%", // Match the height of the taskListButton
    width: 75,
    margin: 0,
    borderRadius: 8,
  },
});
/**
 * **HomeScreen**
 *
 * Displays the list‑of‑lists “home” view where the user can:
 *  • Swipe **right‑to‑left** on a list button to reveal a red **Delete** action.
 *    Confirming the alert removes the list, pushes it to the *recentlyDeleted* state array,
 *    and persists the change via `saveTasks`.
 *  • Tap a list button to navigate to `/myList/<id>` using Expo Router.
 *  • Tap the big green “+” button to create a new list. An `Alert.prompt` collects the
 *    name, validates it, persists the new list, and immediately routes to its detail screen.
 *
 * **State**
 *  * `tasks` – active task‑lists shown on screen.
 *  * `doneTasks` / `recentlyDeleted` – supporting arrays used by other views.
 *
 * **Side‑effects**
 *  Persists all list mutations through the local `saveTasks` helper (implementation
 *  provided elsewhere in the project).
 *
 * @returns A fully‑interactive React Native view wrapped in `Swipeable` components.
 */
export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState([]);
  const router = useRouter();

  // Assume saveTasks is defined elsewhere to persist tasks
  const saveTasks = (newTasks) => {
    // Implementation for saving tasks
  };

  return (
    <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 12 }}>
      {tasks.map((item) => (
        <Swipeable
          key={item.id}
          renderRightActions={(progress, dragX) => (
            <View
              style={{
                flexDirection: "row",
                overflow: "hidden",
                height: "100%",
              }}
            >
              <Pressable
                style={[
                  homeScreenStyles.inlineButton,
                  { backgroundColor: "#D9534F" },
                ]}
                onPress={() => {
                  Alert.alert(
                    "Delete List",
                    `Are you sure you want to delete ${item.name}?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => {
                          setTasks((prev) =>
                            prev.filter((t) => t.id !== item.id)
                          );
                          setRecentlyDeleted((prev) => [
                            ...prev,
                            { ...item, recentlyDeleted: true },
                          ]);
                          saveTasks([
                            ...tasks.filter((t) => t.id !== item.id),
                            ...doneTasks,
                            ...recentlyDeleted,
                            { ...item, recentlyDeleted: true },
                          ]);
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={{ color: "white", fontSize: 14 }}>Delete</Text>
              </Pressable>
            </View>
          )}
          renderLeftActions={() => null}
        >
          <TouchableOpacity
            style={homeScreenStyles.taskListButton}
            onPress={() => router.push(`/myList/${item.id}`)}
          >
            <Text style={{ color: "white", fontSize: 18 }}>{item.name}</Text>
          </TouchableOpacity>
        </Swipeable>
      ))}

      <TouchableOpacity
        style={[
          homeScreenStyles.taskListButton,
          { backgroundColor: "#27ae60", justifyContent: "center" },
        ]}
        onPress={() => {
          Alert.prompt(
            "New Task List",
            "Enter a name for your new task list:",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Create",
                onPress: (name) => {
                  if (name && name.trim().length > 0) {
                    const newTaskList = { id: Date.now().toString(), name };
                    setTasks((prev) => [...prev, newTaskList]);
                    saveTasks([...tasks, newTaskList]);
                    router.push(`/myList/${newTaskList.id}`);
                  } else {
                    Alert.alert(
                      "Invalid Name",
                      "Task list name cannot be empty."
                    );
                  }
                },
              },
            ],
            "plain-text"
          );
        }}
      >
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}
