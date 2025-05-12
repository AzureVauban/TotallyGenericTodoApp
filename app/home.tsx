import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import FiBrburger from "../assets/icons/svg/fi-br-0.svg";
import FiBrArrowSmallLeft from "../assets/icons/svg/fi-br-arrow-small-left.svg";
import FiBrArrowTurnLeftUp from "../assets/icons/svg/fi-br-arrow-turn-left-up.svg";
import FiBrcheck from "../assets/icons/svg/fi-br-list-check.svg";
import FiBrplus from "../assets/icons/svg/fi-br-plus.svg";
import FiBredit from "../assets/icons/svg/fi-br-text-box-edit.svg";
import FiBrtrash from "../assets/icons/svg/fi-br-trash.svg";
import { loadTasks, saveTasks } from "../backend/storage/tasksStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
// simple JSON persistence (backend/storage/tasksStorage.ts)
import { TouchableOpacity } from "react-native";
import {
  FlatList,
  GestureHandlerGestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
  Swipeable,
} from "react-native-gesture-handler";
import { useTasks } from "../context/TasksContext";
// Dummy user lists for demonstration
const myLists = [];

// Task group buttons (green)
const taskGroups = [
  { label: "Today" },
  { label: "Scheduled" },
  { label: "All" },
  { label: "Flagged" },
  { label: "Completed" },
];
// Additional styles for new UI elements
const homeScreenStyles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 10,
    width: 300,
    alignSelf: "center",
  },
  taskGroupRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 2, // reduced the spacing further
    width: "100%",
  },
  taskGroupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  taskListButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    width: 300,
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
    width: 50,
    height: 45,
    margin: 0,
    borderRadius: 8,
  },
  taskListButtonText: {
    color: "#93c5fd",
    fontWeight: "500",
    fontSize: 16,
  },
  recentlyDeletedButton: {
    backgroundColor: "#4A4A4A",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    margin: 2,
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#D9534F",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
  renameButton: {
    backgroundColor: "#5BC0DE",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
  recentlyDeletedText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 15,
  },
  scrollRegion: {
    backgroundColor: "#F4A261",
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 12,
    marginTop: 18,
    marginBottom: 10,
    maxHeight: 350,
    minHeight: 200,
  },
  taskGroupButton: {
    backgroundColor: "#4A4A4A",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    margin: 2, // reduced from 5 to 2
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
  taskGroupsWrapper: {
    marginHorizontal: 10,
    marginBottom: 20,
    alignItems: "flex-start",
    marginLeft: 12,
    width: "100%",
  },
});
/*
  Dark theme palette (left UI) with original hex codes:
    dark_primary:    #101010
    dark_secondary:  #1A1A1A
    dark_tertiary:   #373737
    dark_accents:    #F26C4F
    dark_subaccents: #C5C5C5

  Light theme palette (right UI) with original hex codes:
    light_primary:   #F26C4F
    light_secondary: #FFFFFF
    light_tertiary:  #CCCCCC
    light_accents:   #101010
    light_subaccents:#373737
*/
const COLORS = {
  //  Dark theme palette (left UI) with original hex codes:
  dark_primary: "#101010", // #101010
  dark_secondary: "#1A1A1A", // #1A1A1A
  dark_tertiary: "#373737", // #373737
  dark_accents: "#F26C4F", // #F26C4F
  dark_subaccents: "#C5C5C5", // #C5C5C5

  // Light theme palette (right UI) with original hex codes:
  light_primary: "#E76F51", // #E76F51
  light_secondary: "#F4A261", // #F4A261
  light_tertiary: "#E9C46A", // #E9C46A
  light_accents: "#2A9D8F", // #2A9D8F
  light_subaccents: "#264653", // #264653
};
const styles = StyleSheet.create({
  leftAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 12,
  },
  screenbackground: {
    flex: 1,
    backgroundColor: COLORS.dark_primary,
    color: COLORS.dark_primary,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#104C64",
  },
  content: {
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: COLORS.dark_accents,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.dark_accents,
    marginTop: 10,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingTop: 20,
    textAlign: "left",
    width: "100%",
  },
  button: {
    backgroundColor: COLORS.dark_secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#C6C6D0",
    fontWeight: "bold",
  },
  buttonSecondary: {
    backgroundColor: COLORS.dark_secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    //color: " #D59D80",
    //fill: COLORS.dark_secondary,
  },
  addTaskButton: {
    width: 56,
    height: 56,
    borderRadius: 15,
    backgroundColor: COLORS.dark_primary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 24,
    right: 24,
    borderColor: COLORS.dark_accents,
    borderWidth: 1.5,
  },
  homeButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.dark_primary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 24,
    right: 25,
    borderColor: COLORS.dark_accents,
    borderWidth: 2,
    top: 20,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.dark_tertiary,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 60,
    width: "100%",
    justifyContent: "space-between",
    borderColor: COLORS.dark_accents,
  },
  square: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.dark_accents,
    marginRight: 12,
  },
  squareDone: {
    backgroundColor: COLORS.dark_secondary,
  },
  taskText: {
    flex: 1,
    color: COLORS.dark_subaccents,
    fontSize: 16,
  },
  taskTextDone: {
    textDecorationLine: "line-through",
    color: COLORS.dark_subaccents, // ensure contrast against row background
    opacity: 0.6,
  },
  taskDue: {
    color: COLORS.dark_accents,
    fontSize: 14,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  modalContent: {
    width: "80%",
    backgroundColor: COLORS.dark_secondary,
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.dark_subaccents,
    marginBottom: 12,
  },
  modalOption: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.dark_tertiary,
  },
  showListsButtons: {
    width: 56,
    height: 56,
    borderRadius: 15,
    backgroundColor: COLORS.dark_primary,
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
    bottom: 24,
    left: 24,
    borderColor: COLORS.dark_accents,
    borderWidth: 1.5,
    color: COLORS.dark_accents,
  },
});

