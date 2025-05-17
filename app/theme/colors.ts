// app/theme/colors.ts
export const light = {
  primary: "rgb(24, 24 ,27)",
  secondary: "rgb(63 ,63 ,70)",
  tertiary: "rgb(63 ,63 ,70)",
  accent: "rgb(82, 82 ,91)",
  text: "rgb(55, 55, 55)",
  icon: "rgb(113 ,113, 122)",
  background: "rgb(161 ,161 ,170)",
  purplebutton_background: "rgb(76 ,29 ,149)",
  purplebutton_text_icon: "rgb(221 ,214 ,254)",
  bluebutton_background: "rgb(37, 99, 235)",
  bluebutton_text_icon: "rgb(191 ,219 ,254)",
  greenbutton_background: "rgb(22 ,163 ,74)",
  greenbutton_text_icon: "rgb(187, 247 ,208)",
  yellowbutton_background: "rgb(234,179,8)",
  yellowbutton_text_icon: "rgb(146 ,64 ,14)",
  redbutton_background: "rgb(127 ,29, 29)",
  redbutton_text_icon: "rgb(254, 202, 202)",
  input: "rgb(255, 255, 255)", // ADD THIS LINE
};

export const dark = {
  primary: "rgb(161 ,161 ,170)",
  secondary: "rgb(113 ,113, 122)",
  tertiary: "rgb(55, 55, 55)",
  accent: "rgb(82, 82 ,91)",
  text: "rgb(63 ,63 ,70)",
  icon: "rgb(63 ,63 ,70)",
  background: "rgb(24, 24 ,27)",
  purplebutton_background: "rgb(76 ,29 ,149)",
  purplebutton_text_icon: "rgb(221 ,214 ,254)",
  bluebutton_background: "rgb(37, 99, 235)",
  bluebutton_text_icon: "rgb(191 ,219 ,254)",
  greenbutton_background: "rgb(22 ,163 ,74)",
  greenbutton_text_icon: "rgb(187, 247 ,208)",
  yellowbutton_background: "rgb(234,179,8)",
  yellowbutton_text_icon: "rgb(146 ,64 ,14)",
  redbutton_background: "rgb(127 ,29, 29)",
  redbutton_text_icon: "rgb(254, 202, 202)",
  input: "rgb(32, 32, 32)", // ADD THIS LINE
};

// zinc
export const colors = { light, dark }; //? include for single entry point

// Default export to satisfy Expo Router's routing rules
export default function ColorsModule() {
  return null;
}
