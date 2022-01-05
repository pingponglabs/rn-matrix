---
id: installationUi
title: Installation - @rn-matrix/ui
sidebar_label: Installation (UI)
---

### NOT REQUIRED

This package is NOT required to use the data side of `rn-matrix`. This library contains default UI components like an inbox and message view, but you can implement your own as well.

<br />

## 1. Install the core package

<!--DOCUSAURUS_CODE_TABS-->
<!--Yarn-->

```
yarn add @rn-matrix/ui
```

<!--NPM-->

```
npm i @rn-matrix/ui --save
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 2. Install peer dependencies

<!--DOCUSAURUS_CODE_TABS-->
<!--Yarn-->

```
yarn add react-native-svg react-native-svg-transformer react-native-webview react-native-image-picker react-native-document-picker react-native-file-viewer react-native-video react-native-fs
```

<!--NPM-->

```
npm i react-native-svg react-native-svg-transformer react-native-webview react-native-image-picker react-native-document-picker react-native-file-viewer react-native-video react-native-fs --save
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 3. Follow Android installation for `react-native-video`

The iOS installation is already handled in step 4.

[https://github.com/react-native-community/react-native-video#android-installation](https://github.com/react-native-community/react-native-video#android-installation)

## 4. Install Pods

Do this in the root directory, or if you prefer run `cd ios && pod install && cd ..` in the root directory

```
npx pod-install
```

## 5. Replace `metro.config.js`

Replace (or merge) the contents of your `metro.config.js` with the following code. For more information on this, read the `react-native-svg-transformer` docs [HERE](https://github.com/kristerkari/react-native-svg-transformer#step-3-configure-the-react-native-packager)

```js
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    transformer: {
      experimentalImportSupport: false,
      inlineRequires: false,
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };
})();
```
