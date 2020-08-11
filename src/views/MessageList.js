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
import Message from '../classes/Message';
import Composer from './Composer';

type Props = {
  room: Chat,
  keyboardOffset: number,
  showReactions?: boolean,
  enableComposer?: boolean,
  isEditing?: Boolean,
  isReplying?: Boolean,
  onEndEdit?: Function,
  enableReplies?: Boolean,
  onCancelReply?: Function,
  selectedMessage?: Message,
  onPress?: Function | null,
  onLongPress?: Function | null,
  onSwipe?: Function | null,
  renderTypingIndicator?: Function | null,
  flatListProps?: FlatListProps,
};

export default function MessageList({
  room,
  keyboardOffset,
  showReactions = false,
  enableComposer = false,
  isEditing = false,
  isReplying = false,
  onEndEdit = null,
  enableReplies = false,
  onCancelReply = () => {},
  selectedMessage = null,
  onPress = null,
  onLongPress = null,
  onSwipe = null,
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
        onSwipe={onSwipe}
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
    <Wrapper offset={keyboardOffset}>
      <FlatList
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        inverted
        data={timeline}
        renderItem={renderMessageItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        keyExtractor={item => item}
        style={{ paddingTop: 6 }}
        {...flatListProps}
      />
      {enableComposer && (
        <Composer
          room={room}
          isEditing={isEditing}
          isReplying={isReplying}
          selectedMessage={selectedMessage}
          onEndEdit={onEndEdit}
          onCancelReply={onCancelReply}
          enableReplies={enableReplies}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = ({ offset, children }) => {
  const style = {
    flex: 1,
  };
  return Platform.OS === 'ios' ? (
    <SafeAreaView style={style}>
      <KeyboardAvoidingView style={style} behavior="padding" keyboardVerticalOffset={offset}>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  ) : (
    <View style={style}>{children}</View>
  );
};
