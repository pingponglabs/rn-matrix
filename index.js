/**
 * @format
 */

import './shim';

// Uncomment lines 7-14 to run Example App

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './ExampleApp/App';

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);

//********************************************************************************
// NPM Module
//********************************************************************************

import matrixSdk from 'matrix-js-sdk';
import external from './src/services/external';
import Composer from './src/views/Composer';
import MessageList from './src/views/MessageList';
import RoomList from './src/views/RoomList';

//********************************************************************************
// Exports
//********************************************************************************

const matrix = external;
export { matrix, matrixSdk, RoomList, MessageList, Composer };
