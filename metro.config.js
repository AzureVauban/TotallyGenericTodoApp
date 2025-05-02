// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  const {
    transformer: { babelTransformerPath, ...transformerRest },
    resolver: { assetExts, sourceExts, ...resolverRest },
  } = config;

  return {
    transformer: {
      ...transformerRest,
      // point Metro at react-native-svg-transformer
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    },
    resolver: {
      ...resolverRest,
      // remove svg from assetExts so Metro treats them as source
      assetExts: assetExts.filter((ext) => ext !== "svg"),
      // add svg to sourceExts so Metro will process .svg with the above transformer
      sourceExts: [...sourceExts, "svg"],
    },
  };
})();
