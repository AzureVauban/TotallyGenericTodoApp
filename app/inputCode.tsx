import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useTheme } from "@theme/ThemeContext";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "@theme/colors";

const InputCodeScreen = () => {
  //TODO implement supabase code https://supabase.com/docs/guides/auth/quickstarts/react-native (current on step 5)

  console.log(`Current file name: inputCode()`);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  useFocusEffect(React.useCallback(() => {}, [theme]));

  const navigation = useNavigation();
  const [code, setCode] = useState("");

  const handleSwipe = ({ nativeEvent }) => {
    if (nativeEvent.translationX > 50) {
      navigation.goBack();
    }
  };

  const handleNumpadPress = (value) => {
    if (value === "⌫") {
      setCode((prev) => prev.slice(0, -1));
    } else if (code.length < 6) {
      setCode((prev) => prev + value);
    }
  };

  return (
    <PanGestureHandler onHandlerStateChange={handleSwipe}>
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
        <Text
          style={[
            styles.title,
            { color: isDark ? colors.dark.accent : colors.light.accent },
          ]}
        >
          Type in code
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark
                ? colors.dark.secondary
                : colors.light.secondary,
              color: isDark ? colors.dark.text : colors.light.text,
            },
          ]}
          maxLength={6}
          keyboardType="numeric"
          value={code}
          editable={false} // This prevents keyboard pop-up but allows state update
          placeholder="------"
          placeholderTextColor={
            isDark ? colors.dark.tertiary : colors.light.tertiary
          }
        />
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isDark
                ? colors.dark.accent
                : colors.light.accent,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { color: isDark ? colors.dark.primary : colors.light.primary },
            ]}
          >
            Verify and continue →
          </Text>
        </TouchableOpacity>
        <View style={styles.numPad}>
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.numButton,
                {
                  backgroundColor: isDark
                    ? colors.dark.tertiary
                    : colors.light.tertiary,
                },
              ]}
              onPress={() => handleNumpadPress(num.toString())}
            >
              <Text
                style={[
                  styles.numButtonText,
                  { color: isDark ? colors.dark.text : colors.light.text },
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.numButton, styles.emptyButton]} />
          <TouchableOpacity
            style={[
              styles.numButton,
              {
                backgroundColor: isDark
                  ? colors.dark.tertiary
                  : colors.light.tertiary,
              },
            ]}
            onPress={() => handleNumpadPress("0")}
          >
            <Text
              style={[
                styles.numButtonText,
                { color: isDark ? colors.dark.text : colors.light.text },
              ]}
            >
              0
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.numButton,
              {
                backgroundColor: isDark
                  ? colors.dark.tertiary
                  : colors.light.tertiary,
              },
            ]}
            onPress={() => handleNumpadPress("⌫")}
          >
            <Text
              style={[
                styles.numButtonText,
                { color: isDark ? colors.dark.text : colors.light.text },
              ]}
            >
              ⌫
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  screenbackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 8,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  numPad: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "70%",
    justifyContent: "space-between",
    marginTop: 20,
  },
  numButton: {
    width: "28%",
    marginVertical: 8,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 8,
  },
  numButtonText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  emptyButton: {
    backgroundColor: "transparent",
    elevation: 0,
  },
});
export default InputCodeScreen;
