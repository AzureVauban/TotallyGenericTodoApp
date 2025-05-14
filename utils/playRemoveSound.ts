import { Audio } from "expo-av";

let soundObject: Audio.Sound | null = null;

export async function playRemoveSound() {
  try {
    if (!soundObject) {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/sfx/crumple-03-40747.mp3") //? it's old name is denie-96177.mp3
      );
      soundObject = sound;
    }
    await soundObject.replayAsync(); // or playAsync() if you don’t want to rewind
  } catch (e) {
    console.warn("Error playing remove sound", e);
  }
}
