import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { screens } from './App';
import { MessageList } from '..';

export default function ChatScreen({ goToScreen, currentRoom }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header goToScreen={goToScreen} />
      <View style={{ flex: 1 }}>
        <MessageList room={currentRoom} />
      </View>
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
