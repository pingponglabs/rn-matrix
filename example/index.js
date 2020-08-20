/**
 * @format
 */
import './shim.js';

import {AppRegistry} from 'react-native';
import Core from './CoreApp';
import Ui from './UiApp';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Core);