// dummy tasks data

type Task = {
  id: string;
  text: string;
  due: string;
  done: boolean;
  indent?: number; // optional, default 0
};

function TaskItem({
  text,
  due,
  done,
  indent,
}: {
  text: string;
  due: string;
  done: boolean;
  indent: number;
}) {
  // How much we visually shift the **contents** (not the row container) to the right
  const leftOffset = indent * 10; // 10 px per indent level

  // scale the little status circle but keep a sensible minimum
  const iconSize = Math.max(8, 20 - indent * 4);

  return (
    <View style={styles.taskRow}>
      {/* Give the whole row the normal width, but shift inner content */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          marginLeft: leftOffset,
        }}
      >
        <View
          style={[
            styles.square,
            done && styles.squareDone,
            {
              width: iconSize,
              height: iconSize,
              borderRadius: iconSize / 2,
            },
          ]}
        />
        <Text style={[styles.taskText, done && styles.taskTextDone]}>
          {text}
        </Text>
      </View>
      {!!due && <Text style={styles.taskDue}>{due}</Text>}
    </View>
  );
}

export default function HomeScreen() {
  const { lists, setLists } = useTasks();

  // Add-list modal state
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  // Rename modal state
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameName, setRenameName] = useState("");
  const [renameError, setRenameError] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // e.g. to add a new list:
  function addList(name: string) {
    setLists((prev) => [...prev, { id: Date.now().toString(), name }]);
  }
  // Home screen component
  const router = useRouter();
  const hasNavigated = useRef(false);
  // Modal state for task actions
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{
    id: string;
    text: string;
    due: string;
    done: boolean;
  } | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTaskActions, setShowTaskActions] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editText, setEditText] = useState("");
  const [editDue, setEditDue] = useState("");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  // State for toggling ongoing and completed lists
  //! const [showOngoing, setShowOngoing] = useState(true);
  //! const [showCompletedList, setShowCompletedList] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      hasNavigated.current = false;
    }, [])
  );

  // Manage tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState<any[]>([]);

  // ──────────────────────────────────────────────
  //  Load persisted tasks on first mount
  // ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const all = await loadTasks();
      setTasks(all.filter((t) => !t.done && !t.recentlyDeleted));
      setDoneTasks(all.filter((t) => t.done && !t.recentlyDeleted));
      setRecentlyDeleted(all.filter((t) => t.recentlyDeleted));
    })();
  }, []);

  // Persist whenever any list changes
  useEffect(() => {
    saveTasks([...tasks, ...doneTasks, ...recentlyDeleted]);
  }, [tasks, doneTasks, recentlyDeleted]);

  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = (
      event.nativeEvent as unknown as PanGestureHandlerEventPayload
    ).translationX;

    if (translationX < -100 && !hasNavigated.current) {
      hasNavigated.current = true;
      console.log("USER: HOME <= SETTINGS");
      router.push("/settings");
    }
    /*  if (translationX > 100 && !hasNavigated.current) {
      hasNavigated.current = true;
      console.log("USER: HOME => LEADERBOARD");
      router.push("/leaderboard");
    } */

    if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED ||
      event.nativeEvent.state === State.FAILED
    ) {
      setTimeout(() => {
        hasNavigated.current = false;
      }, 1500);
    }
  };

  const handleDelete = (id: string, done: boolean) => {
    if (done) {
      setDoneTasks((prev) => prev.filter((t) => t.id !== id));
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const confirmDelete = (id: string, done: boolean) => {
    Alert.alert("Delete task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDelete(id, done),
      },
    ]);
  };

  const openEdit = (item: {
    id: string;
    text: string;
    due: string;
    done: boolean;
  }) => {
    setEditTaskId(item.id);
    setEditText(item.text);
    setEditDue(item.due);
    setEditModalVisible(true);
  };

  const moveBackToOngoing = (id: string) => {
    const task = doneTasks.find((t) => t.id === id);
    if (!task) return;
    setDoneTasks((prev) => prev.filter((t) => t.id !== id));
    setTasks((prev) => [...prev, { ...task, done: false }]);
  };

  const saveEdit = () => {
    if (!editTaskId) {
      return;
    }
    const apply = (list: any[]) =>
      list.map((t) =>
        t.id === editTaskId ? { ...t, text: editText, due: editDue } : t
      );
    setTasks((prev) => apply(prev));
    setDoneTasks((prev) => apply(prev));
    setEditModalVisible(false);
  };

  // Add-list duplicate error state
  const [duplicateError, setDuplicateError] = useState(false);

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View style={styles.screenbackground}>
        {/* Search Bar */}

        {/* Task Groups (Green Buttons) */}
        <View style={homeScreenStyles.taskGroupsWrapper}>
          <View style={homeScreenStyles.taskGroupRow}>
            <Pressable
              style={homeScreenStyles.taskGroupButton}
              onPress={() => router.push(`/myList/Today` as const)}
            >
              <Text style={homeScreenStyles.taskGroupButtonText}>Today</Text>
            </Pressable>
            <Pressable
              style={homeScreenStyles.taskGroupButton}
              onPress={() => router.push(`/myList/Scheduled` as const)}
            >
              <Text style={homeScreenStyles.taskGroupButtonText}>
                Scheduled
              </Text>
            </Pressable>
          </View>
          <View style={homeScreenStyles.taskGroupRow}>
            <Pressable
              style={homeScreenStyles.taskGroupButton}
              onPress={() => router.push(`/myList/All` as const)}
            >
              <Text style={homeScreenStyles.taskGroupButtonText}>All</Text>
            </Pressable>
            <Pressable
              style={homeScreenStyles.taskGroupButton}
              onPress={() => router.push(`/myList/Flagged` as const)}
            >
              <Text style={homeScreenStyles.taskGroupButtonText}>Flagged</Text>
            </Pressable>
          </View>
          <View style={homeScreenStyles.taskGroupRow}>
            <Pressable
              style={homeScreenStyles.taskGroupButton}
              onPress={() => router.push(`/myList/Completed` as const)}
            >
              <Text style={homeScreenStyles.taskGroupButtonText}>
                Completed
              </Text>
            </Pressable>
            <Pressable
              style={homeScreenStyles.recentlyDeletedButton}
              onPress={() => router.push(`/myList/Recently Deleted` as const)}
            >
              <Text style={homeScreenStyles.recentlyDeletedText}>
                Recently Deleted
              </Text>
            </Pressable>
          </View>
          <View style={homeScreenStyles.divider} />
        </View>
        {/* User Lists (Blue Scrollable Region) */}
        <View style={{ marginTop: 200 }}>
          <View style={homeScreenStyles.divider} />
          <ScrollView
            style={{ flexGrow: 0, maxHeight: 220 }}
            contentContainerStyle={{ paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
          >
            <FlatList
              data={lists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Swipeable
                  renderRightActions={(progress, dragX) => (
                    <Pressable
                      style={[
                        homeScreenStyles.inlineButton,
                        { backgroundColor: "#7f1d1d" },
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
                                // remove list button
                                setLists((prev) =>
                                  prev.filter((l) => l.id !== item.id)
                                );
                                // move to recently deleted
                                setRecentlyDeleted((prev) => [
                                  ...prev,
                                  { ...item, recentlyDeleted: true },
                                ]);
                              },
                            },
                          ]
                        );
                      }}
                    >
                      <FiBrtrash width={20} height={20} fill="#fecaca" />
                    </Pressable>
                  )}
                  renderLeftActions={(progress, dragX) => (
                    <Pressable
                      style={[
                        homeScreenStyles.inlineButton,
                        { backgroundColor: "#93c5fd" },
                      ]}
                      onPress={() => {
                        setRenameTarget(item);
                        setRenameName(item.name);
                        setRenameError(true);
                        setRenameModalVisible(true);
                      }}
                    >
                      <FiBredit width={20} height={20} fill="#2563eb" />
                    </Pressable>
                  )}
                >
                  <Pressable
                    style={homeScreenStyles.taskListButton}
                    onPress={() => router.push(`/myList/${item.name}` as const)}
                  >
                    <Text style={homeScreenStyles.taskListButtonText}>
                      {item.name}
                    </Text>
                  </Pressable>
                </Swipeable>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
              scrollEnabled={false}
            />
          </ScrollView>
        </View>
        {/* --- The rest of the original task/chores UI could be rendered below this, if needed --- */}
        {/* Add‑task button */}
        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={() => {
            setAddModalVisible(true);
          }}
        >
          <FiBrplus width={25} height={25} fill={COLORS.dark_accents} />
        </TouchableOpacity>
        {/* Add List Modal */}
        {/* Add List Modal */}
        <Modal visible={addModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New List</Text>
              <TextInput
                value={newListName}
                onChangeText={setNewListName}
                placeholder="List name"
                placeholderTextColor={COLORS.dark_subaccents}
                style={{
                  borderWidth: 1,
                  borderColor: duplicateError
                    ? "#450a0a"
                    : COLORS.dark_tertiary,
                  color: COLORS.dark_subaccents,
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              />
              {duplicateError && (
                <Text
                  style={{ color: "#ef4444", marginBottom: 8, fontSize: 12 }}
                >
                  List name already exists
                </Text>
              )}
              <Pressable
                onPress={() => {
                  setAddModalVisible(false);
                  setNewListName("");
                  setDuplicateError(false);
                }}
                style={[
                  styles.button,
                  { backgroundColor: "#2563eb", marginBottom: 8 },
                ]}
              >
                <Text
                  style={[styles.buttonText, { color: COLORS.dark_primary }]}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  const trimmedName = newListName.trim();

                  // Check for duplicates (case-insensitive)
                  const isDuplicate = lists.some(
                    (list) =>
                      list.name.toLowerCase() === trimmedName.toLowerCase()
                  );

                  if (isDuplicate) {
                    setDuplicateError(true);
                    return;
                  }

                  if (trimmedName) {
                    setLists((prev) => [
                      ...prev,
                      { id: Date.now().toString(), name: trimmedName },
                    ]);
                    setNewListName("");
                    setDuplicateError(false);
                    setAddModalVisible(false);
                  }
                }}
                style={[styles.button, { backgroundColor: "#2563eb" }]}
              >
                <Text
                  style={[styles.buttonText, { color: COLORS.dark_primary }]}
                >
                  Add
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal visible={editModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            {/* Dark translucent backdrop that dims the underlying screen */}
            <View style={styles.modalContent}>
              {/* White/grey card that holds all editable controls */}
              <Text style={styles.modalTitle}>Edit Task</Text>
              {/* Editable task description */}
              <TextInput
                value={editText}
                onChangeText={setEditText}
                placeholder="Description"
                placeholderTextColor={COLORS.dark_subaccents}
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.dark_tertiary,
                  color: COLORS.dark_subaccents,
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              />
              {/* Editable due date */}
              <TextInput
                value={editDue}
                onChangeText={setEditDue}
                placeholder="Due date"
                placeholderTextColor={COLORS.dark_subaccents}
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.dark_tertiary,
                  color: COLORS.dark_subaccents,
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              />
              {/* Action buttons – Cancel first, then Save */}
              <View
                style={{
                  marginTop: 8,
                }}
              >
                <Pressable
                  onPress={() => setEditModalVisible(false)}
                  style={[
                    {
                      backgroundColor: COLORS.dark_accents,
                      paddingVertical: 10,
                      borderRadius: 8,
                      marginBottom: 8,
                      alignItems: "center",
                    },
                  ]} // Close modal without saving
                >
                  <Text
                    style={[styles.buttonText, { color: COLORS.dark_primary }]}
                  >
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={saveEdit}
                  style={[
                    {
                      backgroundColor: COLORS.dark_accents,
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text
                    style={[styles.buttonText, { color: COLORS.dark_primary }]}
                  >
                    Save
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        {/* Rename List Modal */}
        <Modal visible={renameModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Rename List</Text>
              <TextInput
                value={renameName}
                onChangeText={(text) => {
                  setRenameName(text);
                  setRenameError(false);
                }}
                placeholder="New name"
                placeholderTextColor={COLORS.dark_subaccents}
                style={{
                  borderWidth: 1,
                  borderColor: renameError ? "#450a0a" : COLORS.dark_tertiary,
                  borderRadius: 8,
                  padding: 8,
                  color: COLORS.dark_subaccents,
                  marginBottom: 10,
                }}
              />
              <Pressable
                style={styles.button}
                onPress={async () => {
                  if (!renameTarget) return;
                  const trimmedName = renameName.trim();
                  // Prevent duplicates (excluding the list being renamed), case‐insensitive
                  if (renameTarget) {
                    const normalized = trimmedName.toLowerCase();
                    const duplicate = lists
                      .filter((l) => l.id !== renameTarget.id)
                      .some((l) => l.name.trim().toLowerCase() === normalized);
                    if (duplicate) {
                      setRenameError(true);
                      return;
                    }
                  }
                  const oldKey = `TASKS_${renameTarget.id}`;
                  const newKey = `TASKS_${trimmedName}`;
                  const raw = await AsyncStorage.getItem(oldKey);
                  if (raw !== null) {
                    await AsyncStorage.setItem(newKey, raw);
                    await AsyncStorage.removeItem(oldKey);
                  }
                  setLists((prev) =>
                    prev.map((l) =>
                      l.id === renameTarget.id
                        ? { ...l, id: trimmedName, name: trimmedName }
                        : l
                    )
                  );
                  router.replace(`/myList/${trimmedName}`);
                  setRenameModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>OK</Text>
              </Pressable>
              <Pressable
                style={[styles.button, { marginTop: 8 }]}
                onPress={() => setRenameModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </PanGestureHandler>
  );
}
