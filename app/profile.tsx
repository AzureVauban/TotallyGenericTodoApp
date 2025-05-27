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
import AsyncStorage from "@react-native-async-storage/async-storage";
import FiBrSquareTerminal from "../assets/icons/svg/fi-br-square-terminal.svg";
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
  const [showDebug, setShowDebug] = React.useState(false);
  const [currentRoute, setCurrentRoute] = React.useState<string>("/profile");
  const [isSignedIn, setIsSignedIn] = React.useState<boolean>(true);

  // Check if user is signed in on mount
  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setIsSignedIn(!!data?.user);
      } catch {
        setIsSignedIn(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem("showDebug");
        setShowDebug(value === "true");
      } catch {}
    })();
  }, []);

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
    // Swipe right: go to debug if enabled, else home
    if (translationX > 100 && !hasNavigated.current) {
      hasNavigated.current = true;
      if (showDebug) {
        router.push("/runtime-debug");
      } else {
        router.push("/home");
      }
    }
    if (event.nativeEvent.state === State.END) {
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
          <View style={{ marginTop: 10, flex: 1, justifyContent: "center" }}>
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
              {isSignedIn ? (
                <>
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
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[
                      styles.logoutButton,
                      {
                        backgroundColor: isDark
                          ? colors.dark.bluebutton_background
                          : colors.light.bluebutton_background,
                      },
                    ]}
                    onPress={() => router.push("/authentication/login")}
                  >
                    <FiBrMemberList
                      width={20}
                      height={20}
                      fill={
                        isDark
                          ? colors.dark.bluebutton_text_icon
                          : colors.light.bluebutton_text_icon
                      }
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        styles.logoutButtonText,
                        {
                          color: isDark
                            ? colors.dark.bluebutton_text_icon
                            : colors.light.bluebutton_text_icon,
                        },
                      ]}
                    >
                      Account Login
                    </Text>
                  </TouchableOpacity>
                  {/* Always show logout button below Account Login */}
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
                </>
              )}
            </View>
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
                backgroundColor:
                  (isDark ? colors.dark.secondary : colors.light.secondary) +
                  "80", // 50% opacity
                borderTopWidth: 0,
                justifyContent: "space-around",
                alignItems: "center",
                zIndex: 100,
                borderRadius: 16, // rectangle with rounded corners
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.18,
                shadowRadius: 8,
                elevation: 8,
                overflow: "hidden",
                // Glassy effect
                borderColor: isDark
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(0,0,0,0.10)",
                borderWidth: 1,
                backdropFilter: "blur(8px)", // for web, ignored on native
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
      </View>
    </PanGestureHandler>
  );
}
