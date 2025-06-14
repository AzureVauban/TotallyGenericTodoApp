import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { colors, NaniColors } from "@theme/colors";
import { playInvalidSound } from "utils/sounds/invalid";
import { useTheme } from "lib/ThemeContext";
import { getAuthErrorMessage } from "../../lib/auth-exceptions";
import { supabase } from "../../lib/supabaseClient";

export default function LoginScreen() {
  //! make sure the Anonymous Pro font is loaded
  const [fontsLoaded] = useFonts({
    "AnonymousPro-Regular": require("../../assets/fonts/Anonymous_Pro/AnonymousPro-Regular.ttf"),
    "AnonymousPro-Bold": require("../../assets/fonts/Anonymous_Pro/AnonymousPro-Bold.ttf"),
  });

  var isDark = useTheme().isDark;
  const [identifier, setIdentifier] = useState(""); // replaces username
  //!  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  //! const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [magicEmail, setMagicEmail] = useState("");
  const router = useRouter();
  const { theme } = useTheme();

  // Animated values for background colors
  const usernameBgAnim = useRef(new Animated.Value(0)).current;
  const passwordBgAnim = useRef(new Animated.Value(0)).current;

  // Helper to animate error background
  const triggerErrorAnimation = (animRef) => {
    Animated.sequence([
      Animated.timing(animRef, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(animRef, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();
  };

  useEffect(() => {
    if (usernameError) {
      playInvalidSound();
      triggerErrorAnimation(usernameBgAnim);
    }
  }, [usernameError]);

  //!  useEffect(() => {
  //!    if (passwordError) {
  //!      playInvalidSound();
  //!      triggerErrorAnimation(passwordBgAnim);
  //!    }
  //!  }, [passwordError]);

  // Interpolate background color
  const getBgColor = (animRef, error) =>
    animRef.interpolate({
      inputRange: [0, 1],
      outputRange: [
        colors[theme].background,
        styles.inputBackgroundError.backgroundColor,
      ],
    });

  const handleMagicLink = async (email: string) => {
    console.log("[Login] handleMagicLink called with email:", email);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: "sussysushi://home", // or your deep link
        },
      });
      if (error) throw error;
      alert("Magic link sent! Check your email.");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    }
  };

  // Detect if app was opened via magic link
  useEffect(() => {
    const checkInitialUrl = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        console.log("[Magic Link] App opened via URL:", url);
        // Try to get the current user session
        const { data, error } = await supabase.auth.getUser();
        if (data?.user) {
          console.log(
            `[Magic Link] Authenticated user via magic link: userID=${data.user.id}, email=${data.user.email}`
          );
        } else {
          console.log(
            "[Magic Link] No authenticated user found after magic link.",
            error
          );
        }
      } else {
        console.log(
          "[Expo Debug] App opened via regular Expo session (no magic link URL)."
        );
      }
    };
    checkInitialUrl();
  }, []);

  // After successful login or magic link:
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("[Login] Session after login:", session);
    };
    fetchSession();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark
          ? NaniColors.new_secondary
          : NaniColors.new_primary,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: isDark
                ? NaniColors.new_secondary
                : NaniColors.new_primary,
            },
          ]}
        >
          {/* CONTAINER FOR SIGN-UP */}
          <View
            style={[
              styles.blueTabShadowWrapper,
              {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                bottom: 20,
                top: 75,
              },
            ]}
          >
            <View
              style={[
                styles.blueTab,
                {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                },
              ]}
            >
              {/* Diagonal stripes container */}
              <View style={styles.diagonalStripesContainer}>
                {/* Create multiple diagonal stripe elements */}
                {Array.from({ length: 45 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.diagonalStripe,
                      {
                        left: index * 18 - 200, // Better spacing and coverage
                      },
                    ]}
                  />
                ))}
              </View>

              {/* SIGN-IN Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: NaniColors.new_accent2 },
                ]}
                onPress={() => {
                  console.log("[LOGIN-SCREEN]: SIGN-UP Button Pressed");
                  // changeTheme();
                  router.push("/authentication/register");
                }}
              >
                <Text
                  style={[
                    styles.sign_up_button_text,
                    {
                      color: isDark
                        ? NaniColors.new_primary
                        : NaniColors.new_secondary,
                    },
                  ]}
                >
                  SIGN UP
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CONTAINER FOR SIGN-IN */}
          <View
            style={[
              styles.orangetab,
              { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, top: -77 },
            ]}
          >
            {/* Title */}
            <Text
              style={[
                styles.title,
                {
                  color: isDark
                    ? NaniColors.new_primary
                    : NaniColors.new_secondary,
                },
              ]}
            >
              TO DO:{"\n"}WRITE{"\n"}EMAIL
            </Text>

            {/* Input field for text input */}
            <TextInput
              style={styles.input}
              placeholder="add your email..."
              value={magicEmail}
              onChangeText={setMagicEmail}
            />

            {/* Horizontal stripes */}
            <View style={[styles.horizontalstripe, { marginTop: 11 }]}></View>
            <View style={[styles.horizontalstripe]}></View>
            <View style={[styles.horizontalstripe]}></View>
            <View style={[styles.horizontalstripe]}></View>
            <View style={[styles.horizontalstripe]}></View>
            <View style={[styles.horizontalstripe]}></View>
            <View style={[styles.horizontalstripe]}></View>
            <View style={[styles.horizontalstripe]}></View>
            <View style={[styles.horizontalstripe]}></View>
            <View style={[styles.horizontalstripe]}></View>
            <View style={[styles.horizontalstripe]}></View>
            <View style={[styles.horizontalstripe]}></View>

            {/* SIGN-IN Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                console.log("[LOGIN-SCREEN]: SIGN-IN Button Pressed");
                if (!magicEmail) {
                  console.warn("[LOGIN-SCREEN]: SEND MAGIC LINK Pressed");
                  setErrorMessage("Please enter your email address.");
                  playInvalidSound();
                  return;
                }
                handleMagicLink(magicEmail);
              }}
            >
              <Text
                style={[
                  styles.sign_in_button_text,
                  {
                    color: isDark
                      ? NaniColors.new_primary
                      : NaniColors.new_secondary,
                  },
                ]}
              >
                SIGN IN
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.sendlinkbutton,
              {
                backgroundColor: isDark
                  ? NaniColors.new_primary
                  : NaniColors.new_secondary,
                position: "absolute",
                bottom: "-2.5%",
              },
            ]}
          >
            <Text
              style={[
                styles.sendlinkbutton_text,
                {
                  color: isDark ? NaniColors.new_accent : NaniColors.new_accent,
                },
              ]}
              onPress={() => {
                console.log("[LOGIN-SCREEN]: SEND MAGIC LINK Pressed");
                if (!magicEmail) {
                  console.warn("[LOGIN-SCREEN]: SEND MAGIC LINK Pressed");
                  setErrorMessage("Please enter your email address.");
                  playInvalidSound();
                  return;
                }
                handleMagicLink(magicEmail);
              }}
            >
              SEND MAGIC LINK
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  // width: 393, height: 852 (IPHONE 14 & 15 Pro) based on figma
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: NaniColors.new_accent2,
    alignItems: "center",
    position: "relative", // Allows absolute positioning of child elements
  },
  title: {
    fontSize: 67,
    fontFamily: "AnonymousPro-Bold",
    fontWeight: "500",
    textAlign: "left",
  },
  input: {
    backgroundColor: NaniColors.new_accentcompliment,
    width: "90%",
    height: "8%",
    fontFamily: "AnonymousPro-Bold",
    textAlign: "center",
    fontSize: 20,
    marginTop: 15,
  },
  horizontalstripe: {
    width: "90%",
    height: "1%",
    backgroundColor: NaniColors.new_accentcompliment,
    marginVertical: 5,
  },
  button: {
    backgroundColor: NaniColors.new_accent,
    padding: 10,
    borderRadius: 5,
  },
  sign_in_button_text: {
    color: NaniColors.new_secondary,
    fontSize: 30,
    fontFamily: "AnonymousPro-Bold",
    textAlign: "center",
  },
  orangetab: {
    backgroundColor: NaniColors.new_accent,
    width: "75%",
    height: "85.00%",
    borderRadius: 17,
    left: -67,
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 30,
    paddingLeft: 24,

    // iOS Shadow Properties
    shadowColor: NaniColors.new_accentcompliment,
    shadowOffset: {
      width: -18, // Horizontal offset (positive = right, negative = left)
      height: 13.5, // Vertical offset (positive = down, negative = up)
    },
    shadowOpacity: 1, // Fully opaque shadow
    shadowRadius: 0, // Sharp shadow (no blur)

    // Android Shadow Properties
    elevation: 8,
  },
  blueTabShadowWrapper: {
    width: "75%",
    height: "85%",
    position: "absolute",
    right: -25, // same as blueTab's original right
    alignItems: "flex-end",
    justifyContent: "flex-end",
    borderRadius: 17, // full rounding for wrapper
    overflow: "visible", // allow shadows to show
    // iOS Shadow
    shadowColor: NaniColors.new_accent2compliment,
    shadowOffset: { width: 18, height: 13.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    // Android Shadow
    elevation: 8,
  },
  blueTab: {
    width: "100%",
    height: "100%",
    backgroundColor: NaniColors.new_accent2,
    borderRadius: 17,
    overflow: "hidden", // clip stripes inside
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingTop: 30,
    paddingRight: 30,
    paddingBottom: 20,
  },
  sign_up_button_text: {
    color: NaniColors.new_secondary,
    fontSize: 30,
    fontFamily: "AnonymousPro-Bold",
    textAlign: "center",
    opacity: 1,
  },
  diagonalStripesContainer: {
    position: "absolute",
    top: "-20%",
    left: "-20%",
    width: "140%",
    height: "140%",
    overflow: "visible",
  },
  diagonalStripe: {
    position: "absolute",
    width: 8,
    height: "400%",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    transform: [{ rotate: "35deg" }],
    top: "-150%",
  },
  signUpButton: {
    backgroundColor: NaniColors.new_accent, // Solid color, no transparency
    padding: 10,
    borderRadius: 5,
    // Ensure no opacity is set
    opacity: 1,
  },
  forgot: {
    marginTop: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  inputBackgroundError: {
    backgroundColor: "#7f1d1d",
  },
  sendlinkbutton: {
    backgroundColor: NaniColors.new_accent2,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    right: "-10%",
    width: "100%",
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    fontFamily: "AnonymousPro-Bold",
    height: "7.5%",
  },
  sendlinkbutton_text: {
    color: NaniColors.new_accent,
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    alignItems: "center",
    fontFamily: "AnonymousPro-Bold",
    fontSize: 20,
  },
});
//export default LoginScreen;
// (Removed duplicate export default)
