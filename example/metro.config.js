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
      // extraNodeModules: {
      //   '@rn-matrix/core': path.resolve(__dirname, '..', 'node_modules'),
      // },
      extraNodeModules: new Proxy(
        {},
        {
          get: (target, name) =>
            path.join(process.cwd(), `node_modules/${name}`),
        },
      ),
    },
    watchFolders: [
      path.resolve(__dirname, '..', 'node_modules'),
      path.resolve(__dirname, '..', 'node_modules/@rn-matrix'),
      ...workspaces.filter((workspaceDir) => workspaceDir !== __dirname),
    ],
  };
})();
