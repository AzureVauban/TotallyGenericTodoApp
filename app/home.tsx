import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Modal, Pressable, Alert, TextInput } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StyleSheet } from "react-native";
import FiBrburger from "../assets/icons/svg/fi-br-0.svg";
import FiBrplus from "../assets/icons/svg/fi-br-plus.svg";
import FiBrtrash from "../assets/icons/svg/fi-br-trash.svg";
import FiBrcheck from "../assets/icons/svg/fi-br-list-check.svg";
import FiBredit from "../assets/icons/svg/fi-br-text-box-edit.svg";
import FiBrArrowTurnLeftUp from "../assets/icons/svg/fi-br-arrow-turn-left-up.svg";
import FiBrArrowSmallLeft from "../assets/icons/svg/fi-br-arrow-small-left.svg";
// simple JSON persistence (backend/storage/tasksStorage.ts)
import { loadTasks, saveTasks } from "../backend/storage/tasksStorage";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  PanGestureHandler,
  State,
  GestureHandlerGestureEvent,
  PanGestureHandlerEventPayload,
  Swipeable,
} from "react-native-gesture-handler";
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
  const [showOngoing, setShowOngoing] = useState(true);
  const [showCompletedList, setShowCompletedList] = useState(true);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      hasNavigated.current = false;
    }, [])
  );

  // Manage tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  // ──────────────────────────────────────────────
  //  Load persisted tasks on first mount
  // ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const all = await loadTasks();
      setTasks(all.filter((t) => !t.done));
      setDoneTasks(all.filter((t) => t.done));
    })();
  }, []);

  // Persist whenever either list changes
  useEffect(() => {
    saveTasks([...tasks, ...doneTasks]);
  }, [tasks, doneTasks]);

  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = (
      event.nativeEvent as unknown as PanGestureHandlerEventPayload
    ).translationX;

    if (translationX < -100 && !hasNavigated.current) {
      hasNavigated.current = true;
      console.log("USER: HOME <= SETTINGS");
      router.push("/settings");
    }
    if (translationX > 100 && !hasNavigated.current) {
      hasNavigated.current = true;
      console.log("USER: HOME => LEADERBOARD");
      router.push("/leaderboard");
    }

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

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View style={styles.screenbackground}>
        {/* Screen title */}
        <Pressable onPress={() => setShowOngoing((prev) => !prev)}>
          <Text style={styles.subtitle}>Ongoing Chores</Text>
        </Pressable>
        {showOngoing && (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Swipeable
                renderRightActions={() => (
                  <View style={{ height: "100%" }}>
                    {/* Delete (top‑half) */}
                    <Pressable
                      onPress={() => confirmDelete(item.id, false)}
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "red",
                        width: 80,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    >
                      <FiBrtrash width={20} height={20} fill="#fff" />
                    </Pressable>
                    {/* Edit (bottom‑half) */}
                    <Pressable
                      onPress={() => openEdit(item)}
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#2A9D8F", // blue from palette light_accents
                        width: 80,
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                      }}
                    >
                      <FiBredit
                        width={20}
                        height={20}
                        fill={COLORS.dark_primary}
                      />
                    </Pressable>
                  </View>
                )}
                renderLeftActions={() => (
                  <View style={{ height: "100%" }}>
                    {/* Un‑indent (only show if indent>0) */}
                    {!!item.indent && item.indent > 0 && (
                      <Pressable
                        onPress={() => {
                          setTasks((prev) =>
                            prev.map((t) =>
                              t.id === item.id
                                ? { ...t, indent: (t.indent || 1) - 1 }
                                : t
                            )
                          );
                        }}
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: COLORS.light_accents,
                          width: 80,
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                      >
                        <FiBrArrowSmallLeft
                          width={20}
                          height={20}
                          fill={COLORS.dark_primary}
                        />
                      </Pressable>
                    )}
                    {/* Indent */}
                    <Pressable
                      onPress={() => {
                        setTasks((prev) =>
                          prev.map((t) =>
                            t.id === item.id
                              ? { ...t, indent: (t.indent || 0) + 1 }
                              : t
                          )
                        );
                      }}
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: COLORS.dark_accents,
                        width: 80,
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                      }}
                    >
                      <FiBrArrowTurnLeftUp
                        width={20}
                        height={20}
                        fill={COLORS.dark_primary}
                      />
                    </Pressable>
                  </View>
                )}
              >
                <Pressable
                  onPress={() => {
                    // Move this task to done list
                    setTasks((prev) => prev.filter((t) => t.id !== item.id));
                    setDoneTasks((prev) => [...prev, { ...item, done: true }]);
                  }}
                >
                  <TaskItem
                    text={item.text}
                    due={item.due}
                    done={item.done}
                    indent={item.indent || 0}
                  />
                </Pressable>
              </Swipeable>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{
              paddingVertical: 5,
              paddingHorizontal: 16,
            }}
            style={{ flexGrow: 0 }}
          />
        )}
        {/* 
        <TouchableOpacity // HOME BUTTON
        >
          <FiBrhouse
            width={50}
            height={50}
            fill={COLORS.dark_accents}
            style={styles.homeButton}
          />
        </TouchableOpacity> */}
        <Pressable onPress={() => setShowCompletedList((prev) => !prev)}>
          <Text style={styles.subtitle}>Completed Chores</Text>
        </Pressable>
        {showCompletedList && (
          <FlatList
            data={doneTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Swipeable
                renderLeftActions={() => (
                  <Pressable
                    onPress={() => moveBackToOngoing(item.id)}
                    style={[
                      styles.leftAction,
                      { backgroundColor: COLORS.light_accents },
                    ]}
                  >
                    <FiBrArrowTurnLeftUp
                      width={20}
                      height={20}
                      fill={COLORS.dark_primary}
                    />
                  </Pressable>
                )}
                renderRightActions={() => (
                  <View style={{ height: "100%" }}>
                    {/* Delete (top‑half) */}
                    <Pressable
                      onPress={() => confirmDelete(item.id, true)}
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "red",
                        width: 80,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    >
                      <FiBrtrash width={20} height={20} fill="#fff" />
                    </Pressable>
                    {/* Edit (bottom‑half) */}
                    <Pressable
                      onPress={() => openEdit(item)}
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#2A9D8F",
                        width: 80,
                        borderBottomLeftRadius: 12,
                        borderBottomRightRadius: 12,
                      }}
                    >
                      <FiBredit
                        width={20}
                        height={20}
                        fill={COLORS.dark_primary}
                      />
                    </Pressable>
                  </View>
                )}
              >
                <Pressable>
                  <TaskItem
                    text={item.text}
                    due={item.due}
                    done={item.done}
                    indent={item.indent || 0}
                  />
                </Pressable>
              </Swipeable>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{
              paddingVertical: 5,
              paddingHorizontal: 16,
            }}
            style={{ flexGrow: 0 }}
          />
        )}
        {/* Add‑task button */}
        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={() => {
            // Add a new task
            console.log("Add Task");

            const formatted = new Date().toLocaleDateString();

            setShowTaskActions(true);
            setTasks((prev) =>
              prev.concat({
                id: Date.now().toString(),
                text: "New Task",
                due: formatted,
                done: false,
                indent: 0,
              })
            );
          }}
        >
          <FiBrplus width={25} height={25} fill={COLORS.dark_accents} />
        </TouchableOpacity>
        {/* Show‑lists button */}
        <TouchableOpacity
          style={styles.showListsButtons}
          onPress={() => {
            showModal ? setShowModal(false) : setShowModal(true);
          }}
        >
          <FiBrburger width={25} height={25} fill={COLORS.dark_accents} />
        </TouchableOpacity>
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
      </View>
    </PanGestureHandler>
  );
}
