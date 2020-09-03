import 'react-native-gesture-handler';
import 'node-libs-react-native/globals';

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';

import {polyfillGlobal} from 'react-native/Libraries/Utilities/PolyfillFunctions';
polyfillGlobal('URL', () => require('whatwg-url').URL);

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
