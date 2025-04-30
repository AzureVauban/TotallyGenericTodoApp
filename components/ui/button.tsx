import * as React from "react"
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from "react-native"

type ButtonProps = {
  children: React.ReactNode
  onPress?: (event: GestureResponderEvent) => void
  variant?: "default" | "outline"
  style?: any
}

export function Button({ children, onPress, variant = "default", style }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "outline" && styles.outline,
        style,
      ]}
      onPressIn={() => {console.log("HOMESCREEN BUTTON PRESSED");}}
      onLongPress={() => {console.log("HOMESCREEN BUTTON LONG PRESSED");}}
      onPressOut={() => {console.log("HOMESCREEN BUTTON RELEASED");}}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, variant === "outline" && styles.outlineText]}>
        {children}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
  },
  outline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007bff",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
  outlineText: {
    color: "#007bff",
  },
})












// (no extraneous code)
