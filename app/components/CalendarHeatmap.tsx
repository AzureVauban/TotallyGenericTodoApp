import React from "react";
import { Calendar } from "react-native-calendars";
import { colors } from "@theme/colors";
import { useTheme } from "lib/ThemeContext";
import { styles } from "../theme/styles";

/**
 * Shared CalendarHeatmap component for displaying a calendar with marked dates.
 * Props:
 * - markedDates: object of marked dates for the calendar
 * - onDayPress: function to handle day press events
 * - current: current date string (YYYY-MM-DD)
 * - minDate, maxDate: optional date range
 * - style: additional style overrides
 * - ...rest: any other Calendar props
 */
const CalendarHeatmap = ({
  markedDates,
  onDayPress,
  current,
  minDate,
  maxDate,
  style,
  ...rest
}: {
  markedDates: Record<string, any>;
  onDayPress?: (day: any) => void;
  current?: string;
  minDate?: string;
  maxDate?: string;
  style?: any;
  [key: string]: any;
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Calendar
      current={current}
      minDate={minDate}
      maxDate={maxDate}
      markingType="custom"
      markedDates={markedDates}
      onDayPress={onDayPress}
      theme={{
        backgroundColor: isDark
          ? colors.dark.calendarBackground
          : colors.light.calendarBackground,
        calendarBackground: isDark
          ? colors.dark.calendarBackground
          : colors.light.calendarBackground,
        textSectionTitleColor: isDark ? colors.dark.text : colors.light.text,
        selectedDayBackgroundColor: "transparent",
        selectedDayTextColor: isDark ? colors.dark.text : colors.light.text,
        todayTextColor: "rgb(250, 204, 21)",
        dayTextColor: isDark ? colors.dark.text : colors.light.text,
        textDisabledColor: "rgb(209, 213, 219)",
        arrowColor: isDark ? colors.dark.text : colors.light.text,
        monthTextColor: isDark ? colors.dark.text : colors.light.text,
      }}
      style={[
        styles.calendarBackground,
        {
          backgroundColor: isDark
            ? colors.dark.calendarBackground
            : colors.light.calendarBackground,
        },
        style,
      ]}
      hideExtraDays={false}
      enableSwipeMonths={true}
      {...rest}
    />
  );
};

export default CalendarHeatmap;
