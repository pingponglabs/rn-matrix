import React from 'react';
import {SafeAreaView, Text, useColorScheme} from 'react-native';
import {RoomList} from '@rn-matrix/ui';
import { colors } from '../../constants/colors';

export default function ChatListScreen({navigation}) {
  const theme = useColorScheme();
 
  const onRowPress = (room) => {
    navigation.navigate('Chat', {room});
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme == 'dark' ? colors.dark.Background : colors.light.Background}}>
      <RoomList 
      onlineTextColor={ theme === 'dark' ? '#7C7C7C' : '#202020'}
      textColor={theme === 'dark' ? "#fff" : "#000"}
      onRowPress={onRowPress} 
      />
    </SafeAreaView>
  );
}
