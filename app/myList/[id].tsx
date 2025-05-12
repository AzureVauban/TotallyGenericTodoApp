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
import Swipeable from "react-native-gesture-handler/Swipeable";
import FiBrflagAlt from "../../assets/icons/svg/fi-br-flag-alt.svg";
import FiBredit from "../../assets/icons/svg/fi-br-text-box-edit.svg";
import FiBrtrash from "../../assets/icons/svg/fi-br-trash.svg";
import FiBrArrowRight from "../../assets/icons/svg/fi-br-arrow-alt-right.svg";
import FiBrArrowLeft from "../../assets/icons/svg/fi-br-arrow-alt-left.svg";
import { useTasks } from "../../context/TasksContext";

const getTomorrowMidnight = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
};
type TaskItem = {
  id: string;
  text: string;
  done: boolean;
  flagged: boolean;
  recentlyDeleted?: boolean;
  indent?: number;
  scheduleDate?: string;
  buttonColor?: string;
  listName?: string;
};

type Divider = { isDivider: true };
type ListItem = TaskItem | Divider;

// Special list types
const SPECIAL_LISTS = [
  "Today",
  "Scheduled",
  "All",
  "Flagged",
  "Completed",
  "Recently Deleted",
];

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
    height: 45,
    margin: 0,
    borderRadius: 8,
  },
});

