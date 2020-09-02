import 'react-native-gesture-handler';
import 'node-libs-react-native/globals';

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
