import { Audio } from "expo-av";

let soundObject: Audio.Sound | null = null;

export async function playUnflaggedSound() {
  try {
    if (!soundObject) {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sfx/toggle-button-off.mp3")
        // toggle-button-off.mp3
      );
      soundObject = sound;
    }
    await soundObject.replayAsync(); // or playAsync() if you don’t want to rewind
  } catch (e) {
    console.warn("Error playing task unflagging sound", e);
  }
}
