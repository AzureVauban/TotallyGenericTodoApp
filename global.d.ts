declare module "*.svg" {
  import * as React from "react";
  import { SvgProps } from "react-native-svg";
  const Component: React.FC<SvgProps>;
  export default Component;
}