export default function MyList() {
  const { id } = useLocalSearchParams();
  // Ensure id is a string
  const listId = Array.isArray(id) ? id[0] : id;
  const { lists, setLists } = useTasks();
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTaskModalVisible, setNewTaskModalVisible] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [renameTaskId, setRenameTaskId] = useState<string | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [detailDate, setDetailDate] = useState("");
  const [detailColor, setDetailColor] = useState("");

  // Determine if this is a special list
  const isSpecialList = SPECIAL_LISTS.includes(listId);

  // Load saved tasks for this list or filter based on special list types
  useEffect(() => {
    (async () => {
      // For special lists, we need to get all tasks
      if (isSpecialList) {
        // Get all tasks from all lists
        const allTasks: TaskItem[] = [];
        for (const list of lists) {
          const raw = await AsyncStorage.getItem(`TASKS_${list.name}`);
          const stored: TaskItem[] = raw ? JSON.parse(raw) : [];
          allTasks.push(...stored.map((t) => ({ ...t, listName: list.name })));
        }

        // Filter based on the special list type
        if (listId === "Flagged") {
          setTasks(allTasks.filter((t) => t.flagged && !t.recentlyDeleted));
        } else if (listId === "Completed") {
          setTasks(allTasks.filter((t) => t.done && !t.recentlyDeleted));
        } else if (listId === "Recently Deleted") {
          setTasks(allTasks.filter((t) => t.recentlyDeleted));
        } else {
          // For "All", "Today", "Scheduled" (you'd need date logic for Today/Scheduled)
          setTasks(allTasks.filter((t) => !t.recentlyDeleted));
        }
      } else {
        // Regular list, just load its tasks
        const raw = await AsyncStorage.getItem(`TASKS_${listId}`);
        const stored: TaskItem[] = raw ? JSON.parse(raw) : [];
        setTasks(
          stored.map((t) => ({
            ...t,
            flagged: t.flagged ?? false,
            recentlyDeleted: t.recentlyDeleted ?? false,
            indent: t.indent ?? 0,
          }))
        );
      }
    })();
  }, [listId, lists]);

  // Save whenever tasks change for regular lists
  useEffect(() => {
    // Only save for non-special lists
    if (!isSpecialList) {
      AsyncStorage.setItem(`TASKS_${listId}`, JSON.stringify(tasks));
    }
  }, [tasks, listId, isSpecialList]);

  // Function to update a task across all lists (for special lists)
  const updateTaskAcrossLists = async (
    taskId: string,
    listName: string,
    updateFn: (task: TaskItem) => TaskItem
  ) => {
    const raw = await AsyncStorage.getItem(`TASKS_${listName}`);
    if (raw) {
      const listTasks: TaskItem[] = JSON.parse(raw);
      const updatedTasks = listTasks.map((t) =>
        t.id === taskId ? updateFn(t) : t
      );
      await AsyncStorage.setItem(
        `TASKS_${listName}`,
        JSON.stringify(updatedTasks)
      );

      // Refresh the current view
      if (isSpecialList) {
        const updatedList = [...tasks];
        const taskIndex = updatedList.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          updatedList[taskIndex] = updateFn(updatedList[taskIndex]);
          setTasks(updatedList);
        }
      }
    }
  };

  // Function to handle indenting a task
  const handleIndent = (taskIndex: number) => {
    setTasks((prev) => {
      const updated = [...prev];
      const task = updated[taskIndex];

      // Toggle indent (0 to 1, 1 to 0)
      updated[taskIndex] = { ...task, indent: task.indent === 1 ? 0 : 1 };
      return updated;
    });
  };

  // Function to check if a task can be indented
  const canIndent = (taskIndex: number): boolean => {
    // Can't indent if it's the first task in the list or already indented
    if (taskIndex === 0 || tasks[taskIndex].indent === 1) {
      return false;
    }
    return true;
  };

  // Filter active and completed tasks
  const activeTasks = tasks.filter((t) => !t.done);
  const completedTasks = tasks.filter((t) => t.done);
  const [detailDesc, setDetailDesc] = useState("");
  // Function to mark a task as deleted
  const moveToRecentlyDeleted = (taskId: string, listName: string) => {
    if (isSpecialList && listName) {
      updateTaskAcrossLists(taskId, listName, (task) => ({
        ...task,
        recentlyDeleted: true,
      }));
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, recentlyDeleted: true } : t))
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.listTitleWrapper}>
        <Text style={styles.listTitle}>{listId}</Text>
      </View>

      <FlatList<ListItem>
        data={
          [...activeTasks, { isDivider: true }, ...completedTasks] as ListItem[]
        }
        keyExtractor={(item, index) =>
          "isDivider" in item ? `div-${index}` : item.id
        }
        renderItem={({ item, index }) => {
          if ("isDivider" in item) {
            return <View style={styles.divider} />;
          }

          // Calculate real index in the active tasks list
          const activeIndex = activeTasks.findIndex((t) => t.id === item.id);

          return (
            <Swipeable
              renderRightActions={() => (
                <Pressable
                  style={[styles.inlineButton, { backgroundColor: "#7f1d1d" }]}
                  onPress={() => {
                    // For special lists, we need to mark it as recently deleted in its original list
                    if (isSpecialList && "listName" in item) {
                      Alert.alert(
                        "Delete Task",
                        `Move "${item.text}" to Recently Deleted?`,
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            // @ts-ignore - we know listName exists
                            onPress: () =>
                              moveToRecentlyDeleted(item.id, item.listName),
                          },
                        ]
                      );
                    } else {
                      Alert.alert(
                        "Delete Task",
                        `Move "${item.text}" to Recently Deleted?`,
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
                    }
                  }}
                >
                  <FiBrtrash width={20} height={20} fill="#fecaca" />
                </Pressable>
              )}
              renderLeftActions={() => (
                <View style={{ flexDirection: "row" }}>
                  <Pressable
                    style={[
                      styles.inlineButton,
                      { backgroundColor: "#fbbf24" },
                    ]}
                    onPress={() => {
                      if (isSpecialList && "listName" in item) {
                        // @ts-ignore - we know listName exists
                        updateTaskAcrossLists(
                          item.id,
                          item.listName,
                          (task) => ({
                            ...task,
                            flagged: !task.flagged,
                          })
                        );
                      } else {
                        setTasks((prev) =>
                          prev.map((t) =>
                            t.id === item.id ? { ...t, flagged: !t.flagged } : t
                          )
                        );
                      }
                    }}
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
                      setRenameText(item.text);
                      setRenameModalVisible(true);
                    }}
                  >
                    <FiBredit width={20} height={20} fill="#2563eb" />
                  </Pressable>

                  {/* Indent/Outdent button for non-special lists */}
                  {!isSpecialList && activeIndex >= 0 && (
                    <Pressable
                      style={[
                        styles.inlineButton,
                        { backgroundColor: "rgb(16, 185, 129)" },
                      ]}
                      onPress={() => handleIndent(activeIndex)}
                      // Disable the button if indenting isn't possible
                      disabled={activeIndex === 0 && item.indent === 0}
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
                  // Only toggle when in a regular list (not a task-group view)
                  if (!isSpecialList) {
                    setTasks((prev) =>
                      prev.map((t) =>
                        t.id === item.id ? { ...t, done: !t.done } : t
                      )
                    );
                  }
                }}
                onLongPress={() => {
                  setSelectedTask(item);
                  setDetailDate(item.scheduleDate ?? getTomorrowMidnight());
                  setDetailColor(item.buttonColor ?? "");
                  setDetailDesc(item.text);
                  setDetailModalVisible(true);
                }}
              >
                <View
                  style={[
                    styles.taskItem,
                    item.indent === 1 && styles.indentedTask,
                    item.buttonColor
                      ? { backgroundColor: item.buttonColor }
                      : {},
                  ]}
                >
                  <Text style={styles.taskText}>{item.text}</Text>
                </View>
              </Pressable>
            </Swipeable>
          );
        }}
      />

      {/* Only show add task button if not in a special list */}
      {!isSpecialList && (
        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={() => setNewTaskModalVisible(true)}
        >
          <Text style={styles.addTaskButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      )}

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
              style={styles.modalInput}
            />
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                if (newTaskText.trim()) {
                  setTasks((prev) => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      text: newTaskText,
                      done: false,
                      flagged: false,
                      indent: 0,
                    },
                  ]);
                }
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
                  if (
                    isSpecialList &&
                    tasks.find((t) => t.id === renameTaskId && "listName" in t)
                  ) {
                    const task = tasks.find((t) => t.id === renameTaskId);
                    // @ts-ignore - we know listName exists
                    if (task && "listName" in task) {
                      // @ts-ignore - we know listName exists
                      updateTaskAcrossLists(
                        renameTaskId,
                        task.listName,
                        (t) => ({
                          ...t,
                          text: renameText,
                        })
                      );
                    }
                  } else {
                    setTasks((prev) =>
                      prev.map((t) =>
                        t.id === renameTaskId ? { ...t, text: renameText } : t
                      )
                    );
                  }
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
              placeholder={selectedTask?.text}
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
                  const updateFn = (t: TaskItem) => ({
                    ...t,
                    text: detailDesc, // ← new line
                    scheduleDate: detailDate,
                    buttonColor: detailColor,
                  });
                  if (isSpecialList && selectedTask.listName) {
                    updateTaskAcrossLists(
                      selectedTask.id,
                      selectedTask.listName,
                      updateFn
                    );
                  } else {
                    setTasks((prev) =>
                      prev.map((t) =>
                        t.id === selectedTask.id ? updateFn(t) : t
                      )
                    );
                  }
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
