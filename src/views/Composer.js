import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  InputAccessoryView,
} from 'react-native';
import { useObservableState } from 'observable-hooks';

export default function Composer({ room }) {
  const [value, setValue] = useState('');

  if (!room) {
    return (
      <View style={styles.wrapper}>
        <Text style={{ marginLeft: 12 }}>No room specified.</Text>
      </View>
    );
  }

  const roomName = useObservableState(room.name$);

  const handleSend = () => {
    room.sendMessage(value, 'm.text');
    setValue('');
  };

  return (
    <InputAccessoryView>
      <View style={styles.wrapper}>
        <TextInput
          style={styles.input}
          multiline
          placeholder={`Message ${roomName}...`}
          value={value}
          onChangeText={setValue}
        />
        <TouchableHighlight
          disabled={value.length === 0}
          onPress={handleSend}
          underlayColor="#ddd"
          style={styles.sendButton}>
          <Text style={[styles.sendText, value.length === 0 ? { color: '#888' } : {}]}>Send</Text>
        </TouchableHighlight>
      </View>
    </InputAccessoryView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 45,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    padding: 6,
  },
  input: {
    padding: 12,
    paddingLeft: 6,
    maxHeight: 200,
    flex: 1,
    fontSize: 14,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sendText: {
    color: '#2d5bc4',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
