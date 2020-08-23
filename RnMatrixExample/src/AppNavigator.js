import {createStackNavigator} from '@react-navigation/stack';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {View, Text, Pressable} from 'react-native';

import ChatListScreen from './scenes/chatList/ChatListScreen';
import ChatScreen from './scenes/chat/ChatScreen';
import LoginScreen from './scenes/auth/LoginScreen';

// import auth from '../../scenes/auth/authService'
// import matrix from '../matrix/matrixService'

import {matrix} from '@rn-matrix/core';

// const debug = require('debug')('ditto:services:navigation:RootNavigator')

const Stack = createStackNavigator();

export default function AppNavigator() {
  const authLoaded = useObservableState(matrix.authIsLoaded$());
  const authLoggedIn = useObservableState(matrix.isLoggedIn$());
  const matrixReady = useObservableState(matrix.isReady$());

  console.log(
    'auth loaded',
    authLoaded,
    'logged in',
    authLoggedIn,
    'matrix ready ',
    matrixReady,
  );

  if (!authLoaded || (authLoggedIn && !matrixReady)) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>splash</Text>
      </View>
    );
  } else if (authLoggedIn) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ChatList"
          component={ChatListScreen}
          options={{
            title: 'Chats',
            headerLeft: () => (
              <Pressable
                style={({pressed}) => ({
                  marginLeft: 6,
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: pressed ? 'lightgray' : '#fff',
                })}>
                <Text style={{fontWeight: 'bold', color: 'dodgerblue'}}>
                  LOGOUT
                </Text>
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{headerBackTitle: 'Back'}}
        />
        {/* <Stack.Screen name="Main" component={MainScreens} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="NewChat" component={NewChatScreens} /> */}
      </Stack.Navigator>
    );
  } else {
    return (
      <Stack.Navigator headerMode="none">
        {/* <Stack.Screen name='Landing' component={LandingScreen} /> */}
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }
}
