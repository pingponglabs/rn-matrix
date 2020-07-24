/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { matrix } from '../index';
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
        return <RoomListScreen goToScreen={setCurrentScreen} setCurrentRoom={setCurrentRoom} />;
      case screens.CHAT:
        return <ChatScreen goToScreen={setCurrentScreen} currentRoom={currentRoom} />;
      default:
        null;
    }
  };

  useEffect(() => {
    matrix.createClient('http://localhost:8008', accessToken, '@phako4in6m:localhost', 'NLNCQYTFUD');
    matrix.start(true);
  }, []);

  return <SafeAreaView style={{ flex: 1 }}>{renderScreen()}</SafeAreaView>;
}

const accessToken =
  'MDAxN2xvY2F0aW9uIGxvY2FsaG9zdAowMDEzaWRlbnRpZmllciBrZXkKMDAxMGNpZCBnZW4gPSAxCjAwMjhjaWQgdXNlcl9pZCA9IEBwaGFrbzRpbjZtOmxvY2FsaG9zdAowMDE2Y2lkIHR5cGUgPSBhY2Nlc3MKMDAyMWNpZCBub25jZSA9IFptV01JWiYmRU9JeVdpRmEKMDAyZnNpZ25hdHVyZSAlxhHpXhTi8wHyPuoGbZmaUnQYBVP1vgszR5gB9-GGvAo';
