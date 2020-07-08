import React from 'react';
import { RoomList, matrix } from '..';
import { screens } from './App';
import { View, TouchableOpacity } from 'react-native';

export default function RoomListScreen({ goToScreen, setCurrentRoom }) {
  const handleOnRowPress = room => {
    setCurrentRoom(room);
    goToScreen(screens.CHAT);
  };

  const createChat = async () => {
    const room = await matrix.createRoom();
    console.log(room);
  };

  return (
    <>
      <View
        style={{
          width: '100%',
          height: 50,
          backgroundColor: 'pink',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={createChat}
          style={{ backgroundColor: 'blue', width: 200, height: 25 }}
        />
      </View>
      <RoomList onRowPress={handleOnRowPress} />
    </>
  );
}
