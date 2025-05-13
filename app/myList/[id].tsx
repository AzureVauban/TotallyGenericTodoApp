// Helper to get tomorrow's date at midnight in mm-dd-yyyy format
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import FiBrsettings from "../../assets/icons/svg/fi-br-settings.svg";
import Swipeable from "react-native-gesture-handler/Swipeable";
import FiBrflagAlt from "../../assets/icons/svg/fi-br-flag-alt.svg";
import FiBredit from "../../assets/icons/svg/fi-br-text-box-edit.svg";
import FiBrtrash from "../../assets/icons/svg/fi-br-trash.svg";
import FiBrArrowRight from "../../assets/icons/svg/fi-br-arrow-alt-right.svg";
import FiBrArrowLeft from "../../assets/icons/svg/fi-br-arrow-alt-left.svg";
import { useTasks } from "../../backend/storage/TasksContext";

/**
 * **MyList Screen**
 *
 * Renders the task view for a single list route (e.g. `/myList/<list-name>`). The component handles
 * both *regular* user lists (persisted under `TASKS_<list-name>` in `AsyncStorage`) **and** the six
 * virtual “task-group” views (Today, Scheduled, All, Flagged, Completed, Recently Deleted). In
 * virtual views it aggregates tasks from *all* lists and applies in-memory filters so no additional
 * storage is written.
 *
 * **Responsibilities**
 * 1. **Load Tasks** – On mount decides whether to fetch one list or aggregate all; normalises each
 *    task (`flagged`, `indent`, etc.).
 * 2. **Persist Tasks** – Saves changes back to `AsyncStorage` for regular lists only.
 * 3. **Task Interactions**
 *    • *Tap* toggles `done` (only inside a regular list).
 *    • *Long-press* opens a **Task Details** modal (edit description, date, colour).
 *    • *Swipe left* shows **flag** and **rename** actions.
 *    • *Swipe right* shows the **delete** action (moves to Recently Deleted).
 * 4. **Indentation** – Toggles a one-level sub-task view via an `indent` flag.
 * 5. **Special-list helpers** – `updateTaskAcrossLists` keeps aggregated views in sync.
 *
 * @returns JSX element representing the list screen.
 */

const getTomorrowMidnight = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
};
type Task = {
  id: string;
  title: string;
  done: boolean;
  flagged: boolean;
  recentlyDeleted?: boolean;
  indent?: number;
  scheduleDate?: string;
  buttonColor?: string;
  listName?: string;
};

// Special list types (for reference, but not used for routing)
// const SPECIAL_LISTS = [
//   "Today",
//   "Scheduled",
//   "All",
//   "Flagged",
//   "Completed",
//   "Recently Deleted",
// ];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 10,
  },
  taskItem: {
    backgroundColor: "#1A1A1A",
    padding: 15,
    marginBottom: 5,
    borderRadius: 8,
  },
  taskText: {
    color: "#fff",
    fontSize: 16,
  },
  indentedTask: {
    marginLeft: 20,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 18,
    color: "#fff",
    backgroundColor: "#1A1A1A",
    fontSize: 16,
  },
  listTitleWrapper: {
    alignItems: "center",
    marginVertical: 10,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A90E2",
    marginTop: 25,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 10,
    width: 300,
    alignSelf: "center",
  },
  addTaskButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addTaskButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "bold",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#555",
    color: "#fff",
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  // Inserted color picker styles here
  colorPickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
    margin: 4,
  },
  modalButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  inlineButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: "100%",
    margin: 0,
    borderRadius: 8,
  },
});

