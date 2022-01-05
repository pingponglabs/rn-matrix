import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import {RoomList} from '@rn-matrix/ui';

export default function ChatListScreen({navigation}) {
  const onRowPress = (room) => {
    navigation.navigate('Chat', {room});
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <RoomList onRowPress={onRowPress} />
    </SafeAreaView>
  );
}
