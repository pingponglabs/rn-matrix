/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import { matrix } from '../index';

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import EnterTokenScreen from './EnterTokenScreen';
import RoomListScreen from './RoomListScreen';
import ChatScreen from './ChatScreen';
import { useObservableState } from 'observable-hooks';

// console.log(matrix);

export const screens = {
  TOKEN: 0,
  ROOM_LIST: 1,
  CHAT: 2,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(screens.ROOM_LIST);
  const [currentRoom, setCurrentRoom] = useState(null);

  const renderScreen = () => {
    switch (currentScreen) {
      // case screens.TOKEN:
      //   return <EnterTokenScreen />;
      case screens.ROOM_LIST:
        return <RoomListScreen goToScreen={setCurrentScreen} setCurrentRoom={setCurrentRoom} />;
      case screens.CHAT:
        return <ChatScreen goToScreen={setCurrentScreen} currentRoom={currentRoom} />;
      default:
        null;
    }
  };

  useEffect(() => {
    matrix.createClient('https://matrix.ditto.chat', accessToken, '@annie:ditto.chat');
    matrix.start();
  }, []);

  return <SafeAreaView style={{ flex: 1 }}>{renderScreen()}</SafeAreaView>;
}

const accessToken =
  'MDAxOGxvY2F0aW9uIGRpdHRvLmNoYXQKMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDI0Y2lkIHVzZXJfaWQgPSBAYW5uaWU6ZGl0dG8uY2hhdAowMDE2Y2lkIHR5cGUgPSBhY2Nlc3MKMDAyMWNpZCBub25jZSA9IEYzRlMyVS5KXzRJdW5DO0sKMDAyZnNpZ25hdHVyZSDIV6D5eRHxXYqwHFaBmak3Z782c7ccKZpmgZl38CJpKgo';
