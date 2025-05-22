import React, { useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import {
  PanGestureHandler,
  State,
  GestureHandlerGestureEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import FiBrListCheck from "../assets/icons/svg/fi-br-list-check.svg";
import FiBrSettings from "../assets/icons/svg/fi-br-settings.svg";
import FiBrMemberList from "../assets/icons/svg/fi-br-member-list.svg";
import { colors } from "@theme/colors";
import { useTheme } from "lib/ThemeContext";
import { styles, getNavibarIconActiveColor } from "@theme/styles";
import { supabase } from "../lib/supabaseClient";
import { useSettings } from "../lib/SettingsContext";

export default function UserProfileScreen() {
  const router = useRouter();
  const hasNavigated = useRef(false);
  const { showNavibar } = useSettings();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useFocusEffect(
    React.useCallback(() => {
      hasNavigated.current = false;
    }, [theme])
  );

  const onGestureEvent = (event: GestureHandlerGestureEvent) => {
    const translationX = (
      event.nativeEvent as unknown as PanGestureHandlerEventPayload
    ).translationX;

    // Swipe left: go to settings
    if (translationX < -100 && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push("/settings");
    }
    // Swipe right: go to home
    if (translationX > 100 && !hasNavigated.current) {
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
      <View style={{ flex: 1 }}>
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
          <View style={{ marginTop: 30, flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                color: isDark ? colors.dark.text : colors.light.text,
                fontSize: 22,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Profile
            </Text>
            {/* Add the logout button here */}
            <View
              style={{
                marginTop: 24,
                marginBottom: showNavibar ? 80 : 24,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={[
                  styles.logoutButton,
                  {
                    backgroundColor: isDark
                      ? colors.dark.redbutton_background
                      : colors.light.redbutton_background,
                  },
                ]}
                onPress={async () => {
                  console.log("USER LOGGED OUT");
                  await supabase.auth.signOut();
                  router.push("/welcome");
                }}
              >
                <FiBrMemberList
                  width={20}
                  height={20}
                  fill={
                    isDark
                      ? colors.dark.redbutton_text_icon
                      : colors.light.redbutton_text_icon
                  }
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    styles.logoutButtonText,
                    {
                      color: isDark
                        ? colors.dark.redbutton_text_icon
                        : colors.light.redbutton_text_icon,
                    },
                  ]}
                >
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
                  fill={isDark ? colors.dark.icon : colors.light.icon}
                />
                <Text
                  style={{
                    color: isDark ? colors.dark.icon : colors.light.icon,
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
                  fill={getNavibarIconActiveColor(isDark)}
                />
                <Text
                  style={{
                    color: getNavibarIconActiveColor(isDark),
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
      </View>
    </PanGestureHandler>
  );
}
