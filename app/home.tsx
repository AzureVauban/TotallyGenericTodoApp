import { useTheme } from "@theme/ThemeContext";
import { colors } from "@theme/colors";
import { Link, useFocusEffect, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  FlatList,
  GestureHandlerGestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
  Swipeable,
} from "react-native-gesture-handler";
import FiBredit from "../assets/icons/svg/fi-br-text-box-edit.svg";
import FiBrtrash from "../assets/icons/svg/fi-br-trash.svg";
import { useTasks } from "../backend/storage/TasksContext";
import { playInvalidSound } from "../utils/playInvalidSound";
import { playRemoveSound } from "../utils/playRemoveSound";

// Task group buttons (green)
// Additional styles for new UI elements
const homeScreenStyles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.dark.tertiary,
    marginVertical: 10,
    width: 300,
    alignSelf: "center",
  },
  taskGroupRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 2,
    width: "100%",
  },
  taskGroupButtonText: {
    color: colors.light.primary,
    fontWeight: "bold",
    fontSize: 15,
  },
  taskListButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    width: 300,
    alignSelf: "center",
    shadowColor: colors.dark.primary,
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
    color: colors.light.accent,
    fontWeight: "500",
    fontSize: 16,
  },
  recentlyDeletedButton: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    margin: 2,
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: colors.dark.accent,
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
  renameButton: {
    backgroundColor: colors.light.secondary,
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
  recentlyDeletedText: {
    color: colors.light.text,
    fontWeight: "500",
    fontSize: 15,
  },
  scrollRegion: {
    backgroundColor: colors.light.secondary,
    borderRadius: 16,
    padding: 10,
    marginHorizontal: 12,
    marginTop: 18,
    marginBottom: 10,
    maxHeight: 350,
    minHeight: 200,
  },
  taskGroupButton: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    margin: 2,
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
  taskGroupsWrapper: {
    marginTop: 60,
    marginHorizontal: 10,
    marginBottom: 20,
    alignItems: "flex-start",
    marginLeft: 12,
    width: "100%",
  },
  addTaskListButton: {
    backgroundColor: colors.light.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "78.0%",
  },
  addTaskListButtonText: {
    color: colors.light.text,
    fontSize: 16,
    fontWeight: "500",
  },
});

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
    backgroundColor: colors.dark.primary,
    color: colors.dark.primary,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark.primary,
  },
  content: {
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.dark.accent,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark.accent,
    marginTop: 10,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingTop: 20,
    textAlign: "left",
    width: "100%",
  },
  button: {
    backgroundColor: colors.dark.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: colors.dark.text,
    fontWeight: "bold",
  },
  buttonSecondary: {
    backgroundColor: colors.dark.secondary,
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
    //color: colors.dark.secondary,
    //fill: colors.dark.secondary,
  },
  addTaskListButton: {
    backgroundColor: colors.light.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addTaskListButtonText: {
    color: colors.light.text,
    fontSize: 16,
    fontWeight: "500",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dark.tertiary,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 60,
    width: "100%",
    justifyContent: "space-between",
    borderColor: colors.dark.accent,
  },
  taskText: {
    flex: 1,
    color: colors.dark.text,
    fontSize: 16,
  },
  taskTextDone: {
    textDecorationLine: "line-through",
    color: colors.dark.text,
    opacity: 0.6,
  },
  taskDue: {
    color: colors.dark.accent,
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
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.dark.text,
    marginBottom: 12,
  },
  modalButton: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: colors.light.text,
    fontSize: 16,
  },
  modalOption: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.dark.tertiary,
  },
  showListsButtons: {
    width: 56,
    height: 56,
    borderRadius: 15,
    backgroundColor: colors.dark.primary,
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
    bottom: 24,
    left: 24,
    borderColor: colors.dark.accent,
    borderWidth: 1.5,
    color: colors.dark.accent,
  },
});

