import { colors } from "@theme/colors";
import { useRouter } from "expo-router";
import { useTheme } from "lib/ThemeContext";
import React, { useRef, useState } from "react";
import {
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  GestureHandlerGestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from "react-native-gesture-handler";
import FiBrCalendar from "../assets/icons/svg/fi-br-calendar.svg";
import FiBrListCheck from "../assets/icons/svg/fi-br-list-check.svg";
import FiBrMemberList from "../assets/icons/svg/fi-br-member-list.svg";
import FiBrSettings from "../assets/icons/svg/fi-br-settings.svg";
import FiBrSquareTerminal from "../assets/icons/svg/fi-br-square-terminal.svg";
import { useTasks } from "../backend/storage/TasksContext";
import { useSettings } from "../lib/SettingsContext";
import CalendarHeatmap from "./components/CalendarHeatmap";
import { getNavibarIconActiveColor, styles } from "./theme/styles";

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
        {/* Bottom Navibar */}
        {showNavibar && (
          <View
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              bottom: 16,
              paddingVertical: 10,
              flexDirection: "row",
              backgroundColor: navibarTransparent
                ? isDark
                  ? colors.dark.background
                  : colors.light.background
                : (isDark ? colors.dark.secondary : colors.light.secondary) +
                  "80",
              borderTopWidth: 0,
              justifyContent: "space-around",
              alignItems: "center",
              zIndex: 100,
              borderRadius: 16,
              shadowColor: "rgb(0, 0, 0)",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 8,
              elevation: 8,
              overflow: "hidden",
            }}
          >
            {/* Home Icon */}
            <TouchableOpacity
              onPress={() => {
                setCurrentRoute("/home");
                router.replace("/home");
              }}
              style={{ alignItems: "center", flex: 1 }}
            >
              <FiBrListCheck
                width={32}
                height={32}
                fill={
                  currentRoute === "/home"
                    ? getNavibarIconActiveColor(isDark)
                    : isDark
                    ? colors.dark.icon
                    : colors.light.icon
                }
              />
              <Text
                style={{
                  color:
                    currentRoute === "/home"
                      ? getNavibarIconActiveColor(isDark)
                      : isDark
                      ? colors.dark.icon
                      : colors.light.icon,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Home
              </Text>
            </TouchableOpacity>
            {/* Calendar Icon */}
            <TouchableOpacity
              onPress={() => {
                setCurrentRoute("/task-calendar");
                router.replace("/task-calendar");
              }}
              style={{ alignItems: "center", flex: 1 }}
            >
              <FiBrCalendar
                width={32}
                height={32}
                fill={
                  currentRoute === "/task-calendar"
                    ? getNavibarIconActiveColor(isDark)
                    : isDark
                    ? colors.dark.icon
                    : colors.light.icon
                }
              />
              <Text
                style={{
                  color:
                    currentRoute === "/task-calendar"
                      ? getNavibarIconActiveColor(isDark)
                      : isDark
                      ? colors.dark.icon
                      : colors.light.icon,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Calendar
              </Text>
            </TouchableOpacity>
            {/* Settings Icon */}
            <TouchableOpacity
              onPress={() => {
                setCurrentRoute("/settings");
                router.replace("/settings");
              }}
              style={{ alignItems: "center", flex: 1 }}
            >
              <FiBrSettings
                width={32}
                height={32}
                fill={
                  currentRoute === "/settings"
                    ? getNavibarIconActiveColor(isDark)
                    : isDark
                    ? colors.dark.icon
                    : colors.light.icon
                }
              />
              <Text
                style={{
                  color:
                    currentRoute === "/settings"
                      ? getNavibarIconActiveColor(isDark)
                      : isDark
                      ? colors.dark.icon
                      : colors.light.icon,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Settings
              </Text>
            </TouchableOpacity>
            {/* Profile Icon */}
            <TouchableOpacity
              onPress={() => {
                setCurrentRoute("/profile");
                router.replace("/profile");
              }}
              style={{ alignItems: "center", flex: 1 }}
            >
              <FiBrMemberList
                width={32}
                height={32}
                fill={
                  currentRoute === "/profile"
                    ? getNavibarIconActiveColor(isDark)
                    : isDark
                    ? colors.dark.icon
                    : colors.light.icon
                }
              />
              <Text
                style={{
                  color:
                    currentRoute === "/profile"
                      ? getNavibarIconActiveColor(isDark)
                      : isDark
                      ? colors.dark.icon
                      : colors.light.icon,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Profile
              </Text>
            </TouchableOpacity>
            {/* Debug Icon (conditionally rendered) */}
            {showDebug && (
              <TouchableOpacity
                onPress={() => {
                  setCurrentRoute("/runtime-debug");
                  router.replace("/runtime-debug");
                }}
                style={{ alignItems: "center", flex: 1 }}
              >
                <FiBrSquareTerminal
                  width={32}
                  height={32}
                  fill={
                    currentRoute === "/runtime-debug"
                      ? getNavibarIconActiveColor(isDark)
                      : isDark
                      ? colors.dark.icon
                      : colors.light.icon
                  }
                />
                <Text
                  style={{
                    color:
                      currentRoute === "/runtime-debug"
                        ? getNavibarIconActiveColor(isDark)
                        : isDark
                        ? colors.dark.icon
                        : colors.light.icon,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Debug
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </PanGestureHandler>
  );
}