export default function MyList() {
  const { id } = useLocalSearchParams();
  // Ensure id is a string
  const listId = Array.isArray(id) ? id[0] : id;
  // Update context import to include flagTask and indentTask
  const { tasks, addTask, toggleTask, removeTask, updateTaskText, updateTask, flagTask, indentTask } =
    useTasks() as unknown as {
      tasks: Task[];
      addTask: (task: Task) => void;
      toggleTask: (id: string) => void;
      removeTask: (id: string) => void;
      updateTaskText: (id: string, newText: string) => void;
      updateTask: (id: string, updatedTask: Task) => void;
      flagTask: (id: string, isFlagged: boolean) => void;
      indentTask: (id: string, indentLevel: number) => void;
    };
  const router = useRouter();

  // Handler for flagging a task using context method
  const handleFlagToggle = (taskId: string) => {
    const isCurrentlyFlagged = tasks.find((t) => t.id === taskId)?.flagged ?? false;
    flagTask(taskId, !isCurrentlyFlagged);
  };

  const handleEditTask = (taskId: string, taskText: string) => {
    setRenameTaskId(taskId);
    setRenameText(taskText);
    setRenameModalVisible(true);
  };

  // Handler for indenting a task using context method
  const handleIndentToggle = (taskId: string) => {
    const currentIndent = tasks.find((t) => t.id === taskId)?.indent || 0;
    indentTask(taskId, currentIndent === 1 ? 0 : 1);
  };

  const [newTaskModalVisible, setNewTaskModalVisible] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [renameTaskId, setRenameTaskId] = useState<string | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailDate, setDetailDate] = useState("");
  const [detailColor, setDetailColor] = useState("");
  const [newTaskError, setNewTaskError] = useState<string>("");

  // Dynamic route: only for regular lists, never special lists
  const isSpecialList = false;

  // Remove useEffect hooks for loading/saving tasks - handled by context now

  // No-op for updateTaskAcrossLists; not needed for regular lists
  const updateTaskAcrossLists = async (
    taskId: string,
    listName: string,
    updateFn: (task: Task) => Task
  ) => {};

  // Function to handle indenting a task (calls context method)
  const handleIndentById = (taskId: string) => {
    handleIndentToggle(taskId);
  };

  // Function to check if a task can be indented
  // (implementation omitted, as indent is not handled by context)

  // Only show tasks for this list
  const listTasks = tasks.filter((t) => (t as Task).listName === listId);
  // Custom active and completed filters
  const activeTasks = listTasks.filter((t, i) => {
    if (t.indent === 0) {
      // only include parent if not done
      return !t.done;
    }
    // for subtasks, include until parent and all siblings are done
    let j = i - 1;
    while (j >= 0 && listTasks[j].indent === 1) j--;
    const parent = listTasks[j];
    let allSibsDone = true;
    for (
      let k = j + 1;
      k < listTasks.length && listTasks[k].indent === 1;
      k++
    ) {
      if (!listTasks[k].done) {
        allSibsDone = false;
        break;
      }
    }
    // show subtask until parent+siblings complete
    return !(parent.done && allSibsDone);
  });
  const completedTasks = listTasks.filter((t, i) => {
    if (t.indent === 0) {
      // only parents that are done
      return t.done;
    }
    // for subtasks, only include once parent and all siblings are done
    let j = i - 1;
    while (j >= 0 && listTasks[j].indent === 1) j--;
    const parent = listTasks[j];
    let allSibsDone = true;
    for (
      let k = j + 1;
      k < listTasks.length && listTasks[k].indent === 1;
      k++
    ) {
      if (!listTasks[k].done) {
        allSibsDone = false;
        break;
      }
    }
    return parent.done && allSibsDone;
  });
  const [detailDesc, setDetailDesc] = useState("");
  // Function to mark a task as deleted (should use removeTask from context)
  const moveToRecentlyDeleted = (taskId: string, listName: string) => {
    removeTask(taskId);
  };

  // TODO: When dragging a parent task, also move its following subtasks as a group.
  //       Implement custom onDragBegin/onDragEnd to splice the subtasks array slice
  //       along with the parent to the new index position.

  return (
    <View style={styles.container}>
      <View style={styles.listTitleWrapper}>
        <Text style={styles.listTitle}>{listId}</Text>
      </View>

      <DraggableFlatList
        data={activeTasks as Task[]}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onDragEnd={({ data }) => {
          // If you implement drag reordering in context, call it here.
        }}
        renderItem={({ item, drag, getIndex }: RenderItemParams<Task>) => {
          const index = getIndex();
          const activeIndex = activeTasks.findIndex((t) => t.id === item.id);
          return (
            <Swipeable
              renderRightActions={() => (
                <View style={{ flexDirection: "row" }}>
                  <Pressable
                    style={[
                      styles.inlineButton,
                      { backgroundColor: "#7f1d1d" },
                    ]}
                    onPress={() => {
                      Alert.alert(
                        "Delete Task",
                        `Move "${item.title}" to Recently Deleted?`,
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () =>
                              moveToRecentlyDeleted(item.id, listId),
                          },
                        ]
                      );
                    }}
                  >
                    <FiBrtrash width={20} height={20} fill="#fecaca" />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.inlineButton,
                      { backgroundColor: "rgb(67,56,202)" },
                    ]}
                    onPress={() => {
                      setSelectedTask(item);
                      setDetailDate(item.scheduleDate ?? getTomorrowMidnight());
                      setDetailColor(item.buttonColor ?? "");
                      setDetailDesc(item.title);
                      setDetailModalVisible(true);
                    }}
                  >
                    <FiBrsettings
                      width={20}
                      height={20}
                      fill="rgb(165,180,252)"
                    />
                  </Pressable>
                </View>
              )}
              renderLeftActions={() => (
                <View style={{ flexDirection: "row" }}>
                  <Pressable
                    style={[
                      styles.inlineButton,
                      { backgroundColor: "#fbbf24" },
                    ]}
                    onPress={() => handleFlagToggle(item.id)}
                  >
                    <FiBrflagAlt
                      width={20}
                      height={20}
                      fill={item.flagged ? "#b45309" : "#fde68a"}
                    />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.inlineButton,
                      { backgroundColor: "#93c5fd" },
                    ]}
                    onPress={() => {
                      setRenameTaskId(item.id);
                      setRenameText(item.title);
                      setRenameModalVisible(true);
                    }}
                  >
                    <FiBredit width={20} height={20} fill="#2563eb" />
                  </Pressable>
                  {/* Indent/Outdent button for non-special lists */}
                  {activeIndex >= 0 && (
                    <Pressable
                      style={[
                        styles.inlineButton,
                        { backgroundColor: "rgb(16, 185, 129)" },
                      ]}
                      onPress={() => handleIndentById(item.id)}
                    >
                      {item.indent === 1 ? (
                        <FiBrArrowLeft
                          width={20}
                          height={20}
                          fill="rgb(167, 243, 208)"
                        />
                      ) : (
                        <FiBrArrowRight
                          width={20}
                          height={20}
                          fill="rgb(167, 243, 208)"
                        />
                      )}
                    </Pressable>
                  )}
                </View>
              )}
            >
              <Pressable
                onPress={() => {
                  console.log(
                    `user pressed on the task, ${item.id}, with a description of, '${item.title}'`
                  );
                  if (item.indent === 0) {
                    const idx = listTasks.findIndex((t) => t.id === item.id);
                    let hasIncompleteSub = false;
                    for (let j = idx + 1; j < listTasks.length; j++) {
                      if (listTasks[j].indent !== 1) break;
                      if (!listTasks[j].done) {
                        hasIncompleteSub = true;
                        break;
                      }
                    }
                    if (hasIncompleteSub) {
                      Alert.alert(
                        "Complete Subtasks",
                        "You must complete all subtasks before completing this task."
                      );
                      return;
                    }
                  }
                  toggleTask(item.id);
                }}
                onLongPress={() => {
                  // Default: start drag for reordering
                  drag();
                }}
              >
                <View
                  style={[
                    styles.taskItem,
                    item.indent === 1 && styles.indentedTask,
                    item.done
                      ? { backgroundColor: "#2d2d2d" }
                      : item.buttonColor
                      ? { backgroundColor: item.buttonColor }
                      : {},
                  ]}
                >
                  <Text
                    style={[
                      styles.taskText,
                      item.done && {
                        textDecorationLine: "line-through",
                        color: "#888",
                      },
                      item.indent === 1 &&
                        item.done && {
                          textDecorationLine: "line-through",
                          color: "#888",
                        },
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
              </Pressable>
            </Swipeable>
          );
        }}
      />

      {completedTasks.length > 0 && (
        <>
          <View style={styles.divider} />
          <FlatList<Task>
            data={completedTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable onPress={() => toggleTask(item.id)}>
                <View
                  style={[
                    styles.taskItem,
                    item.indent === 1 && styles.indentedTask,
                    { backgroundColor: "#2d2d2d" },
                  ]}
                >
                  <Text
                    style={[
                      styles.taskText,
                      { textDecorationLine: "line-through", color: "#888" },
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </>
      )}

      {/* Only show add task button (always, since only regular lists) */}
      <TouchableOpacity
        style={styles.addTaskButton}
        onPress={() => setNewTaskModalVisible(true)}
      >
        <Text style={styles.addTaskButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      {/* New Task Modal */}
      <Modal visible={newTaskModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Task</Text>
            <TextInput
              value={newTaskText}
              onChangeText={setNewTaskText}
              placeholder="Task description"
              placeholderTextColor="#ccc"
              style={[
                styles.modalInput,
                newTaskError && { borderColor: "#450a0a" },
              ]}
            />
            {newTaskError ? (
              <Text style={{ color: "#450a0a", marginBottom: 8 }}>
                {newTaskError}
              </Text>
            ) : null}
            <Pressable
              style={styles.modalButton}
              onPress={async () => {
                const desc = newTaskText?.trim();
                if (!desc) {
                  setNewTaskError("Please enter a task description.");
                  return;
                }
                if (listTasks.some((t) => t.title.trim() === desc)) {
                  setNewTaskError(
                    "A task with that description already exists."
                  );
                  return;
                }
                if (typeof desc !== "string") {
                  throw new Error(`Invalid task description: ${String(desc)}`);
                }
                await addTask({
                  id: `${Date.now()}-${Math.random()
                    .toString(36)
                    .substr(2, 5)}`,
                  title: desc,
                  done: false,
                  flagged: false,
                  indent: 0,
                  listName: listId,
                });
                setNewTaskError("");
                setNewTaskText("");
                setNewTaskModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Add</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, { backgroundColor: "#888" }]}
              onPress={() => {
                setNewTaskText("");
                setNewTaskError("");
                setNewTaskModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Rename Task Modal */}
      <Modal visible={renameModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Task</Text>
            <TextInput
              value={renameText}
              onChangeText={setRenameText}
              placeholder="Task description"
              placeholderTextColor="#ccc"
              style={styles.modalInput}
            />
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                if (renameText.trim() && renameTaskId) {
                  console.log(`Updating task with ID ${renameTaskId} to new text: ${renameText}`);
                  updateTaskText(renameTaskId, renameText);
                }
                setRenameText("");
                setRenameTaskId(null);
                setRenameModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, { backgroundColor: "#888" }]}
              onPress={() => {
                setRenameText("");
                setRenameTaskId(null);
                setRenameModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Task Details Modal */}
      <Modal visible={detailModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Task Details</Text>
            <TextInput
              value={detailDesc}
              onChangeText={setDetailDesc}
              placeholder={selectedTask?.title}
              placeholderTextColor="rgb(161, 161, 170)"
              style={styles.modalInput}
            />

            <TextInput
              value={detailDate}
              onChangeText={setDetailDate}
              placeholder="Scheduled Date"
              placeholderTextColor="#ccc"
              style={styles.modalInput}
            />

            {/* Color picker swatches */}
            <View style={styles.colorPickerContainer}>
              {[
                // 800
                "rgb(107, 33,168)",
                "rgb(30,64, 175)",
                "rgb(22, 101 ,52)",
                "rgb(146,64 ,14)",
                "rgb(157 ,23 ,77)",
                // 600
                "rgb(147 ,51 ,234)",
                "rgb(37  ,99 ,235)",
                "rgb(5   ,150, 105)",
                "rgb(202 ,138, 4)",
                "rgb(219 ,39 ,119)",
                // 400
                "rgb(192 ,132, 252)",
                "rgb(96  ,165, 250)",
                "rgb(74  ,222, 128)",
                "rgb(250 ,204, 21)",
                "rgb(244 ,114, 182)",
                // 200
                "rgb(233,213, 255)",
                "rgb(191,219, 254)",
                "rgb(187,247, 208)",
                "rgb(254,240, 138)",
                "rgb(251,207, 232)",
              ].map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setDetailColor(color)}
                  style={[
                    styles.colorSwatch,
                    {
                      backgroundColor: color,
                      borderWidth: detailColor === color ? 2 : 0,
                      borderColor: "#fff",
                    },
                  ]}
                />
              ))}
            </View>

            <TextInput
              value={detailColor}
              onChangeText={setDetailColor}
              placeholder="Button Color (hex)"
              placeholderTextColor="#ccc"
              style={styles.modalInput}
            />
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                if (selectedTask) {
                  const updateFn = (t: Task) => ({
                    ...t,
                    title: detailDesc,
                    scheduleDate: detailDate,
                    buttonColor: detailColor,
                  });
                  updateTask(selectedTask.id, updateFn(selectedTask));
                }
                setDetailModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, { backgroundColor: "#888" }]}
              onPress={() => setDetailModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
