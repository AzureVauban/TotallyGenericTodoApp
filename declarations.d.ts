/**
 * Type declarations for importing non-TypeScript modules.
 * This file enables TypeScript to recognize `.svg` files as valid React components
 * using `react-native-svg-transformer`. Without it, importing SVGs would raise module errors.
 */
declare module "*.svg" {
  import * as React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
