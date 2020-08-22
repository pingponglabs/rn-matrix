import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import {RoomList} from '@rn-matrix/ui';

export default function ChatListScreen() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <RoomList />
    </SafeAreaView>
  );
}
