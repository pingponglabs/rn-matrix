import React from 'react';
import {Pressable, View, Text} from 'react-native';

const emojis = ['👍', '❤️', '🎉', '😂', '😢'];

export default function EmojiButtons({
  message,
  setActionSheetVisible,
  setSelectedMessage,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
      }}>
      {emojis.map((e) => (
        <EmojiButton
          key={e}
          onPress={() => {
            message.toggleReaction(e);
            setActionSheetVisible(false);
            setSelectedMessage(null);
          }}>
          <Text style={{fontSize: 24}}>{e}</Text>
        </EmojiButton>
      ))}
    </View>
  );
}

function EmojiButton({children, onPress}) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => ({
        backgroundColor: '#eee',
        borderRadius: 80,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        opacity: pressed ? 0.5 : 1,
      })}>
      {children}
    </Pressable>
  );
}
