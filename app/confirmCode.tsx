import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
/**
 * **VerifyPhone Screen**
 *
 * Renders a 4‑digit SMS/OTP verification UI for the phone‑number sign‑in flow.
 *
 * ### Behaviour
 * 1. Displays four empty boxes that fill as the user taps digits on the custom keypad.
 * 2. The *Verify and continue* button is only active when all four digits are entered;
 *    pressing it navigates to `/home`.
 * 3. The keypad includes:
 *    * Digits 0‑9 – appends a digit (max length 4).
 *    * `←` – navigates back to `/verificationMethod`.
 *    * `⌫` – deletes the last digit.
 *
 * ### Hooks & Navigation
 * * **`useState`** – tracks the current 4‑digit `code`.
 * * **`useRouter`** – handles in‑app navigation with Expo Router.
 *
 * @returns A React‑Native `SafeAreaView` containing the verification UI.
 */
export default function VerifyPhone() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handlePress = (digit: string) => {
    if (code.length < 4) setCode(code + digit);
  };

  const handleBackspace = () => {
    setCode(code.slice(0, -1));
  };

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Verify Phone</Text>
      <Text style={styles.subtitle}>
        We sent a code to your number. Enter it to continue.
      </Text>

      <View style={styles.codeContainer}>
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} style={styles.codeBox}>
            <Text style={styles.codeText}>{code[i] || ""}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.verifyButton}
        onPress={() => {
          if (code.length === 4) {
            router.replace("/home");
          }
        }}
      >
        <Text style={styles.verifyButtonText}>Verify and continue</Text>
      </TouchableOpacity>

      <View style={styles.keypad}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <TouchableOpacity
            key={d}
            style={styles.key}
            onPress={() => handlePress(d)}
          >
            <Text style={styles.keyText}>{d}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.key} onPress={() => handlePress("0")}>
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.key}
          onPress={() => router.replace("/verificationMethod")}
        >
          <Text style={styles.keyText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.key} onPress={handleBackspace}>
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    padding: 24,
    justifyContent: "flex-start",
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
    marginVertical: 12,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 24,
  },
  codeBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  codeText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  verifyButton: {
    backgroundColor: "#F26C4F",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  key: {
    width: "30%",
    marginVertical: 10,
    aspectRatio: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  keyText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
