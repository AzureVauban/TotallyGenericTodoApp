import { colors } from "@theme/colors";
import { useRouter } from "expo-router";
import { useTheme } from "lib/ThemeContext";
import React, { useRef, useState } from "react";
import { SafeAreaView, Switch, Text, View, Platform } from "react-native";
import {
  GestureHandlerGestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from "react-native-gesture-handler";
import { useTasks } from "../backend/storage/TasksContext";
import { useSettings } from "../lib/SettingsContext";
import CalendarHeatmap from "./components/CalendarHeatmap";
import { Navibar } from "./components/Navibar";
import { styles } from "./theme/styles";

function getSunday(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function getHeatColor(count: number, isDark: boolean) {
  // Use a single blue color from the current theme for all marked days
  return isDark
    ? colors.dark.bluebutton_background
    : colors.light.bluebutton_background;
}

function getMaxCount(days: { [date: string]: number }) {
  let max = 0;
  for (const k in days) {
    if (days[k] > max) max = days[k];
  }
  return max;
}

export default function CalendarScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const hasNavigated = useRef(false);
  const { showNavibar, navibarTransparent } = useSettings();
  const [showDebug, setShowDebug] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("/task-calendar");
  const [viewMode, setViewMode] = useState<"completed" | "scheduled">(
    "completed"
  );
  const { tasks } = useTasks();

  // Hydrate debug toggle from AsyncStorage on mount
  React.useEffect(() => {
    (async () => {
      try {
        const value = await (
          await import("@react-native-async-storage/async-storage")
        ).default.getItem("showDebug");
        setShowDebug(value === "true");
      } catch {}
    })();
  }, []);

  // Prepare heatmap data for completed or scheduled tasks
  const today = new Date();
  const startSunday = getSunday(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 181)
  );
  // Build a 26x7 grid (weeks x days)
  const daysMatrix: { [date: string]: number } = {};
  for (let i = 0; i < 182; i++) {
    const d = new Date(startSunday);
    d.setDate(startSunday.getDate() + i);
    daysMatrix[d.toISOString().slice(0, 10)] = 0;
  }
  // Fill counts
  tasks.forEach((task) => {
    if (viewMode === "completed" && task.completed) {
      // Try to use scheduleDate as the completion date if available
      let date = "";
      if (typeof task.scheduleDate === "string") {
        if (/^\d{4}-\d{2}-\d{2}$/.test(task.scheduleDate)) {
          date = task.scheduleDate;
        } else if (/^\d{2}-\d{2}-\d{4}$/.test(task.scheduleDate)) {
          const [mm, dd, yyyy] = task.scheduleDate.split("-");
          date = `${yyyy}-${mm}-${dd}`;
        }
      }
      if (date && daysMatrix[date] !== undefined) daysMatrix[date]++;
    }
    if (
      viewMode === "scheduled" &&
      task.scheduleDate &&
      !task.recentlyDeleted
    ) {
      // Accept both ISO and MM-DD-YYYY
      let date = "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(task.scheduleDate)) {
        date = task.scheduleDate;
      } else if (/^\d{2}-\d{2}-\d{4}$/.test(task.scheduleDate)) {
        // Convert MM-DD-YYYY to YYYY-MM-DD
        const [mm, dd, yyyy] = task.scheduleDate.split("-");
        date = `${yyyy}-${mm}-${dd}`;
      }
      if (daysMatrix[date] !== undefined) daysMatrix[date]++;
    }
  });

  // Build columns: each column is a day of week (Sunday to Saturday)
  const columns: { date: string; count: number }[][] = Array(7)
    .fill(0)
    .map(() => []);
  let i = 0;
  for (const date in daysMatrix) {
    columns[i % 7].push({ date, count: daysMatrix[date] });
    i++;
  }
  const maxCount = getMaxCount(daysMatrix);

  // Prepare markedDates for react-native-calendars
  const markedDates: Record<string, any> = {};
  Object.entries(daysMatrix).forEach(([date, count]) => {
    if (count > 0) {
      markedDates[date] = {
        selected: true,
        selectedColor: getHeatColor(1, isDark),
        customStyles: {
          container: {
            borderRadius: 12,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
          },
          text: {
            color: isDark ? colors.dark.text : colors.light.text,
            fontWeight: "bold",
          },
        },
      };
    }
  });

  // Gesture navigation (optional)
  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = (
      event.nativeEvent as unknown as PanGestureHandlerEventPayload
    ).translationX;
    // Swipe right: go to home
    if (translationX > 100 && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push("/settings");
    }
    // Swipe left: go to settings
    if (translationX < -100 && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push("/home");
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
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: isDark
            ? colors.dark.background
            : colors.light.background,
        }}
      >
        <View
          style={[
            styles.screenbackground,
            {
              backgroundColor: isDark
                ? colors.dark.background
                : colors.light.background,
              flex: 1,
              alignItems: "center",
              paddingTop: 40,
            },
          ]}
        >
          <Text
            style={{
              color: isDark ? colors.dark.text : colors.light.text,
              fontSize: 22,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            Tasks Calendar
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: isDark ? colors.dark.text : colors.light.text,
                fontSize: 16,
                marginRight: 8,
              }}
            >
              Completed
            </Text>
            <Switch
              value={viewMode === "scheduled"}
              onValueChange={(v) => setViewMode(v ? "scheduled" : "completed")}
              thumbColor={
                isDark
                  ? colors.dark.bluebutton_background
                  : colors.light.bluebutton_background
              }
              trackColor={{
                false: isDark ? colors.dark.secondary : colors.light.secondary,
                true: isDark ? colors.dark.secondary : colors.light.secondary,
              }}
            />
            <Text
              style={{
                color: isDark ? colors.dark.text : colors.light.text,
                fontSize: 16,
                marginLeft: 8,
              }}
            >
              Scheduled
            </Text>
          </View>
          <View style={{ width: "100%", alignItems: "center" }}>
            <CalendarHeatmap
              current={new Date().toISOString().slice(0, 10)}
              minDate={Object.keys(daysMatrix)[0]}
              maxDate={
                Object.keys(daysMatrix)[Object.keys(daysMatrix).length - 1]
              }
              markedDates={markedDates}
              onDayPress={(day) => {
                router.push(`/Lists/Groups/scheduled?date=${day.dateString}`);
              }}
            />
          </View>
        </View>
        {/* Bottom Navibar */}
        {showNavibar && (
          <View style={{ marginBottom: Platform.OS === "android" ? 25 : 0 }}>
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
