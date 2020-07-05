/**
 * @format
 */

// Uncomment lines 7-14 to run Example App

// import { AppRegistry } from 'react-native';
// import { name as appName } from './app.json';
// import App from './ExampleApp/App';

// const debug = require('debug');
// debug.enable('rnm:*');

// console.disableYellowBox = true;

// AppRegistry.registerComponent(appName, () => App);

//********************************************************************************
// NPM Module
//********************************************************************************

import matrixSdk from 'matrix-js-sdk';
import matrix from './src/services/matrix';
import RoomList from './src/views/RoomList';
import MessageList from './src/views/MessageList';
import Composer from './src/views/Composer';

//********************************************************************************
// Exports
//********************************************************************************

export { matrix, matrixSdk, RoomList, MessageList, Composer };
