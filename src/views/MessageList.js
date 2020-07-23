import React, { useState, useEffect } from 'react';
import { useObservableState } from 'observable-hooks';
import {
  FlatList,
  FlatListProps,
  KeyboardAvoidingView,
  View,
  Platform,
  SafeAreaView,
} from 'react-native';
import MessageItem from './components/MessageItem';
import Chat from '../classes/Chat';
import Composer from './Composer';

type Props = {
  room: Chat,
  showReactions?: boolean,
  enableComposer?: boolean,
  onPress?: Function | null,
  onLongPress?: Function | null,
  renderTypingIndicator?: Function | null,
  flatListProps?: FlatListProps,
};

export default function MessageList({
  room,
  showReactions = false,
  enableComposer = false,
  onPress = null,
  onLongPress = null,
  renderTypingIndicator = null,
  flatListProps = null,
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

  const renderMessageItem = ({ item: messageId, index }) => {
    return (
      <MessageItem
        roomId={room.id}
        messageId={messageId}
        prevMessageId={messageList[index + 1] ? messageList[index + 1] : null}
        nextMessageId={messageList[index - 1] ? messageList[index - 1] : null}
        onPress={onPress}
        onLongPress={onLongPress}
        renderTypingIndicator={renderTypingIndicator}
        showReactions={showReactions}
      />
    );
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
    <SafeAreaView style={{ justifyContent: 'flex-end' }}>
      <KeyboardAvoidingView enabled={Platform.OS === 'ios'} behavior="position">
        <FlatList
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          inverted
          data={timeline}
          renderItem={renderMessageItem}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          keyExtractor={item => item}
          // This margin is only needed on ios because ios uses "InputAccessoryView"
          // which is not supported on Android
          style={[Platform.OS === 'ios' ? { marginBottom: 45 } : {}, { height: '100%' }]}
          {...flatListProps}
        />
      </KeyboardAvoidingView>
      {enableComposer && <Composer room={room} />}
    </SafeAreaView>
  );
}
