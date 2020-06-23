import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { screens } from './App';
import { MessageList, Composer } from '..';

export default function ChatScreen({ goToScreen, currentRoom }) {
  return (
    <>
      <Header goToScreen={goToScreen} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <MessageList room={currentRoom} />
          <Composer room={currentRoom} />
        </View>
      </SafeAreaView>
    </>
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
