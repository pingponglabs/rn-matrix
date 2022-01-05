---
id: installation
title: Installation
sidebar_label: Installation
---

### These docs assume basic knowledge of React Native and Matrix jargon.

rn-matrix is split into two packages: `core` and `ui`. If you want to use your own UI completely, then you can just install core - follow the instructions on this page.

If you want a starting point, you can install the `ui` package and then render custom components, but this will require a few more native dependencies in your project. Continue to the next page to install the `ui` package.

<br />

## 1. Install the core package

<!--DOCUSAURUS_CODE_TABS-->
<!--Yarn-->

```
yarn add @rn-matrix/core
```

<!--NPM-->

```
npm i @rn-matrix/core --save
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 2. Install peer dependencies

<!--DOCUSAURUS_CODE_TABS-->
<!--Yarn-->

```
yarn add react-native-localize @react-native-community/async-storage node-libs-react-native rxjs observable-hooks react-native-randombytes
```

<!--NPM-->

```
npm i react-native-localize @react-native-community/async-storage node-libs-react-native rxjs observable-hooks react-native-randombytes --save
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 3. Add postinstall script

Add the following line to the `scripts` section of your `package.json`:

```
"postinstall": "sed -i '' '$s/}/,\"browser\":{\"fs\":\"react-native-level-fs\"}}/' node_modules/olm/package.json"
```

This script adds a snippet of code to the package.json in the olm library, mapping "fs" to "react-native-level-fs".

## 4. Add or edit the metro.config.js file

At the root of your project, add or edit the metro.config.js file to include this:

```js
// metro.config.js
module.exports = {
  resolver: {
    extraNodeModules: require('node-libs-react-native'),
  },
};
```

## 5. Require globals and polyfill URL

Add these lines in your app before anything else:

```js
import 'node-libs-react-native/globals';
import '@rn-matrix/core/shim.js';

import {polyfillGlobal} from 'react-native/Libraries/Utilities/PolyfillFunctions';
polyfillGlobal('URL', () => require('whatwg-url').URL);
```

## 6. Install Pods

Do this in the root directory, or if you prefer run `cd ios && pod install && cd ..` in the root directory

```
npx pod-install
```

## 7. Run postinstall script

<!--DOCUSAURUS_CODE_TABS-->
<!--Yarn-->

```
yarn postinstall
```
<!--NPM-->
```
npm run postinstall
```

<!--END_DOCUSAURUS_CODE_TABS-->

## 8. Proguard (Android)

Add the following line in `android/app/proguard-rules.pro`

```
-keep public class com.horcrux.svg.** {*;}
```

## 9. Initialize auth

In order to initialize the Matrix SDK to detect auth, you'll need to put this code snippet at the top level of your app, when it starts up, and before any other code is called.

*** This is not needed if you're doing token authentication (like with SSO) - only needed for an actual auth flow ***

```js
import { matrix } from '@rn-matrix/core';
...
matrix.initAuth()
```
