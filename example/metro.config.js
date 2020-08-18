/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
// const {getDefaultConfig} = require('metro-config');
const path = require('path');

const watchFolders = [path.resolve(__dirname, '..', 'node_modules')];

module.exports = (async () => {
  // const {
  //   resolver: {sourceExts, assetExts},
  // } = await getDefaultConfig();

  return {
    transformer: {
      experimentalImportSupport: false,
      inlineRequires: false,
      // babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    // resolver: {
    //   assetExts: assetExts.filter((ext) => ext !== 'svg'),
    //   sourceExts: [...sourceExts, 'svg'],
    // },
    resolver: {
      extraNodeModules: {
        '@rn-matrix/core': `${__dirname}/../node_modules/@rn-matrix/core`,
      },
    },
  };
})();
