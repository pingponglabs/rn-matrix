import React, { useState, useEffect } from 'react';
import { useObservableState } from 'observable-hooks';
import messageService from '../services/message';
import { FlatList, SafeAreaView, KeyboardAvoidingView, View } from 'react-native';
import MessageItem from './components/MessageItem';
import Chat from '../classes/Chat';

type Props = {
  room: Chat,
  onPress: Function | null,
  onLongPress: Function | null,
  renderTypingIndicator: Function | null,
  flatListProps?: FlatListProps,
};

export default function MessageList({
  room,
  onPress = null,
  onLongPress = null,
  renderTypingIndicator = null,
  flatListProps = {},
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const messageList = useObservableState(room.messages$);
  const typing = useObservableState(room.typing$);
  const atStart = useObservableState(room.atStart$);
  const [timeline, setTimeline] = useState(messageList);

  const handleEndReached = async () => {
    if (!atStart && !isLoading) {
      setIsLoading(true);
      await room.fetchPreviousMessages();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // mark as read
    room.sendReadReceipt();

    // We put loading and typing indicator into the Timeline to have better
    // visual effects when we swipe to top or bottom
    if (messageList) {
      const tempTimeline = [...messageList];
      if (isLoading) tempTimeline.push('loading');
      if (typing.length > 0) tempTimeline.unshift('typing');
      setTimeline(tempTimeline);
    }
  }, [isLoading, messageList, room, typing]);

  return (
    <KeyboardAvoidingView enabled behavior="position" keyboardVerticalOffset={45}>
      <FlatList
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        inverted
        data={timeline}
        renderItem={({ item: messageId, index }) => (
          <MessageItem
            roomId={room.id}
            messageId={messageId}
            prevMessageId={messageList[index + 1] ? messageList[index + 1] : null}
            nextMessageId={messageList[index - 1] ? messageList[index - 1] : null}
            onPress={onPress}
            onLongPress={onLongPress}
            renderTypingIndicator={renderTypingIndicator}
          />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        keyExtractor={item => item}
        style={{ marginBottom: 50 }}
        ListHeaderComponent={<View style={{ height: 6 }} />}
        {...flatListProps}
      />
    </KeyboardAvoidingView>
  );
}
