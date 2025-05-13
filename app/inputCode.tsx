import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const COLORS = {
  dark_primary: "#101010",
  dark_secondary: "#1A1A1A",
  dark_tertiary: "#373737",
  dark_accents: "#F26C4F",
  dark_subaccents: "#C5C5C5",
};

const InputCodeScreen = () => {
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
      <View style={styles.screenbackground}>
        <Text style={styles.title}>Type in code</Text>
        <TextInput
          style={styles.input}
          maxLength={6}
          keyboardType="numeric"
          value={code}
          editable={false} // This prevents keyboard pop-up but allows state update
          placeholder="------"
          placeholderTextColor={COLORS.dark_subaccents}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Verify and continue →</Text>
        </TouchableOpacity>
        <View style={styles.numPad}>
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.numButton}
              onPress={() => handleNumpadPress(num.toString())}
            >
              <Text style={styles.numButtonText}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.numButton, styles.emptyButton]} />
          <TouchableOpacity
            style={styles.numButton}
            onPress={() => handleNumpadPress("0")}
          >
            <Text style={styles.numButtonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numButton}
            onPress={() => handleNumpadPress("⌫")}
          >
            <Text style={styles.numButtonText}>⌫</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  screenbackground: {
    flex: 1,
    backgroundColor: COLORS.dark_primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.dark_accents,
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.dark_secondary,
    borderRadius: 8,
    padding: 12,
    color: COLORS.dark_subaccents,
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: COLORS.dark_accents,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: COLORS.dark_primary,
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
    backgroundColor: COLORS.dark_tertiary,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 8,
  },
  numButtonText: {
    color: COLORS.dark_subaccents,
    fontSize: 22,
    fontWeight: "bold",
  },
  emptyButton: {
    backgroundColor: "transparent",
    elevation: 0,
  },
});
export default InputCodeScreen;
