/**
 * @format
 */
// import {AppRegistry} from 'react-native';
// import {name as appName} from './app.json';
// import App from './App';
// AppRegistry.registerComponent(appName, () => App);

import matrix from './src/services/external';
import Chat from './src/classes/Chat';
import Message from './src/classes/Message';
import matrixSdk from 'matrix-js-sdk';

export { matrix, matrixSdk, Chat, Message };
