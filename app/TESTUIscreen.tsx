import React, { useState, createContext, useContext } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { NaniColors } from "@theme/colors";

type ThemeType = "light" | "dark";
const ThemeContext = createContext<{ theme: ThemeType; isDark: boolean }>({
  theme: "light",
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

const TESTUIscreen: React.FC = () => {
  //! make sure the Anonymous Pro font is loaded
  const [fontsLoaded] = useFonts({
    "AnonymousPro-Regular": require("../assets/fonts/Anonymous_Pro/AnonymousPro-Regular.ttf"),
    "AnonymousPro-Bold": require("../assets/fonts/Anonymous_Pro/AnonymousPro-Bold.ttf"),
  });

  const [isDark, setIsDark] = useState(true);
  const [inputValue, setInputValue] = React.useState("");
  const hasNavigated = React.useRef(false);
  const router = useRouter();
  const [translationX] = useState(0);

  function changeTheme() {
    if (isDark) {
      console.log("Switching to light theme");
      setIsDark(false);
    } else {
      console.log("Switching to dark theme");
      setIsDark(true);
    }
  }

  // swipe left to go to previous screen
  // This is a placeholder for swipe detection logic
  if (translationX > 100 && !hasNavigated.current) {
    hasNavigated.current = true;
    router.back();
  }

  return (
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
                console.log("[TESTUI]: SIGN-UP Button Pressed");
                changeTheme();
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
            placeholder="Type something..."
            value={inputValue}
            onChangeText={setInputValue}
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
              console.log("[TESTUI]: Button Pressed");
              changeTheme();
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
    </SafeAreaView>
  );
};

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
});

export default TESTUIscreen;
