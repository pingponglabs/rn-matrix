import {createStackNavigator} from '@react-navigation/stack';
import {useObservableState} from 'observable-hooks';
import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, ActivityIndicator} from 'react-native';

import ChatListScreen from './scenes/chatList/ChatListScreen';
import ChatScreen from './scenes/chat/ChatScreen';
import LoginScreen from './scenes/auth/LoginScreen';

import {matrix} from '@rn-matrix/core';
import NewChatScreen from './scenes/newChat/NewChatScreen';
import ChatMenuScreen from './scenes/chatMenu/ChatMenuScreen';

// const debug = require('debug')('ditto:services:navigation:RootNavigator')

const Stack = createStackNavigator();

export default function AppNavigator() {
  const authLoaded = useObservableState(matrix.authIsLoaded$());
  const authLoggedIn = useObservableState(matrix.isLoggedIn$());
  const matrixReady = useObservableState(matrix.isReady$());

  const [loadingView, setLoadingView] = useState(false);

  console.log(
    'auth loaded',
    authLoaded,
    'logged in',
    authLoggedIn,
    'matrix ready ',
    matrixReady,
  );

  useEffect(() => {
    if (authLoaded && authLoggedIn && !matrixReady) {
      setTimeout(() => setLoadingView(true), 10000);
    }
  }, [authLoaded, authLoggedIn, matrixReady]);

  if (!authLoaded || (authLoggedIn && !matrixReady)) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        {loadingView && (
          <>
            <Text style={{textAlign: 'center', maxWidth: 250, marginTop: 24}}>
              Logged in: {authLoggedIn ? 'YES\n' : 'NO\n'}
              Matrix ready: {matrixReady ? 'YES\n\n\n' : 'NO\n\n\n'}
              This seems to be taking a while... you can try logging out if you
              want.
            </Text>
            <Pressable
              onPress={() => {
                setLoadingView(false);
                matrix.logout();
              }}
              style={({pressed}) => ({
                backgroundColor: 'dodgerblue',
                marginTop: 24,
                borderRadius: 8,
                padding: 12,
                opacity: pressed ? 0.5 : 1,
              })}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>LOGOUT</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  } else if (authLoggedIn) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ChatList"
          component={ChatListScreen}
          options={({navigation}) => ({
            title: 'Chats',
            headerLeft: () => (
              <Pressable
                onPress={matrix.logout}
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
            headerRight: () => {
              return (
                <Pressable
                  onPress={() => navigation.navigate('NewChat')}
                  style={({pressed}) => ({
                    marginRight: 6,
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: pressed ? 'lightgray' : '#fff',
                  })}>
                  <Text style={{fontWeight: 'bold', color: 'dodgerblue'}}>
                    NEW
                  </Text>
                </Pressable>
              );
            },
          })}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({navigation, route}) => ({
            headerBackTitle: 'Back',
            title: route?.params?.room?.name$?.getValue() || 'Chat',
            headerRight: () => {
              return (
                <Pressable
                  onPress={() => navigation.navigate('ChatMenu')}
                  style={({pressed}) => ({
                    marginRight: 6,
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: pressed ? 'lightgray' : '#fff',
                  })}>
                  <Text style={{fontWeight: 'bold', color: 'dodgerblue'}}>
                    MENU
                  </Text>
                </Pressable>
              );
            },
          })}
        />
        <Stack.Screen
          name="NewChat"
          component={NewChatScreen}
          options={({route}) => ({
            headerBackTitle: 'Back',
            title: 'New Chat',
          })}
        />
        <Stack.Screen
          name="ChatMenu"
          component={ChatMenuScreen}
          options={({route}) => ({
            headerBackTitle: 'Back',
            title: 'Chat Settings',
          })}
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
