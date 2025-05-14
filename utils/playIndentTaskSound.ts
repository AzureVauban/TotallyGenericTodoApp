import { Audio } from "expo-av";

let soundObject: Audio.Sound | null = null;

export async function playIndentTasksound() {
  try {
    if (!soundObject) {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sfx/ui-button-click-5-327756.mp3")
      );
      soundObject = sound;
    }
    await soundObject.replayAsync(); // or playAsync() if you don’t want to rewind
  } catch (e) {
    console.warn("Error playing task indenting sound", e);
  }
}
