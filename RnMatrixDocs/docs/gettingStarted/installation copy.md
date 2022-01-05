---
id: installation
title: Installation
sidebar_label: Installation
---

### These docs assume basic knowledge of React Native and Matrix jargon.

Example app: [https://gitlab.com/annie-elequin/rn-matrix/-/tree/master/RnMatrixExample](https://gitlab.com/annie-elequin/rn-matrix/-/tree/master/RnMatrixExample)

<br />

## 1. Install the package

<!--DOCUSAURUS_CODE_TABS-->
<!--Yarn-->

```
yarn add rn-matrix
```

<!--NPM-->

```
npm i rn-matrix --save
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 2. Install peer dependencies

<!--DOCUSAURUS_CODE_TABS-->
<!--Yarn-->

```
yarn add react-native-localize @react-native-community/async-storage react-native-svg react-native-svg-transformer rn-nodeify react-native-image-picker
```

<!--NPM-->

```
npm i react-native-localize  @react-native-community/async-storage react-native-svg react-native-svg-transformer rn-nodeify react-native-image-picker --save
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 3. Add postinstall script

Add the following line to the `scripts` section of your `package.json`:

```
"postinstall": "./node_modules/.bin/rn-nodeify --install 'url,process,fs,events,buffer,crypto,stream,path,vm,util' --hack --yarn"
```

## 4. Run postinstall script

Run the above script with `yarn postinstall` or `npm run postinstall`

## 5. Install Pods

Do this in the root directory, or if you prefer run `cd ios && pod install && cd ..` in the root directory

```
npx pod-install
```

## 6. Add shim.js to index.js

A file called "shim.js" should have been added to the root of your project. Add this line to the TOP of your project, either in index.js or App.js.

Example: [index.js in the Example App](https://gitlab.com/annie-elequin/rn-matrix-example/-/blob/master/index.js)

```
import './shim.js'
```

## 7. Proguard (Android)

Add the following line in `android/app/proguard-rules.pro`

```
-keep public class com.horcrux.svg.** {*;}
```

## 8. Replace `metro.config.js`

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

## 10. Initialization

In order to initialize the Matrix SDK, you'll need to put this code snippet at the top level of your app, when it starts up. I recommend placing it in a "useEffect".

- baseUrl: **your homeserver**
- accessToken: **your access token, found in Riot**
- MXID: **your MXID, like @annie:ditto.chat**

```js
import { matrix } from 'rn-matrix';
...
matrix.createClient(baseUrl, accessToken, mxid);
matrix.start();
```
