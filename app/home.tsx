import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StyleSheet } from "react-native";
import FiBrburger from "../assets/icons/svg/fi-br-list.svg";
import FiBrplus from "../assets/icons/svg/fi-br-plus.svg";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  PanGestureHandler,
  State,
  GestureHandlerGestureEvent,
  PanGestureHandlerEventPayload,
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
    color: COLORS.dark_tertiary,
  },
  taskDue: {
    color: COLORS.dark_accents,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.dark_accents,
    opacity: 0.8,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
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

const initialTasks = [
  { id: "1", text: "Buy Nani gifts", due: "5/1/25", done: false },
  { id: "2", text: "Buy doggy food for Marty", due: "12/12/25", done: false },
  { id: "3", text: "Call Ariana goofy", due: "5/1/25", done: false },
  {
    id: "4",
    text: "Remind myself to not do big back activities",
    due: "5/20/25",
    done: false,
  },
  { id: "5", text: "Deez nuts", due: "5/20/25", done: false },
];
const completedTasks = [
  { id: "6", text: "Buy Nani gifts", due: "5/1/25", done: true },
  { id: "7", text: "Buy doggy food for Marty", due: "12/12/25", done: true },
  { id: "8", text: "Call Ariana goofy", due: "5/1/25", done: true },
];

function TaskItem({
  text,
  due,
  done,
}: {
  text: string;
  due: string;
  done: boolean;
}) {
  return (
    <View style={styles.taskRow}>
      <View style={[styles.square, done && styles.squareDone]} />
      <Text style={[styles.taskText, done && styles.taskTextDone]}>{text}</Text>
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
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      hasNavigated.current = false;
    }, [])
  );

  // Manage tasks state
  const [tasks, setTasks] = useState(initialTasks);

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

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <View style={styles.screenbackground}>
        {/* Screen title */}
        <Text
          style={styles.subtitle}

          //paddingHorizontal={15}
        >
          Ongoing Chores
        </Text>
        <FlatList
          data={tasks.slice(0, 3)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedTask(item);
                setModalVisible(true);
              }}
            >
              <TaskItem text={item.text} due={item.due} done={item.done} />
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{
            paddingVertical: 5,
            paddingHorizontal: 16,
          }}
        />
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
        <Text
          style={styles.subtitle}

          //paddingHorizontal={15}
        >
          Completed Chores
        </Text>
        <FlatList
          data={tasks.slice(0, 3)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedTask(item);
                setModalVisible(true);
              }}
            >
              <TaskItem text={item.text} due={item.due} done={item.done} />
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{
            paddingVertical: 5,
            paddingHorizontal: 16,
          }}
        />
        <TouchableOpacity // buttton for adding task
          style={styles.addTaskButton}
          onPress={() => {
            // Add a new task
            console.log("Add Task");
            // Show the task creation modal
            setShowTaskActions(true);
            setTasks((prev) =>
              prev.concat({
                id: Date.now().toString(),
                text: "New Task",
                due: Date.now().toString(),
                done: false,
              })
            );
          }}
        >
          <FiBrplus width={25} height={25} fill={COLORS.dark_accents} />
        </TouchableOpacity>
        <TouchableOpacity // buttton for adding task
          style={styles.showListsButtons}
          onPress={() => {
            showModal ? setShowModal(false) : setShowModal(true);
          }}
        >
          <FiBrburger width={25} height={25} fill={COLORS.dark_accents} />
        </TouchableOpacity>
      </View>
    </PanGestureHandler>
  );
}
