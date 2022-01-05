import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/AppNavigator';
import {matrix} from '@rn-matrix/core';

const debug = require('debug');
debug.enable('rnm:*');

matrix.initAuth();

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
