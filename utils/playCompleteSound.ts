// app/utils/playCompleteSound.ts
import { Audio } from "expo-av";

let soundObject: Audio.Sound | null = null;

export async function playCompleteSound() {
  const sound_file_name: string = "ding-sfx-330333.mp3";
  console.log("request to play", sound_file_name, "was inputted");

  try {
    if (!soundObject) {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sfx/" + sound_file_name),
      );
      soundObject = sound;
    }
    await soundObject.replayAsync(); // or playAsync() if you don’t want to rewind
  } catch (e) {
    console.warn("Error playing task completion sound", e);
  }
}
