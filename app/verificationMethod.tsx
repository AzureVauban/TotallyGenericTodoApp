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

export default function VerificationMethod() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<
    "email" | "phone" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Verification Method</Text>
      <Text style={styles.subtitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
      </Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionBox,
            selectedMethod === "email" && {
              borderColor: "#F26C4F",
              borderWidth: 2,
            },
          ]}
          onPress={() =>
            setSelectedMethod(selectedMethod === "email" ? null : "email")
          }
        >
          <MaterialIcons name="email" size={24} color="#F26C4F" />
          <Text style={styles.optionTitle}>Email</Text>
          <Text style={styles.optionInfo}>amanda.samarth@email.com</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionBox,
            selectedMethod === "phone" && {
              borderColor: "#F26C4F",
              borderWidth: 2,
            },
          ]}
          onPress={() =>
            setSelectedMethod(selectedMethod === "phone" ? null : "phone")
          }
        >
          <Ionicons name="call" size={24} color="#F26C4F" />
          <Text style={styles.optionTitle}>Phone</Text>
          <Text style={styles.optionInfo}>+62 000-0000-0000</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            if (!selectedMethod) {
              setErrorMessage("Please select a verification method.");
            } else {
              setErrorMessage("");
              router.replace(
                selectedMethod === "email" ? "/verifyEmail" : "/verifyPhone"
              );
            }
          }}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
        <Text style={styles.errorMessage}>
          {errorMessage ? errorMessage : " "}
        </Text>
      </View>
    </SafeAreaView>
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
