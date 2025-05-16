import { Audio } from "expo-av";

let soundObject: Audio.Sound | null = null;

export async function playRemoveSound() {
  const sound_file_name: string = "crumple-03-40747.mp3";
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
    console.warn("Error playing remove sound", e);
  }
}
