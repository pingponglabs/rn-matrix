/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {matrix} from '../../index';
import ChatScreen from './ChatScreen';
import RoomListScreen from './RoomListScreen';

const debug = require('debug');
debug.enable('rnm:*');

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
      case screens.ROOM_LIST:
        return (
          <RoomListScreen
            goToScreen={setCurrentScreen}
            setCurrentRoom={setCurrentRoom}
          />
        );
      case screens.CHAT:
        return (
          <ChatScreen goToScreen={setCurrentScreen} currentRoom={currentRoom} />
        );
      default:
        null;
    }
  };

  useEffect(() => {
    matrix.createClient(
      'https://matrix.ditto.chat',
      accessToken,
      '@test:ditto.chat',
      deviceId,
    );
    matrix.start(true);
  }, []);

  return <SafeAreaView style={{flex: 1}}>{renderScreen()}</SafeAreaView>;
}

const accessToken =
  'MDAxOGxvY2F0aW9uIGRpdHRvLmNoYXQKMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDIzY2lkIHVzZXJfaWQgPSBAdGVzdDpkaXR0by5jaGF0CjAwMTZjaWQgdHlwZSA9IGFjY2VzcwowMDIxY2lkIG5vbmNlID0gLVZuX3RZVjJpRk80V2QsKwowMDJmc2lnbmF0dXJlIGYlwrKiStuijF4uaQ9KJStxRDueNHpAT3b74ZaZI-n_Cg';
const deviceId = 'EBIPBHNMDO';
