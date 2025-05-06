/**
 * Global type declarations used across the entire project.
 * This file extends or defines custom types, interfaces, and global variables
 * that should be accessible from any module without needing to import them explicitly.
 *
 * Useful for setting up ambient types, theme definitions, or environmental constants.
 */
declare module "*.svg" {
  import * as React from "react";
  import { SvgProps } from "react-native-svg";
  const Component: React.FC<SvgProps>;
  export default Component;
}
