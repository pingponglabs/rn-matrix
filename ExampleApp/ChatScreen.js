import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { screens } from './App';
import { MessageList, Composer } from '..';

export default function ChatScreen({ goToScreen, currentRoom }) {
  return (
    <SafeAreaView style={{ justifyContent: 'flex-end' }}>
      <Header goToScreen={goToScreen} />
      <MessageList room={currentRoom} showReactions onPress={() => {}} />
      <Composer room={currentRoom} />
    </SafeAreaView>
  );
}

const Header = ({ goToScreen }) => (
  <View
    style={{
      height: 50,
      backgroundColor: '#ddd',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    }}>
    <TouchableOpacity onPress={() => goToScreen(screens.ROOM_LIST)} style={{ padding: 12 }}>
      <Text>{'<'} Go Back</Text>
    </TouchableOpacity>
    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Room Name</Text>
    <TouchableOpacity disabled style={{ padding: 12 }}>
      <Text style={{ opacity: 0 }}>{'<'} Back</Text>
    </TouchableOpacity>
  </View>
);
