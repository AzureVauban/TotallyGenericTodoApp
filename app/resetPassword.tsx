import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

/* ---------- Palette shared through the app ---------- */
const COLORS = {
  dark_primary: "#101010",
  dark_secondary: "#1A1A1A",
  dark_tertiary: "#373737",
  dark_accents: "#F26C4F",
  dark_subaccents: "#C5C5C5",
  dark_senary: "#808080",
  dark_icon_text: "#F26C4F",

  light_primary: "#F26C4F",
  light_secondary: "#FFFFFF",
  light_tertiary: "#CCCCCC",
  light_accents: "#101010",
  light_subaccents: "#373737",
  light_senary: "#E8A87C",
  light_icon_text: "#101010",
};

/* ---------------------------------------------------- */

export default function ResetPassword() {
  const router = useRouter();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleNext = () => {
    // TODO: connect to backend / validation
    router.back(); // for now just pop the screen
  };

  return (
    <SafeAreaView style={s.screen}>
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* ---------- header ---------- */}
        <View style={s.headerBlock}>
          <Text style={s.title}>Reset{"\n"}Password</Text>
          <Text style={s.subtitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod.
          </Text>
        </View>

        {/* ---------- form ---------- */}
        <View style={s.form}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={COLORS.dark_senary}
            secureTextEntry
            value={pwd}
            onChangeText={setPwd}
            style={s.input}
          />

          <TextInput
            placeholder="Confirm password"
            placeholderTextColor={COLORS.dark_senary}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            style={s.input}
          />
        </View>

        {/* ---------- CTA ---------- */}
        <TouchableOpacity
          style={s.nextBtn}
          onPress={() => {
            console.log("User pressed reset password");
            router.push("/confirmPassword");
          }}
        >
          <Text style={s.nextTxt}>Next ›</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.dark_primary,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingVertical: 48,
    justifyContent: "space-between",
  },

  headerBlock: { gap: 16 },

  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "bold",
    color: COLORS.light_secondary,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.dark_senary,
  },

  form: {
    gap: 16,
  },

  input: {
    backgroundColor: COLORS.dark_secondary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.light_secondary,
  },

  nextBtn: {
    alignSelf: "center",
    backgroundColor: COLORS.dark_accents,
    borderRadius: 12,
    paddingHorizontal: 64,
    paddingVertical: 14,
    marginTop: 24,
  },

  nextTxt: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.light_secondary,
  },
});
