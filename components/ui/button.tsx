import * as React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

type ButtonProps = {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: "default" | "outline";
  style?: any;
};

export function Button({
  children,
  onPress,
  variant = "default",
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button]}
      onPressIn={() => {
        console.log("HOMESCREEN BUTTON PRESSED");
      }}
      onLongPress={() => {
        console.log("HOMESCREEN BUTTON LONG PRESSED");
      }}
      onPressOut={() => {
        console.log("HOMESCREEN BUTTON RELEASED");
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, variant === "outline" && styles.outlineText]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#b16286",
    //color: "#d65d0e",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
  },
  outline: {
    backgroundColor: "black",
    color: "#689d6a",
    borderWidth: 1,
    borderColor: "black",
  },
  text: {
    color: "#d65d0e",
    fontWeight: "bold",
  },
  outlineText: {
    color: "#689d6a",
  },
});
