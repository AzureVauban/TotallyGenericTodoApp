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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "@theme/colors";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "lib/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {
  FlatList,
  GestureHandlerGestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
  Swipeable,
} from "react-native-gesture-handler";
import { styles } from "../app/theme/styles";
import FiBrSettings from "../assets/icons/svg/fi-br-settings.svg";
import FiBredit from "../assets/icons/svg/fi-br-text-box-edit.svg";
import FiBrtrash from "../assets/icons/svg/fi-br-trash.svg";
import { useTasks } from "../backend/storage/TasksContext";
import { useSettings } from "../lib/SettingsContext";
import { playInvalidSound } from "../utils/sounds/invalid";
import { playRemoveSound } from "../utils/sounds/trash";
import ModalWrapper from "./components/ModalWrapper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navibar } from "./components/Navibar";

export default function HomeScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { lists, addList, removeList, renameList, exportDataAsJSON, tasks } =
    useTasks();
  const { showNavibar, navibarTransparent } = useSettings();
  const [showDebug, setShowDebug] = useState(false);

  // Hydrate debug toggle from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem("showDebug");
        setShowDebug(value === "true");
      } catch {}
    })();
  }, []);

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

  // Edit List Details modal state
  const [editListModalVisible, setEditListModalVisible] = useState(false);
  const [editListTarget, setEditListTarget] = useState<{
    id: string;
    name: string;
    color?: string;
  } | null>(null);
  const [editListName, setEditListName] = useState("");
  const [editListColor, setEditListColor] = useState<string | undefined>(
    undefined
  );
  const [editListError, setEditListError] = useState(false);

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

    // Swipe left: go to debug if enabled, else profile
    if (translationX < -100 && !hasNavigated.current) {
      hasNavigated.current = true;
      if (showDebug) {
        router.push("/runtime-debug");
      } else {
        router.push("/profile");
      }
    }

    // Swipe right: go to settings
    if (translationX > 100 && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push("/task-calendar");
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

  // Add this to get the current route path for navibar highlighting
  const [currentRoute, setCurrentRoute] = useState<string>("/home");
  useEffect(() => {
    // Expo Router: get the current route from the router object
    // router.asPath is not available, so use window.location.pathname if in web, or fallback
    // For Expo Router, you can use router.route or router.getState() if available
    // We'll use a fallback for now:
    setCurrentRoute("/home");
  }, []);

  // Task group counts
  const scheduledCount = tasks.filter(
    (t) => t.scheduleDate && !t.recentlyDeleted
  ).length;
  const allCount = tasks.filter((t) => !t.recentlyDeleted).length;
  const flaggedCount = tasks.filter(
    (t) => !!t.flagged && !t.recentlyDeleted
  ).length;
  const completedCount = tasks.filter(
    (t) => t.completed && !t.recentlyDeleted
  ).length;

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: isDark
            ? colors.dark.background
            : colors.light.background,
        }}
      >
        {/* Task Groups (Green Buttons) */}
        <View
          style={{
            marginTop: 24,
            marginBottom: 16,
            paddingHorizontal: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
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
                Scheduled ({scheduledCount})
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
                All ({allCount})
              </Text>
            </Link>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
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
                Flagged ({flaggedCount})
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
                Completed ({completedCount})
              </Text>
            </Link>
          </View>
        </View>
        <View style={{ marginTop: 170, marginBottom: 0, flex: 1 }}>
          <View style={styles.divider} />
          <FlatList
            data={lists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Swipeable
                renderRightActions={() => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "stretch",
                      marginBottom: 10,
                    }}
                  >
                    {/* Purple inline button for list details (moved to right swipe) */}
                    <Pressable
                      style={[
                        styles.inlineButton,
                        {
                          backgroundColor: isDark
                            ? colors.dark.purplebutton_background
                            : colors.light.purplebutton_background,
                          height: 45,
                          borderRadius: 8,
                        },
                      ]}
                      onPress={() => {
                        setEditListTarget(item);
                        setEditListName(item.name);
                        setEditListColor(item.color || "");
                        setEditListError(false);
                        setEditListModalVisible(true);
                      }}
                    >
                      <FiBrSettings
                        width={20}
                        height={20}
                        fill={
                          isDark
                            ? colors.dark.purplebutton_text_icon
                            : colors.light.purplebutton_text_icon
                        }
                      />
                    </Pressable>
                    {/* Existing red delete button */}
                    <Pressable
                      style={[
                        styles.inlineButton,
                        {
                          backgroundColor: isDark
                            ? colors.dark.redbutton_background
                            : colors.light.redbutton_background,
                          height: 45,
                          borderRadius: 8,
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
                  </View>
                )}
                renderLeftActions={() => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "stretch",
                      marginBottom: 10,
                    }}
                  >
                    {/* Existing blue edit button */}
                    <Pressable
                      style={[
                        styles.inlineButton,
                        {
                          backgroundColor: isDark
                            ? colors.dark.bluebutton_background
                            : colors.light.bluebutton_background,
                          height: 45,
                          borderRadius: 8,
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
                  </View>
                )}
              >
                <Pressable
                  style={[
                    styles.taskListButton,
                    {
                      backgroundColor:
                        item.color ||
                        (isDark ? colors.dark.secondary : colors.light.primary),
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
            contentContainerStyle={{ paddingBottom: showNavibar ? 24 : 24 }}
            style={{ maxHeight: 220 }}
            showsVerticalScrollIndicator={false}
          />
          {/* Restore Add List Button below the user lists */}
          <TouchableOpacity
            style={[
              styles.addTaskListButton,
              {
                width: 300,
                alignSelf: "center",
                marginTop: 24,
                backgroundColor: isDark
                  ? colors.dark.bluebutton_background
                  : colors.light.bluebutton_background,
              },
            ]}
            onPress={() => setAddModalVisible(true)}
          >
            <Text
              style={[
                styles.modalButtonText,
                { color: colors.light.bluebutton_text_icon },
              ]}
            >
              New List
            </Text>
          </TouchableOpacity>
        </View>
        {/* --- The rest of the original task/chores UI could be rendered below this, if needed --- */}
        {/* Add List Modal */}
        <ModalWrapper
          visible={addModalVisible}
          onRequestClose={() => {
            setAddModalVisible(false);
            setNewListName("");
            setDuplicateError(false);
          }}
        >
          <Text style={styles.modalTitle}>New List</Text>
          <TextInput
            value={newListName}
            onChangeText={setNewListName}
            placeholder="List name"
            placeholderTextColor={colors.dark.text}
            style={{
              borderWidth: 1,
              borderColor: duplicateError ? "#450a0a" : colors.dark.tertiary,
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
                (list) => list.name.toLowerCase() === trimmedName.toLowerCase()
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
        </ModalWrapper>
        {/* Rename List Modal */}
        <ModalWrapper
          visible={renameModalVisible}
          onRequestClose={() => setRenameModalVisible(false)}
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
            <Text style={styles.modalButtonText}>Ok</Text>
          </Pressable>
          <Pressable
            style={[
              styles.modalButton,
              { backgroundColor: colors.dark.primary },
            ]}
            onPress={() => setRenameModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </Pressable>
        </ModalWrapper>
        {/* Edit List Details Modal */}
        <ModalWrapper
          visible={editListModalVisible}
          onRequestClose={() => setEditListModalVisible(false)}
        >
          <Text style={styles.modalTitle}>List Details</Text>
          <TextInput
            value={editListName}
            onChangeText={setEditListName}
            placeholder="List name"
            placeholderTextColor={colors.dark.text}
            style={{
              borderWidth: 1,
              borderColor: editListError ? "#450a0a" : colors.dark.tertiary,
              color: colors.dark.text,
              padding: 8,
              borderRadius: 8,
              marginBottom: 10,
            }}
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
                onPress={() => setEditListColor(color)}
                style={[
                  styles.colorSwatch,
                  {
                    backgroundColor: color,
                    borderWidth: editListColor === color ? 2 : 0,
                    borderColor: "#fff",
                  },
                ]}
              />
            ))}
          </View>
          <TextInput
            value={editListColor}
            onChangeText={setEditListColor}
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
            onPress={() => setEditListColor("")}
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
              if (!editListTarget) return;
              const trimmedName = editListName.trim();
              // Prevent duplicates (excluding the list being edited), case-insensitive
              const normalized = trimmedName.toLowerCase();
              const duplicate = lists
                .filter((l) => l.id !== editListTarget.id)
                .some((l) => l.name.trim().toLowerCase() === normalized);
              if (duplicate || !trimmedName) {
                playInvalidSound();
                setEditListError(true);
                return;
              }
              // Save name and color
              renameList(editListTarget.id, trimmedName, editListColor); // <-- Pass color as third argument
              setEditListModalVisible(false);
            }}
          >
            <Text style={styles.modalButtonText}>Save</Text>
          </Pressable>
          {/* Cancel Button */}
          <Pressable
            style={[
              styles.modalButton,
              { backgroundColor: colors.dark.primary },
            ]}
            onPress={() => setEditListModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </Pressable>
        </ModalWrapper>
        {/* Bottom Navibar */}
        {showNavibar && (
          <View style={{ marginBottom: 0 }}>
            <Navibar
              currentRoute={currentRoute}
              setCurrentRoute={setCurrentRoute}
              router={router}
              isDark={isDark}
              showDebug={showDebug}
              showNavibar={showNavibar}
              navibarTransparent={navibarTransparent}
            />
          </View>
        )}
      </SafeAreaView>
    </PanGestureHandler>
  );
}
