// metro.config.js  ⟵‑‑ ensure this is CommonJS, **not** JSON
const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// ▸ Add SVG support
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts.push("svg");
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

module.exports = config;
