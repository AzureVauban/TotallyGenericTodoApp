import { Text, View } from "react-native";
import { Button } from "@/components/ui/button"
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const handlePress = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Button pressed!",
        body: "You tapped the button.",
      },
      trigger: null, // send immediately
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        variant="outline"
        style={{ backgroundColor: "black", borderRadius: 12 }}
        onPress={handlePress}
      >
        <Text style={{ color: "white" }}>
          PRESS ME
        </Text>
      </Button>

      <Text>
        PRESS THE BUTTON IF YOU THINK MILO{"\n"}FARTS TOO MUCH FOR THIS OWN GOOD
      </Text>
    </View>
  );
}
