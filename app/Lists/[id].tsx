import React, { useRef, useState } from "react";

import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {
  GestureHandlerGestureEvent,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { Calendar } from "react-native-calendars";
import { colors } from "@theme/colors";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "lib/ThemeContext";

import FiBrArrowLeft from "../../assets/icons/svg/fi-br-arrow-alt-left.svg";
import FiBrArrowRight from "../../assets/icons/svg/fi-br-arrow-alt-right.svg";
import FiBrCalendar from "../../assets/icons/svg/fi-br-calendar.svg";
import FiBredit from "../../assets/icons/svg/fi-br-text-box-edit.svg";
import FiBrflagAlt from "../../assets/icons/svg/fi-br-flag-alt.svg";
import FiBrsettings from "../../assets/icons/svg/fi-br-settings.svg";
import FiBrtrash from "../../assets/icons/svg/fi-br-trash.svg";
import ModalWrapper from "../components/ModalWrapper";
import {
  Task as ContextTask,
  useTasks,
} from "../../backend/storage/TasksContext";
import { playCompleteSound } from "../../utils/sounds/completed";
import { playFlaggedSound } from "../../utils/sounds/flag";
import { playIndentTasksound } from "../../utils/sounds/indent";
import { playInvalidSound } from "../../utils/sounds/invalid";
import { playRemoveSound } from "../../utils/sounds/trash";
import { playRenameTaskSound } from "../../utils/sounds/remove";
import { playUnflaggedSound } from "../../utils/sounds/unflag";
import { styles } from "../theme/styles";

export default function MyList() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  useFocusEffect(
    React.useCallback(() => {
      exportDataAsJSON();
      // no-op, but ensures re-render on theme change
    }, [theme])
  );
  const router = useRouter();
  const hasNavigated = useRef(false);
  const { id } = useLocalSearchParams();
  // Ensure id is a string
  const listId = Array.isArray(id) ? id[0] : id;
  // Update context import to include flagTask and indentTask
  const {
    tasks,
    addTask,
    toggleTask,
    removeTask,
    updateTaskText,
    updateTask,
    flagTask,
    indentTask,
    reorderTasks: reorderTask,
    exportDataAsJSON,
  } = useTasks();

  // Handler for flagging a task using context method
  const handleFlagToggle = (taskId: string) => {
    const isCurrentlyFlagged =
      tasks.find((t) => t.id === taskId)?.flagged ?? false;
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
  const [selectedTask, setSelectedTask] = useState<ContextTask | null>(null);
  const [detailDate, setDetailDate] = useState("");
  const [detailColor, setDetailColor] = useState("");
  const [newTaskError, setNewTaskError] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Helper to format date as "PPP" (e.g., "Apr 27, 2024")
  function formatDatePPP(dateStr: string | undefined) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Dynamic route: only for regular lists, never special lists
  const isSpecialList = false;

  // Remove useEffect hooks for loading/saving tasks - handled by context now

  // No-op for updateTaskAcrossLists; not needed for regular lists
  const updateTaskAcrossLists = async (
    taskId: string,
    listName: string,
    updateFn: (task: ContextTask) => ContextTask
  ) => {};

  // Function to handle indenting a task (calls context method)
  const handleIndentById = (taskId: string) => {
    handleIndentToggle(taskId);
  };

  // Function to check if a task can be indented
  // (implementation omitted, as indent is not handled by context)

  // Only show tasks for this list
  const listTasks = tasks.filter((t) => (t as ContextTask).listName === listId);
  // Custom active and completed filters
  const activeTasks = listTasks.filter((t, i) => {
    if (t.indent === 0) {
      // only include parent if not completed
      return !t.completed;
    }
    // for subtasks, include until parent and all siblings are completed
    let j = i - 1;
    while (j >= 0 && listTasks[j].indent === 1) j--;
    const parent = listTasks[j];
    let allSibsCompleted = true;
    for (
      let k = j + 1;
      k < listTasks.length && listTasks[k].indent === 1;
      k++
    ) {
      if (!listTasks[k].completed) {
        allSibsCompleted = false;
        break;
      }
    }
    // show subtask until parent+siblings complete
    return !(parent.completed && allSibsCompleted);
  });
  const completedTasks = listTasks.filter((t, i) => {
    if (t.indent === 0) {
      // only parents that are completed
      return t.completed;
    }
    // for subtasks, only include once parent and all siblings are completed
    let j = i - 1;
    while (j >= 0 && listTasks[j].indent === 1) j--;
    const parent = listTasks[j];
    let allSibsCompleted = true;
    for (
      let k = j + 1;
      k < listTasks.length && listTasks[k].indent === 1;
      k++
    ) {
      if (!listTasks[k].completed) {
        allSibsCompleted = false;
        break;
      }
    }
    return parent.completed && allSibsCompleted;
  });
  const [detailDesc, setDetailDesc] = useState("");
  // Function to mark a task as deleted (should use removeTask from context)
  const moveToRecentlyDeleted = (taskId: string, listName: string) => {
    removeTask(taskId);
  };
  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = event.nativeEvent.translationX as number;

    // Left-swipe (>100px to the left) → Home
    if (translationX > 100 && !hasNavigated.current) {
      hasNavigated.current = true;
      console.log(`USER: ${listId} <= HOME`);
      router.push("/home");
    }

    // Reset navigation lock after gesture ends
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
  // TODO: When dragging a parent task, also move its following subtasks as a group.
  //       Implement custom onDragBegin/onDragEnd to splice the subtasks array slice
  //       along with the parent to the new index position.

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark
          ? colors.dark.background
          : colors.light.background,
      }}
    >
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <View
          style={[
            styles.container,
            {
              flex: 1,
              backgroundColor: isDark
                ? colors.dark.background
                : colors.light.background,
            },
          ]}
        >
          <View style={styles.listTitleWrapper}>
            <Text
              style={[
                styles.listTitle,
                {
                  color: isDark
                    ? colors.dark.bluebutton_background
                    : colors.light.bluebutton_background,
                },
              ]}
            >
              {listId}
            </Text>
          </View>

          <DraggableFlatList
            data={activeTasks as ContextTask[]}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            onDragEnd={({ data }) => reorderTask(listId, data)}
            renderItem={({
              item,
              drag,
              getIndex,
            }: RenderItemParams<ContextTask>) => {
              const index = getIndex();
              const activeIndex = activeTasks.findIndex(
                (t) => t.id === item.id
              );
              function getTomorrowMidnight(): string {
                const now = new Date();
                const tomorrow = new Date(now);
                tomorrow.setDate(now.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                // Return as YYYY-MM-DD string
                return tomorrow.toISOString().slice(0, 10);
              }
              return (
                <Swipeable
                  renderRightActions={() => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "stretch",
                        marginBottom: 5,
                      }}
                    >
                      <Pressable
                        style={[
                          styles.inlineButton,
                          {
                            backgroundColor: isDark
                              ? colors.dark.purplebutton_background
                              : colors.light.purplebutton_background,
                          },
                        ]}
                        onPress={() => {
                          setSelectedTask(item);
                          setDetailDate(
                            item.scheduleDate ?? getTomorrowMidnight()
                          );
                          setDetailColor(item.buttonColor ?? "");
                          setDetailDesc(item.title);
                          setDetailModalVisible(true);
                          exportDataAsJSON();
                        }}
                      >
                        <FiBrsettings
                          width={20}
                          height={20}
                          fill={
                            isDark
                              ? colors.dark.purplebutton_text_icon
                              : colors.light.purplebutton_text_icon
                          }
                        />
                      </Pressable>
                      <Pressable
                        style={[
                          styles.inlineButton,
                          {
                            backgroundColor: isDark
                              ? colors.dark.redbutton_background
                              : colors.light.redbutton_background,
                          },
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
                                onPress: () => {
                                  playRemoveSound();
                                  moveToRecentlyDeleted(item.id, listId);
                                  exportDataAsJSON();
                                },
                              },
                            ]
                          );
                        }}
                      >
                        <FiBrtrash
                          width={20}
                          height={20}
                          fill={
                            isDark
                              ? colors.dark.redbutton_text_icon
                              : colors.light.redbutton_text_icon
                          }
                        />
                      </Pressable>
                    </View>
                  )}
                  renderLeftActions={() => (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "stretch",
                        marginBottom: 5,
                      }}
                    >
                      <Pressable
                        style={[
                          styles.inlineButton,
                          {
                            backgroundColor: isDark
                              ? colors.dark.yellowbutton_background
                              : colors.light.yellowbutton_background,
                          },
                        ]}
                        onPress={() => {
                          const wasFlagged = item.flagged;
                          handleFlagToggle(item.id);
                          if (!wasFlagged) {
                            playFlaggedSound();
                          } else {
                            playUnflaggedSound();
                          }
                          exportDataAsJSON();
                        }}
                      >
                        <FiBrflagAlt
                          width={20}
                          height={20}
                          fill={
                            isDark
                              ? colors.dark.yellowbutton_text_icon
                              : colors.light.yellowbutton_text_icon
                          }
                        />
                      </Pressable>
                      <Pressable
                        style={[
                          styles.inlineButton,
                          {
                            backgroundColor: isDark
                              ? colors.dark.bluebutton_background
                              : colors.light.bluebutton_background,
                          },
                        ]}
                        onPress={() => {
                          setRenameTaskId(item.id);
                          setRenameText(item.title);
                          setRenameModalVisible(true);
                          exportDataAsJSON();
                        }}
                      >
                        <FiBredit
                          width={20}
                          height={20}
                          fill={
                            isDark
                              ? colors.dark.bluebutton_text_icon
                              : colors.light.bluebutton_text_icon
                          }
                        />
                      </Pressable>
                      {/* Indent/Outdent button for non-special lists */}
                      {activeIndex >= 0 && (
                        <Pressable
                          style={[
                            styles.inlineButton,
                            {
                              backgroundColor: isDark
                                ? colors.dark.greenbutton_background
                                : colors.light.greenbutton_background,
                            },
                          ]}
                          onPress={() => {
                            playIndentTasksound();
                            handleIndentById(item.id);
                            exportDataAsJSON();
                          }}
                        >
                          {item.indent === 1 ? (
                            <FiBrArrowLeft
                              width={20}
                              height={20}
                              fill={
                                isDark
                                  ? colors.dark.greenbutton_text_icon
                                  : colors.light.greenbutton_text_icon
                              }
                            />
                          ) : (
                            <FiBrArrowRight
                              width={20}
                              height={20}
                              fill={
                                isDark
                                  ? colors.dark.greenbutton_text_icon
                                  : colors.light.greenbutton_text_icon
                              }
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
                        const idx = listTasks.findIndex(
                          (t) => t.id === item.id
                        );
                        let hasIncompleteSub = false;
                        for (let j = idx + 1; j < listTasks.length; j++) {
                          if (listTasks[j].indent !== 1) break;
                          if (!listTasks[j].completed) {
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
                      const willComplete = !item.completed;
                      toggleTask(item.id);
                      if (willComplete) {
                        playCompleteSound();
                      }
                      exportDataAsJSON();
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
                        item.completed
                          ? { backgroundColor: colors.dark.secondary }
                          : item.buttonColor
                          ? { backgroundColor: item.buttonColor }
                          : {
                              backgroundColor: isDark
                                ? colors.dark.primary
                                : colors.light.accent,
                            },
                      ]}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={[
                            styles.taskText,
                            {
                              color: isDark
                                ? colors.dark.text
                                : colors.dark.primary,
                            },
                            item.completed && {
                              textDecorationLine: "line-through",
                              color: colors.dark.tertiary,
                            },
                            item.indent === 1 &&
                              item.completed && {
                                textDecorationLine: "line-through",
                                color: colors.dark.tertiary,
                              },
                          ]}
                        >
                          {item.title}
                        </Text>
                        {item.flagged && (
                          <FiBrflagAlt
                            width={18}
                            height={18}
                            style={{ marginLeft: 8 }}
                            fill={isDark ? "#fbbf24" : "#d97706"}
                          />
                        )}
                      </View>
                    </View>
                  </Pressable>
                </Swipeable>
              );
            }}
          />

          {completedTasks.length > 0 && (
            <>
              <View style={styles.divider} />
              <FlatList<ContextTask>
                data={completedTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      toggleTask(item.id);
                      exportDataAsJSON();
                    }}
                  >
                    <View
                      style={[
                        styles.taskItem,
                        item.indent === 1 && styles.indentedTask,
                        { backgroundColor: colors.dark.secondary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.taskText,
                          {
                            textDecorationLine: "line-through",
                            color: colors.dark.tertiary,
                          },
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
            style={[
              styles.addTaskButton,
              {
                backgroundColor: isDark
                  ? colors.dark.bluebutton_background
                  : colors.light.bluebutton_background,
              },
            ]}
            onPress={() => setNewTaskModalVisible(true)}
          >
            <Text
              style={[
                styles.addTaskButtonText,
                {
                  color: isDark
                    ? colors.dark.bluebutton_text_icon
                    : colors.light.bluebutton_text_icon,
                },
              ]}
            >
              + Add Task
            </Text>
          </TouchableOpacity>

          {/* New Task Modal */}
          <ModalWrapper
            visible={newTaskModalVisible}
            onRequestClose={() => {
              setNewTaskText("");
              setNewTaskError("");
              setNewTaskModalVisible(false);
            }}
          >
            <Text style={styles.modalTitle}>New Task</Text>
            <TextInput
              value={newTaskText}
              onChangeText={setNewTaskText}
              placeholder="Task description"
              placeholderTextColor={colors.dark.text}
              style={{
                borderWidth: 1,
                borderColor: newTaskError ? "#450a0a" : colors.dark.tertiary,
                color: colors.dark.text,
                padding: 8,
                borderRadius: 8,
                marginBottom: 10,
              }}
            />
            {newTaskError ? (
              <Text
                style={{
                  color: colors.dark.accent,
                  marginBottom: 8,
                  fontSize: 12,
                }}
              >
                {newTaskError}
              </Text>
            ) : null}
            <Pressable
              style={[
                styles.modalButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.primary
                    : colors.light.primary,
                },
              ]}
              onPress={async () => {
                const desc = newTaskText?.trim();
                if (!desc) {
                  setNewTaskError("Please enter a task description.");
                  return;
                }
                if (listTasks.some((t) => t.title.trim() === desc)) {
                  playInvalidSound();
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
              style={[
                styles.modalButton,
                { backgroundColor: colors.dark.primary },
              ]}
              onPress={() => {
                setNewTaskText("");
                setNewTaskError("");
                setNewTaskModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </ModalWrapper>

          {/* Rename Task Modal */}
          <ModalWrapper
            visible={renameModalVisible}
            onRequestClose={() => {
              setRenameText("");
              setRenameTaskId(null);
              setRenameModalVisible(false);
            }}
          >
            <Text style={styles.modalTitle}>Rename Task</Text>
            <TextInput
              value={renameText}
              onChangeText={setRenameText}
              placeholder="Task description"
              placeholderTextColor={colors.dark.text}
              style={{
                borderWidth: 1,
                borderColor: colors.dark.tertiary,
                color: colors.dark.text,
                padding: 8,
                borderRadius: 8,
                marginBottom: 10,
              }}
            />
            <Pressable
              style={[
                styles.modalButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.primary
                    : colors.light.primary,
                },
              ]}
              onPress={() => {
                if (renameText.trim() && renameTaskId) {
                  updateTaskText(renameTaskId, renameText);
                  playRenameTaskSound();
                }
                setRenameText("");
                setRenameTaskId(null);
                setRenameModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </Pressable>
            <Pressable
              style={[
                styles.modalButton,
                { backgroundColor: colors.dark.primary },
              ]}
              onPress={() => {
                setRenameText("");
                setRenameTaskId(null);
                setRenameModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </ModalWrapper>

          {/* Task Details Modal */}
          <ModalWrapper
            visible={detailModalVisible}
            onRequestClose={() => setDetailModalVisible(false)}
          >
            <Text style={styles.modalTitle}>Task Details</Text>
            <TextInput
              value={detailDesc}
              onChangeText={setDetailDesc}
              placeholder={selectedTask?.title}
              placeholderTextColor={colors.dark.text}
              style={{
                borderWidth: 1,
                borderColor: colors.dark.tertiary,
                color: colors.dark.text,
                padding: 8,
                borderRadius: 8,
                marginBottom: 10,
              }}
            />

            {/* Popover-style Date Picker */}
            <View style={{ marginBottom: 10 }}>
              <Text style={{ color: colors.dark.text, marginBottom: 6 }}>
                Scheduled Date
              </Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.dark.tertiary,
                  borderRadius: 8,
                  padding: 10,
                  backgroundColor: isDark
                    ? colors.dark.secondary
                    : colors.light.secondary,
                }}
              >
                <FiBrCalendar
                  width={22}
                  height={22}
                  fill={
                    isDark
                      ? colors.dark.bluebutton_background
                      : colors.light.bluebutton_background
                  }
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    color: detailDate ? colors.dark.text : colors.dark.tertiary,
                    fontSize: 16,
                  }}
                >
                  {detailDate ? formatDatePPP(detailDate) : "Pick a date"}
                </Text>
              </Pressable>
              {showDatePicker && (
                <Modal
                  transparent
                  animationType="fade"
                  visible={showDatePicker}
                  onRequestClose={() => setShowDatePicker(false)}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,0.3)",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: isDark
                          ? colors.dark.secondary
                          : colors.light.secondary,
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <Calendar
                        markedDates={
                          detailDate
                            ? {
                                [detailDate]: {
                                  selected: true,
                                  selectedColor: isDark
                                    ? colors.dark.bluebutton_background
                                    : colors.light.bluebutton_background,
                                  customStyles: {
                                    container: {
                                      borderRadius: 12,
                                      width: 36,
                                      height: 36,
                                      alignItems: "center",
                                      justifyContent: "center",
                                    },
                                    text: {
                                      color: "#fff",
                                      fontWeight: "bold",
                                    },
                                  },
                                },
                              }
                            : {}
                        }
                        markingType="custom"
                        onDayPress={(day) => {
                          setDetailDate(day.dateString);
                          setShowDatePicker(false);
                        }}
                        theme={{
                          backgroundColor: isDark
                            ? colors.dark.secondary
                            : colors.light.secondary,
                          calendarBackground: isDark
                            ? colors.dark.secondary
                            : colors.light.secondary,
                          textSectionTitleColor: colors.dark.text,
                          selectedDayBackgroundColor: "transparent",
                          selectedDayTextColor: "#fff",
                          todayTextColor: "#facc15",
                          dayTextColor: colors.dark.text,
                          textDisabledColor: "#d1d5db",
                          arrowColor: colors.dark.text,
                          monthTextColor: colors.dark.text,
                        }}
                        style={{
                          borderRadius: 12,
                          minWidth: 320,
                        }}
                      />
                      <Pressable
                        style={{
                          marginTop: 12,
                          alignSelf: "flex-end",
                          padding: 8,
                        }}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Text style={{ color: colors.dark.text }}>Close</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              )}
            </View>

            {/* Color picker swatches grid */}
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
              placeholderTextColor={colors.dark.text}
              style={{
                borderWidth: 1,
                borderColor: colors.dark.tertiary,
                color: colors.dark.text,
                padding: 8,
                borderRadius: 8,
                marginBottom: 10,
              }}
            />
            {/* Reset Color Button */}
            <Pressable
              style={[
                styles.modalButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.primary
                    : colors.light.primary,
                  marginBottom: 8,
                },
              ]}
              onPress={() => setDetailColor("")}
            >
              <Text style={styles.modalButtonText}>Reset Color</Text>
            </Pressable>
            {/* Save Button */}
            <Pressable
              style={[
                styles.modalButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.primary
                    : colors.light.primary,
                },
              ]}
              onPress={() => {
                if (selectedTask) {
                  const updateFn = (t: ContextTask) => ({
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
              style={[
                styles.modalButton,
                { backgroundColor: colors.dark.primary },
              ]}
              onPress={() => setDetailModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </ModalWrapper>
        </View>
      </PanGestureHandler>
    </SafeAreaView>
  );
}
