---
id: installationExpo
title: Installation (Expo)
sidebar_label: Installation (Expo)
---

For now, only `core` is compatible with Expo. Intended for use with a managed Expo project.

## 1. Install the needed packages

<!--DOCUSAURUS_CODE_TABS-->
<!--Yarn-->

```
yarn add @rn-matrix/expo
```

<!--NPM-->

```
npm i @rn-matrix/expo --save
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 2. Install peer dependencies

```
expo install expo-crypto expo-random expo-localization expo-file-system @react-native-community/async-storage
```

## 3. Add or edit the metro.config.js file

At the root of your project, add or edit the metro.config.js file to include this:

```js
// metro.config.js
module.exports = {
  resolver: {
    extraNodeModules: require('node-libs-expo'),
  },
};
```

## 4. Require globals and polyfill URL

Add these lines in your app before anything else:

```js
import 'node-libs-expo/globals';
import '@rn-matrix/expo/shim.js';

import {polyfillGlobal} from 'react-native/Libraries/Utilities/PolyfillFunctions';
polyfillGlobal('URL', () => require('whatwg-url').URL);
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 5. Initialize auth

In order to initialize the Matrix SDK to detect auth, you'll need to put this code snippet at the top level of your app, when it starts up, and before any other code is called.

*** This is not needed if you're doing token authentication (like with SSO) - only needed for an actual auth flow ***

```js
import { matrix } from '@rn-matrix/expo';
...
matrix.initAuth()
```
