/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
// const {getDefaultConfig} = require('metro-config');
const path = require('path');
const getWorkspaces = require('get-yarn-workspaces');
const workspaces = getWorkspaces(__dirname);

console.log('WORKSPACES ', workspaces);

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
  };
})();
