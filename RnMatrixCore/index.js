/**
 * @format
 */
// import './shim.js';

// import {AppRegistry} from 'react-native';
// import {name as appName} from './app.json';
// import App from './App';
// AppRegistry.registerComponent(appName, () => App);

import matrix from './src/services/external';
import Chat from './src/classes/Chat';
import Message from './src/classes/Message';
import matrixSdk from 'matrix-js-sdk';

// import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';
// polyfillGlobal('URL', () => require('whatwg-url').URL);

export { matrix, matrixSdk, Chat, Message };
