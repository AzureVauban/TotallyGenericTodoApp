import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "@theme/colors";
import { styles } from "@theme/styles";
import { useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "lib/ThemeContext";
import React, { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  GestureHandlerGestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from "react-native-gesture-handler";
import FiBrMemberList from "../assets/icons/svg/fi-br-member-list.svg";
import { useSettings } from "../lib/SettingsContext";
import { supabase } from "../lib/supabaseClient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navibar } from "./components/Navibar";

export default function UserProfileScreen() {
  console.log("UserProfileScreen rendered");
  const router = useRouter();
  const hasNavigated = useRef(false);
  const { showNavibar, navibarTransparent } = useSettings();
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
            <Navibar
              currentRoute={currentRoute}
              setCurrentRoute={setCurrentRoute}
              router={router}
              isDark={isDark}
              showDebug={showDebug}
              showNavibar={showNavibar}
              navibarTransparent={navibarTransparent}
            />
          )}
        </View>
      </SafeAreaView>
    </PanGestureHandler>
  );
}
