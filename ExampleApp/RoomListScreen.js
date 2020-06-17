import React from 'react';
import { RoomList } from '..';
import { screens } from './App';

export default function RoomListScreen({ goToScreen, setCurrentRoom }) {
  const handleOnRowPress = room => {
    setCurrentRoom(room);
    goToScreen(screens.CHAT);
  };

  return <RoomList onRowPress={handleOnRowPress} />;
}
