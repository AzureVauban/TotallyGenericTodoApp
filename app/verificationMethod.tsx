import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "@theme/colors";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";

/**
 * **VerificationMethod Screen**
 *
 * Lets the user choose how they want to receive their one‑time code—by **email**
 * or **phone**—before proceeding to the corresponding verification screen.
 *
 * ### Interaction
 * * Tapping an option toggles its selection (email ↔ phone).
 * * Pressing **Next**:
 *   - If _no_ option is selected, sets an error message (“Please select a
 *     verification method.”) displayed in red beneath the button.
 *   - If **Email** is selected, navigates to `/EmailAuthScreen`.
 *   - If **Phone** is selected, navigates to `/PhoneAuthScreen`.
 *
 * ### Visuals
 * * Two rounded boxes show the available methods with icons and sample
 *   destination text.  The selected box gets an orange border (`#F26C4F`).
 * * A single orange “Next” button lives in a footer container.
 *
 * ### Hooks & State
 * * `selectedMethod` – `"email" | "phone" | null`.
 * * `errorMessage` – string shown when the user taps **Next** without a choice.
 * * `useRouter` from **expo-router** handles navigation.
 *
 * @returns A `SafeAreaView` containing the selection UI and Next button.
 */

export default function VerificationMethod() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<
    "email" | "phone" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { theme } = useTheme();
  const isDark = theme === "dark";
  useFocusEffect(React.useCallback(() => {}, [theme]));

  const onSwipe = ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
    if (nativeEvent.state === State.END && nativeEvent.translationX > 100) {
      router.replace("/registerAccount");
    }
  };

  return (
    <PanGestureHandler onHandlerStateChange={onSwipe}>
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: isDark
              ? colors.dark.background
              : colors.light.background,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: isDark ? colors.dark.accent : colors.light.accent },
          ]}
        >
          Verification Method
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isDark ? colors.dark.text : colors.light.text },
          ]}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod.
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionBox,
              {
                backgroundColor: isDark
                  ? colors.dark.secondary
                  : colors.light.secondary,
              },
              selectedMethod === "email" && {
                borderColor: isDark ? colors.dark.accent : colors.light.accent,
                borderWidth: 2,
              },
            ]}
            onPress={() =>
              setSelectedMethod(selectedMethod === "email" ? null : "email")
            }
          >
            <MaterialIcons
              name="email"
              size={24}
              color={isDark ? colors.dark.accent : colors.light.accent}
            />
            <Text
              style={[
                styles.optionTitle,
                { color: isDark ? colors.dark.text : colors.light.text },
              ]}
            >
              Email
            </Text>
            <Text
              style={[
                styles.optionInfo,
                { color: isDark ? colors.dark.text : colors.light.text },
              ]}
            >
              amanda.samarth@email.com
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionBox,
              {
                backgroundColor: isDark
                  ? colors.dark.secondary
                  : colors.light.secondary,
              },
              selectedMethod === "phone" && {
                borderColor: isDark ? colors.dark.accent : colors.light.accent,
                borderWidth: 2,
              },
            ]}
            onPress={() =>
              setSelectedMethod(selectedMethod === "phone" ? null : "phone")
            }
          >
            <Ionicons
              name="call"
              size={24}
              color={isDark ? colors.dark.accent : colors.light.accent}
            />
            <Text
              style={[
                styles.optionTitle,
                { color: isDark ? colors.dark.text : colors.light.text },
              ]}
            >
              Phone
            </Text>
            <Text
              style={[
                styles.optionInfo,
                { color: isDark ? colors.dark.text : colors.light.text },
              ]}
            >
              +62 000-0000-0000
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor: isDark
                  ? colors.dark.accent
                  : colors.light.accent,
              },
            ]}
            onPress={() => {
              if (!selectedMethod) {
                setErrorMessage("Please select a verification method.");
              } else {
                setErrorMessage("");
                router.replace(
                  selectedMethod === "email"
                    ? "/EmailAuthScreen"
                    : "/PhoneAuthScreen"
                );
              }
            }}
          >
            <Text
              style={[
                styles.nextButtonText,
                { color: isDark ? colors.dark.text : colors.light.text },
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.errorMessage,
              { color: isDark ? colors.dark.accent : colors.light.accent },
            ]}
          >
            {errorMessage ? errorMessage : " "}
          </Text>
        </View>
      </SafeAreaView>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 40,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 30,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionBox: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  optionTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
  },
  optionInfo: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 4,
  },
  nextButton: {
    backgroundColor: "#F26C4F",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerContainer: {
    marginTop: 20,
  },
  errorMessage: {
    color: "#F26C4F",
    marginTop: 10,
    textAlign: "center",
    minHeight: 20,
  },
});
