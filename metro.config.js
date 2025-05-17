const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  config.transformer.babelTransformerPath = require.resolve(
    "react-native-svg-transformer"
  );
  config.resolver.assetExts = config.resolver.assetExts.filter(
    (ext) => ext !== "svg"
  );
  // Disable strict package exports so Metro will default to the JS/browser builds
  config.resolver.unstable_enablePackageExports = false;
  config.resolver.sourceExts.push("svg");

  return config;
})();
// metro.config.js

module.exports = {
  dependencies: {
    "react-native-python": {
      platforms: {
        ios: null,
        android: null,
      },
    },
  },
};
