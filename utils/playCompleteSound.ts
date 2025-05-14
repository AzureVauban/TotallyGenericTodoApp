// app/utils/playCompleteSound.ts
import { Audio } from "expo-av";

let soundObject: Audio.Sound | null = null;

export async function playCompleteSound() {
  try {
    if (!soundObject) {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sfx/ding-sfx-330333.mp3")
      );
      soundObject = sound;
    }
    await soundObject.replayAsync(); // or playAsync() if you don’t want to rewind
  } catch (e) {
    console.warn("Error playing task completion sound", e);
  }
}
