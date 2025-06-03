import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "@theme/colors";

import FiBrCalendar from "../../assets/icons/svg/fi-br-calendar.svg";
import FiBrListCheck from "../../assets/icons/svg/fi-br-list-check.svg";
import FiBrMemberList from "../../assets/icons/svg/fi-br-member-list.svg";
import FiBrSettings from "../../assets/icons/svg/fi-br-settings.svg";
import FiBrSquareTerminal from "../../assets/icons/svg/fi-br-square-terminal.svg";
import { getNavibarIconActiveColor } from "../theme/styles";

export function Navibar({
  currentRoute,
  setCurrentRoute,
  router,
  isDark,
  showDebug,
  showNavibar,
  navibarTransparent,
}: {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  router: any;
  isDark: boolean;
  showDebug: boolean;
  showNavibar: boolean;
  navibarTransparent: boolean;
}) {
  if (!showNavibar) return null;
  return (
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
          : (isDark ? colors.dark.secondary : colors.light.secondary) + "80",
        borderTopWidth: 0,
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 100,
        borderRadius: 16,
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
  );
}
