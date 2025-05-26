/*
TODO FUTURE ADDITIONS
- dynmaic List title text color contrasting (revising this description)
*/

/**
 * Home screen of the application.
 * Displays grouped task categories and user-defined task lists.
 * Supports swipe gestures to navigate to the settings screen and manage lists.
 * Includes modals for adding and renaming task lists.
 */
import { useTheme } from "lib/ThemeContext";
import { colors } from "@theme/colors";
import { styles, getNavibarIconActiveColor } from "../app/theme/styles";
import { Link, useFocusEffect, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
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
import FiBrListCheck from "../assets/icons/svg/fi-br-list-check.svg";
import FiBrSettings from "../assets/icons/svg/fi-br-settings.svg";
import FiBrMemberList from "../assets/icons/svg/fi-br-member-list.svg";
import { useTasks } from "../backend/storage/TasksContext";
import { playInvalidSound } from "../utils/sounds/invalid";
import { playRemoveSound } from "../utils/sounds/trash";
import { useSettings } from "../lib/SettingsContext";

export default function HomeScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { lists, addList, removeList, renameList, exportDataAsJSON } =
    useTasks();
  const { showNavibar } = useSettings();

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

    // Swipe left: go to profile
    if (translationX < -100 && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push("/profile");
    }

    // Swipe right: go to settings
    if (translationX > 100 && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push("/settings");
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

        <View style={styles.taskGroupsWrapper}>
          <View style={styles.taskGroupRow}>
            <Link
              href="/Lists/Groups/scheduled"
              onPress={() => exportDataAsJSON()}
              style={[
                styles.taskGroupButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.primary
                    : colors.light.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.taskGroupButtonText,
                  {
                    color: isDark ? colors.light.primary : colors.dark.primary,
                  },
                ]}
              >
                Scheduled
              </Text>
            </Link>
            <Link
              href="/Lists/Groups/all"
              onPress={() => exportDataAsJSON()}
              style={[
                styles.taskGroupButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.primary
                    : colors.light.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.taskGroupButtonText,
                  {
                    color: isDark ? colors.light.primary : colors.dark.primary,
                  },
                ]}
              >
                All
              </Text>
            </Link>
          </View>
          <View style={styles.taskGroupRow}>
            <Link
              href="/Lists/Groups/flagged"
              onPress={() => exportDataAsJSON()}
              style={[
                styles.taskGroupButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.primary
                    : colors.light.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.taskGroupButtonText,
                  {
                    color: isDark ? colors.light.primary : colors.dark.primary,
                  },
                ]}
              >
                Flagged
              </Text>
            </Link>
            <Link
              href="/Lists/Groups/completed"
              onPress={() => exportDataAsJSON()}
              style={[
                styles.taskGroupButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.primary
                    : colors.light.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.taskGroupButtonText,
                  {
                    color: isDark ? colors.light.primary : colors.dark.primary,
                  },
                ]}
              >
                Completed
              </Text>
            </Link>
          </View>
          <View style={styles.divider} />
        </View>
        {/* User Lists (Blue Scrollable Region) */}
        <View style={{ marginTop: 200 }}>
          <View style={styles.divider} />
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
                        styles.inlineButton,
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
                        styles.inlineButton,
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
                      styles.taskListButton,
                      {
                        backgroundColor: isDark
                          ? colors.dark.secondary
                          : colors.light.primary,
                      },
                    ]}
                    onPress={() => {
                      exportDataAsJSON();
                      router.push(`/Lists/${item.name}` as const);
                    }}
                  >
                    <Text
                      style={[
                        styles.taskListButtonText,
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
            bottom: showNavibar ? 88 : 48, // push up for navibar if shown
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          {/* Divider just above button */}
          <View style={[styles.divider, { width: "90%", marginBottom: 8 }]} />
          {/* Centered Add-Task-List button */}
          <TouchableOpacity
            style={[
              styles.addTaskListButton,
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
                styles.addTaskListButtonText,
                {
                  color: isDark
                    ? colors.dark.bluebutton_text_icon
                    : colors.light.bluebutton_text_icon,
                },
              ]}
            >
              New List
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
                  router.replace(`/Lists/${trimmedName}`);
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
        {/* Bottom Navibar */}
        {showNavibar && (
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 64,
              flexDirection: "row",
              backgroundColor: isDark
                ? colors.dark.secondary
                : colors.light.secondary,
              borderTopWidth: 1,
              borderTopColor: isDark
                ? colors.dark.tertiary
                : colors.light.tertiary,
              justifyContent: "space-around",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            {/* Home Icon */}
            <TouchableOpacity
              onPress={() => router.replace("/home")}
              style={{ alignItems: "center", flex: 1 }}
            >
              <FiBrListCheck
                width={32}
                height={32}
                fill={getNavibarIconActiveColor(isDark)}
              />
              <Text
                style={{
                  color: getNavibarIconActiveColor(isDark),
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                Home
              </Text>
            </TouchableOpacity>
            {/* Settings Icon */}
            <TouchableOpacity
              onPress={() => router.replace("/settings")}
              style={{ alignItems: "center", flex: 1 }}
            >
              <FiBrSettings
                width={32}
                height={32}
                fill={isDark ? colors.dark.icon : colors.light.icon}
              />
              <Text
                style={{
                  color: isDark ? colors.dark.icon : colors.light.icon,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                Settings
              </Text>
            </TouchableOpacity>
            {/* Profile Icon */}
            <TouchableOpacity
              onPress={() => router.replace("/profile")}
              style={{ alignItems: "center", flex: 1 }}
            >
              <FiBrMemberList
                width={32}
                height={32}
                fill={isDark ? colors.dark.icon : colors.light.icon}
              />
              <Text
                style={{
                  color: isDark ? colors.dark.icon : colors.light.icon,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </PanGestureHandler>
  );
}
