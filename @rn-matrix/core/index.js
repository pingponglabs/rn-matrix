/**
 * @format
 */
// import {AppRegistry} from 'react-native';
// import {name as appName} from './app.json';
// import App from './App';
// AppRegistry.registerComponent(appName, () => App);

import matrix from '@rn-matrix/core/src/services/external';
import Chat from '@rn-matrix/core/src/classes/Chat';
import Message from '@rn-matrix/core/src/classes/Message';
import matrixSdk from 'matrix-js-sdk';

export { matrix, matrixSdk, Chat, Message };