/**
 * **HomeScreen**
 *
 * Displays the list‑of‑lists “home” view where the user can:
 *  • Swipe **right‑to‑left** on a list button to reveal a red **Delete** action.
 *    Confirming the alert removes the list, pushes it to the *recentlyDeleted* state array,
 *    and persists the change via `saveTasks`.
 *  • Tap a list button to navigate to `/taskLists/<id>` using Expo Router.
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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { lists, addList, removeList, renameList, exportDataAsJSON } =
    useTasks();

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

  // Home screen component
  const router = useRouter();
  const hasNavigated = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      hasNavigated.current = false;
    }, [])
  );

  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = (
      event.nativeEvent as unknown as PanGestureHandlerEventPayload
    ).translationX;

    if (translationX < -100 && !hasNavigated.current) {
      hasNavigated.current = true;
      console.log("USER: HOME <= SETTINGS");
      router.push("/settingScreen");
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

  // Add-list duplicate error state
  const [duplicateError, setDuplicateError] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      exportDataAsJSON();
      hasNavigated.current = false;
      // no-op for theme
    }, [theme])
  );

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View
        style={[
          styles.screenbackground,
          {
            backgroundColor: isDark
              ? colors.dark.background
              : colors.light.background,
          },
        ]}
      >
        {/* Task Groups (Green Buttons) */}

        <View style={homeScreenStyles.taskGroupsWrapper}>
          <View style={homeScreenStyles.taskGroupRow}>
            <Link
              href="/taskLists/taskGroups/scheduledTasks"
              onPress={() => exportDataAsJSON()}
              style={[
                homeScreenStyles.taskGroupButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.primary
                    : colors.light.primary,
                },
              ]}
            >
              <Text
                style={[
                  homeScreenStyles.taskGroupButtonText,
                  {
                    color: isDark ? colors.light.primary : colors.dark.primary,
                  },
                ]}
              >
                Scheduled
              </Text>
            </Link>
            <Link
              href="/taskLists/taskGroups/allTasks"
              onPress={() => exportDataAsJSON()}
              style={[
                homeScreenStyles.taskGroupButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.primary
                    : colors.light.primary,
                },
              ]}
            >
              <Text
                style={[
                  homeScreenStyles.taskGroupButtonText,
                  {
                    color: isDark ? colors.light.primary : colors.dark.primary,
                  },
                ]}
              >
                All
              </Text>
            </Link>
          </View>
          <View style={homeScreenStyles.taskGroupRow}>
            <Link
              href="/taskLists/taskGroups/flaggedTasks"
              onPress={() => exportDataAsJSON()}
              style={[
                homeScreenStyles.taskGroupButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.primary
                    : colors.light.primary,
                },
              ]}
            >
              <Text
                style={[
                  homeScreenStyles.taskGroupButtonText,
                  {
                    color: isDark ? colors.light.primary : colors.dark.primary,
                  },
                ]}
              >
                Flagged
              </Text>
            </Link>
            <Link
              href="/taskLists/taskGroups/completedTasks"
              onPress={() => exportDataAsJSON()}
              style={[
                homeScreenStyles.taskGroupButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.primary
                    : colors.light.primary,
                },
              ]}
            >
              <Text
                style={[
                  homeScreenStyles.taskGroupButtonText,
                  {
                    color: isDark ? colors.light.primary : colors.dark.primary,
                  },
                ]}
              >
                Completed
              </Text>
            </Link>
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
                  renderRightActions={() => (
                    <Pressable
                      style={[
                        homeScreenStyles.inlineButton,
                        {
                          backgroundColor: isDark
                            ? colors.dark.redbutton_background
                            : colors.light.redbutton_background,
                        },
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
                                removeList(item.id);
                                playRemoveSound();
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
                  )}
                  renderLeftActions={() => (
                    <Pressable
                      style={[
                        homeScreenStyles.inlineButton,
                        {
                          backgroundColor: isDark
                            ? colors.dark.bluebutton_background
                            : colors.light.bluebutton_background,
                        },
                      ]}
                      onPress={() => {
                        setRenameTarget(item);
                        setRenameName(item.name);
                        setRenameError(false);
                        setRenameModalVisible(true);
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
                  )}
                >
                  <Pressable
                    style={[
                      homeScreenStyles.taskListButton,
                      {
                        backgroundColor: isDark
                          ? colors.dark.secondary
                          : colors.light.primary,
                      },
                    ]}
                    onPress={() => {
                      exportDataAsJSON();
                      router.push(`/taskLists/${item.name}` as const);
                    }}
                  >
                    <Text
                      style={[
                        homeScreenStyles.taskListButtonText,
                        {
                          color: isDark
                            ? colors.light.primary
                            : colors.dark.primary,
                        },
                      ]}
                    >
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
        <View
          style={{
            position: "absolute",
            bottom: 48, // moved it higher
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          {/* Divider just above button */}
          <View
            style={[
              homeScreenStyles.divider,
              { width: "90%", marginBottom: 8 },
            ]}
          />
          {/* Centered Add-Task-List button */}
          <TouchableOpacity
            style={[
              homeScreenStyles.addTaskListButton,
              {
                width: 300,
                backgroundColor: isDark
                  ? colors.dark.bluebutton_background
                  : colors.light.bluebutton_background,
              },
            ]}
            onPress={() => setAddModalVisible(true)}
          >
            <Text
              style={[
                homeScreenStyles.addTaskListButtonText,
                {
                  color: isDark
                    ? colors.dark.bluebutton_text_icon
                    : colors.light.bluebutton_text_icon,
                },
              ]}
            >
              + Add Task List
            </Text>
          </TouchableOpacity>
        </View>
        {/* Add List Modal */}
        <Modal visible={addModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: isDark
                    ? colors.dark.secondary
                    : colors.dark.secondary,
                },
              ]}
            >
              <Text style={styles.modalTitle}>New List</Text>
              <TextInput
                value={newListName}
                onChangeText={setNewListName}
                placeholder="List name"
                placeholderTextColor={colors.dark.text}
                style={{
                  borderWidth: 1,
                  borderColor: duplicateError
                    ? "#450a0a"
                    : colors.dark.tertiary,
                  color: colors.dark.text,
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              />
              {duplicateError && (
                <Text
                  style={{
                    color: colors.dark.accent,
                    marginBottom: 8,
                    fontSize: 12,
                  }}
                >
                  List name already exists
                </Text>
              )}
              <Pressable
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.dark.primary },
                ]}
                onPress={() => {
                  setAddModalVisible(false);
                  setNewListName("");
                  setDuplicateError(false);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
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
                  const trimmedName = newListName.trim();
                  // Check for duplicates (case-insensitive)
                  const isDuplicate = lists.some(
                    (list) =>
                      list.name.toLowerCase() === trimmedName.toLowerCase()
                  );
                  if (isDuplicate) {
                    playInvalidSound();
                    setDuplicateError(true);
                    return;
                  }
                  if (trimmedName) {
                    addList(trimmedName);
                    exportDataAsJSON();
                    setNewListName("");
                    setDuplicateError(false);
                    setAddModalVisible(false);
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {/* Removed Edit Task Modal as tasks are not managed here */}
        {/* Rename List Modal */}

        <Modal visible={renameModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: isDark
                    ? colors.dark.primary
                    : colors.light.primary,
                },
              ]}
            >
              <Text style={styles.modalTitle}>Rename List</Text>
              <TextInput
                value={renameName}
                onChangeText={(text) => {
                  setRenameName(text);
                  setRenameError(false);
                }}
                placeholder="New name"
                placeholderTextColor={colors.dark.text}
                style={{
                  borderWidth: 1,
                  borderColor: renameError ? "#450a0a" : colors.dark.tertiary,
                  borderRadius: 8,
                  padding: 8,
                  color: colors.dark.text,
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
                  if (!renameTarget) return;
                  const trimmedName = renameName.trim();
                  // Prevent duplicates (excluding the list being renamed), case‐insensitive
                  const normalized = trimmedName.toLowerCase();
                  const duplicate = lists
                    .filter((l) => l.id !== renameTarget.id)
                    .some((l) => l.name.trim().toLowerCase() === normalized);
                  if (duplicate || !trimmedName) {
                    playInvalidSound();
                    setRenameError(true);
                    return;
                  }
                  // Call context renameList to update storage and state
                  renameList(renameTarget.id, trimmedName);
                  // Navigate to the renamed list screen
                  router.replace(`/taskLists/${trimmedName}`);
                  setRenameModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    {
                      color: isDark
                        ? colors.dark.primary
                        : colors.light.primary,
                    },
                  ]}
                >
                  Ok
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: isDark
                      ? colors.dark.secondary
                      : colors.dark.secondary,
                  },
                ]}
                onPress={() => setRenameModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </PanGestureHandler>
  );
}
