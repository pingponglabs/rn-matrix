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
import external from './src/services/external';
import RoomList from './src/views/RoomList';
import MessageList from './src/views/MessageList';
import Composer from './src/views/Composer';

//********************************************************************************
// Exports
//********************************************************************************

const matrix = external;
export { matrix, matrixSdk, RoomList, MessageList, Composer };
