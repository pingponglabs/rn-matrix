/**
 * @format
 */
import './shim.js';

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
import matrix from './src/services/external';
import matrixSdk from 'matrix-js-sdk';

export {matrix, matrixSdk};

AppRegistry.registerComponent(appName, () => App);
