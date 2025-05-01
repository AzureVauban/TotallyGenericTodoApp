const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // 1) Remove svg from assetExts so
  //    SVGs are handled as JS modules
  config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
  // 2) Add svg to sourceExts so Metro parses them
  config.resolver.sourceExts.push('svg');

  // 3) Use the SVG transformer
  config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

  return config;
})();
