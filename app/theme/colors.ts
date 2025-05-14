// app/theme/colors.ts
export const light = {
  primary:      "rgb(24, 24 ,27)",
  secondary:    "rgb(63 ,63 ,70)",
  tertiary:     "rgb(63 ,63 ,70)",
  accent:       "rgb(82, 82 ,91)",
  text:         "rgb(55, 55, 55)",
  icon:         "rgb(113 ,113, 122)",
  background:   "rgb(161 ,161 ,170)",
};

export const dark = {
  primary:      "rgb(161 ,161 ,170)",
  secondary:    "rgb(113 ,113, 122)",
  tertiary:     "rgb(55, 55, 55)"   ,
  accent:       "rgb(82, 82 ,91)"   ,
  text:         "rgb(63 ,63 ,70)"   ,
  icon:         "rgb(63 ,63 ,70)"   ,
  background:   "rgb(24, 24 ,27)"   ,
};
// zinc
export const colors = {light,dark,}; //? include for single entry point

// Default export to satisfy Expo Router's routing rules
export default function ColorsModule() {
  return null;
}