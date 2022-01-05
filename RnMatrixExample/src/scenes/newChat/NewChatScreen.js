import React, { useRef } from 'react';
import {Text, View} from 'react-native';

export default function NewChatScreen() {
  const inputToolbarRef = useRef(null);

  return (
    <View style={{flex: 1}}>
      <Text>new</Text>
    </View>
  );
}
