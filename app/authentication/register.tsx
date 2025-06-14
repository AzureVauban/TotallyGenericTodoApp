import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { colors, NaniColors } from "@theme/colors";
import { Icon } from "react-native-elements"; // Adjust the import path based on your project setup
import { useFonts } from "expo-font";
import { generateUsername } from "utils/generateUsername";
import { playFlaggedSound } from "utils/sounds/flag";
import { playInvalidSound } from "utils/sounds/invalid";
//import { styles } from "@theme/styles";
import { useTheme } from "lib/ThemeContext";

import { getAuthErrorMessage } from "../../lib/auth-exceptions";
import { supabase } from "../../lib/supabaseClient";

export default function LoginScreen() {
  console.log("[REGISTER-SCREEN] Rendered");
  const [fontsLoaded] = useFonts({
    "AnonymousPro-Regular": require("../../assets/fonts/Anonymous_Pro/AnonymousPro-Regular.ttf"),
    "AnonymousPro-Bold": require("../../assets/fonts/Anonymous_Pro/AnonymousPro-Bold.ttf"),
  });

  const [initialUsername, setInitialUsername] = useState(generateUsername());
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState("");

  //! COMMITED OUT BECAUSE PASSWORDLESS LOGINS ARE USED
  //!const [password, setPassword] = useState("");
  //!const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  //!const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const isGeneratedUsername = username.trim() === initialUsername;

  // Animated values for background colors
  const usernameBgAnim = useRef(new Animated.Value(0)).current;
  const emailBgAnim = useRef(new Animated.Value(0)).current;
  const passwordBgAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordBgAnim = useRef(new Animated.Value(0)).current;

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

  // Watch for error state changes and trigger animation
  useEffect(() => {
    if (usernameError && !isGeneratedUsername) {
      playInvalidSound();
      triggerErrorAnimation(usernameBgAnim);
    }
  }, [usernameError, isGeneratedUsername]);

  useEffect(() => {
    if (emailError) {
      playInvalidSound();
      triggerErrorAnimation(emailBgAnim);
    }
  }, [emailError]);

  //!  useEffect(() => {
  //!    if (passwordError) {
  //!      playInvalidSound();
  //!      triggerErrorAnimation(passwordBgAnim);
  //!    }
  //!  }, [passwordError]);

  useEffect(() => {
    if (confirmPasswordError) {
      playInvalidSound();
      triggerErrorAnimation(confirmPasswordBgAnim);
    }
  }, [confirmPasswordError]);

  // Interpolate background color
  const getBgColor = (animRef, error, isUsernameField = false) =>
    animRef.interpolate({
      inputRange: [0, 1],
      outputRange: [
        isUsernameField && usernameError && !isGeneratedUsername
          ? styles.inputBackgroundError.backgroundColor
          : colors[theme].background,
        styles.inputBackgroundError.backgroundColor,
      ],
    });

  let blueStripeMarginTopValue = 12; // Default value for marginTop of blue stripes
  if (!fontsLoaded) {
    console.warn("[REGISTER-SCREEN]: Fonts not loaded yet, returning null");
    return null; // Simple null return
  }

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
          {/* CONTAINER FOR SIGN IN */}
          <View
            style={[
              styles.orangetab,
              {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                top: "-12.5%",
              },
            ]}
          >
            {/* Top section with title and input */}

            {/* Middle section with stripes */}
            {[...Array(24)].map((_, i) => (
              <View key={i} style={styles.horizontalstripe} />
            ))}
            {/* Bottom section with button */}
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  console.log("[REGISTER]: REGISTER Button Pressed");
                  router.push("/authentication/login");
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
          </View>
        </View>
        {/* CONTAINER FOR SIGN UP */}
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
                top: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
            ]}
          >
            {/* Title */}
            <Text
              style={[
                styles.title,
                {
                  color: isDark
                    ? NaniColors.new_primary
                    : NaniColors.new_primary, //? redundant, but in-place incase color theme is changed
                  fontSize: 60,
                },
              ]}
            >
              TO DO:{"\n"}SIGNUP{"\n"}HERE
            </Text>
            {/* DISPLAY-NAME Input */}
            <TextInput //? ADD CODE TO CHECK IF USERNAME IS TAKEN (error checking code called on signup button press)
              style={[
                //TODO IF ERROR, HAVE background color change to red
                styles.input,
                {
                  borderColor: colors[theme].tertiary,
                  color: colors[theme].text,
                  backgroundColor: NaniColors.new_accent2compliment,
                },
              ]}
              placeholder="add your name..."
              placeholderTextColor={colors[theme].secondary}
              value={username}
              onChangeText={(text) => setUsername(text.slice(0, 25))} // Limit input to 20 characters
              maxLength={25} // Prevent further input beyond 20 characters
            />
            {/* EMAIL Input */}
            <TextInput //? ADD CODE TO CHECK IF EMAIL IS TAKEN (error checking code called on signup button press)
              style={[
                //TODO IF ERROR, HAVE background color change to red
                styles.input,
                {
                  borderColor: colors[theme].tertiary,
                  color: colors[theme].text,
                  backgroundColor: NaniColors.new_accent2compliment,
                },
              ]}
              placeholder="add your email..."
              placeholderTextColor={colors[theme].secondary}
              value={email}
              onChangeText={(text) => setEmail(text.slice(0, 25))} // Limit input to 15 characters
              maxLength={25}
            />
            {/* MOVE the horizontal stripes HERE - between last input and button */}
            <View
              style={[
                styles.horizontalStripesContainer,
                {
                  position: "relative", // Override absolute positioning
                  width: "90%",
                  marginVertical: blueStripeMarginTopValue, // Add some space above and below
                  alignItems: "center",
                  top: 0, // Reset any top positioning
                  left: 0, // Reset any left positioning
                  right: 0, // Reset any right positioning
                  bottom: 0, // Reset any bottom positioning
                },
              ]}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.horizontalstripe,
                    {
                      marginTop: blueStripeMarginTopValue,
                      backgroundColor: NaniColors.new_accent2compliment,
                    },
                  ]}
                />
              ))}
            </View>
            {/* SIGN-UP Button */}
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => {
                console.log("[LOGIN-SCREEN]: SIGN-IN Button Pressed");
                if (!username || !email) {
                  console.warn("[LOGIN-SCREEN]: SIGN-IN Button Pressed");
                  setErrorMessage("Please enter your username and email.");
                  playInvalidSound();
                  return;
                }
                // Handle the sign-up logic here
                supabase.auth
                  .signUp({
                    email: email,
                    options: {
                      data: {
                        username: username,
                      },
                    },
                    password: "",
                  })
                  .then(({ data, error }) => {
                    if (error) {
                      console.error(
                        "[REGISTER-SCREEN]: Error signing up",
                        error
                      );
                      setErrorMessage(getAuthErrorMessage(error));
                      playFlaggedSound();
                    } else {
                      console.log(
                        "[REGISTER-SCREEN]: Sign-up successful",
                        data
                      );
                      router.push("/authentication/login");
                    }
                  });
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

        {/*
          <TouchableOpacity style={styles.sendlinkbutton}>
            <Icon
              name="check-circle"
              type="vuesax/bold"
              style={StyleSheet.flatten([
                styles.sendlinkbutton_text,
                {
                  color: isDark
                    ? NaniColors.new_accent
                    : NaniColors.new_accent,
                },
              ])}
            />
          </TouchableOpacity>
        */}
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
    //backgroundColor: NaniColors.new_accent2,
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
    backgroundColor: NaniColors.new_accent2compliment,
    width: "90%",
    height: 50, // Change from "8%" to fixed height
    fontFamily: "AnonymousPro-Bold",
    textAlign: "center",
    fontSize: 20,
    marginTop: 15,
    paddingHorizontal: 10, // Add horizontal padding
    paddingVertical: 8, // Add vertical padding for better text positioning
  },
  horizontalstripe: {
    height: 6,
    width: "100%", // Now relative to the inset container
    backgroundColor: NaniColors.new_accentcompliment,
    marginVertical: 4,
    borderRadius: 3, // Round the stripe edges
  },
  button: {
    backgroundColor: NaniColors.new_accent,
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-start", // Align to the left like in reference
    marginTop: 10,
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
    left: "-19.5%",
    top: -77,
    alignItems: "flex-start",
    justifyContent: "space-between", // This should distribute content
    paddingTop: 30,
    paddingLeft: 24,
    paddingBottom: 20, // Add bottom padding for the button
    paddingRight: 24, // Add right padding
    overflow: "visible", // Allow shadows to show
    shadowColor: NaniColors.new_accentcompliment,
    shadowOffset: { width: -18, height: 13.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  blueTabShadowWrapper: {
    width: "65%",
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
    color: NaniColors.new_primary,
    fontSize: 30,
    fontFamily: "AnonymousPro-Bold",
    textAlign: "center",
    opacity: 1,
  },
  horizontalStripesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    //addingVertical:,
  },
  signUpButton: {
    backgroundColor: NaniColors.new_accent2, // Solid color, no transparency
    padding: 10,
    borderRadius: 5,
    // Ensure no opacity is set
    opacity: 1,
    alignSelf: "flex-end",
  },
  forgot: {
    marginTop: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  inputBackgroundError: {
    backgroundColor: "#7f1d1d",
  },
  topSection: {
    alignItems: "flex-start",
    width: "100%",
  },
  stripesSection: {
    flex: 1, // Takes up remaining space
    width: "100%",
    position: "relative",
  },
  bottomSection: {
    alignItems: "flex-start",
    width: "100%",
  },
  sendlinkbutton: {
    backgroundColor: NaniColors.new_primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    right: "-10%",
    width: "100%",
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
