import React, { useState, useEffect } from 'react';
import { useObservableState } from 'observable-hooks';
import {
  FlatList,
  FlatListProps,
  KeyboardAvoidingView,
  View,
  Platform,
  SafeAreaView,
  useColorScheme
} from 'react-native';
import MessageItem from './components/MessageItem';
import { Chat, matrix, Message } from '@rn-matrix/core';
import Composer from './Composer';
import { colors } from '../constants';
import ChatHeader from '@rn-matrix/ui/src/views/components/ChatHeader';

type Props = {
  room: Chat,
  keyboardOffset?: number,
  showReactions?: boolean,
  enableComposer?: boolean,
  isEditing?: Boolean,
  isReplying?: Boolean,
  onEndEdit?: Function,
  enableReplies?: Boolean,
  onCancelReply?: Function,
  selectedMessage?: Message,
  onMorepress?:Function | null,
  onPress?: Function | null,
  onLongPress?: Function | null,
  onSwipe?: Function | null,
  renderTypingIndicator?: Function | null,
  flatListProps?: FlatListProps,
};

export default function MessageList({
  room,
  keyboardOffset = 0,
  showReactions = false,
  enableComposer = false,
  isEditing = false,
  isReplying = false,
  onEndEdit = null,
  enableReplies = false,
  onCancelReply = () => { },
  selectedMessage = null,
  onPress = null,
  onLongPress = null,
  onSwipe = null,
  renderTypingIndicator = null,
  flatListProps = null,
  composerStyle = {},
  myBubbleStyle = () => { },
  otherBubbleStyle = () => { },
  onMorepress = () => {},
  myTextColor = colors.white,
  otherTextColor = colors.gray400,
  accentColor = 'dodgerblue',
  textColor = colors.gray500,
  fontWeight,
  onBackPress,
  backgroundHeaderColor,
}: Props) {
  const theme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const messageList = useObservableState(room.messages$);
  const typing = useObservableState(room.typing$);
  const atStart = useObservableState(room.atStart$);
  const [timeline, setTimeline] = useState(messageList);
  const [audioPlayid, setaudioPlayid] = useState(null);

  const styles = {
    myTextColor,
    otherTextColor,
    accentColor,
    textColor,
  };

  const handleEndReached = async () => {
    if (!atStart && !isLoading) {
      setIsLoading(true);
      await room.fetchPreviousMessages();
      setIsLoading(false);
    }
  };

  const onplayAudioPress = (id) => {
      setaudioPlayid(id)
  }

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
        styles={styles}
        myBubbleStyle={myBubbleStyle}
        otherBubbleStyle={otherBubbleStyle}
        accentColor={accentColor}
        textColor={textColor}
        onplayPress={(id) => onplayAudioPress(id)}
        audioPlayid={audioPlayid}
        fontWeight={fontWeight}        
      />
    );
  };

  useEffect(() => {
    // mark as read
    room.sendReadReceipt();

    if (messageList) {
      const tempTimeline = [...messageList];
      if (isLoading) tempTimeline.push('loading');
      if (typing.length > 0) tempTimeline.unshift('typing');
      setTimeline(tempTimeline);
    }
  }, [isLoading, messageList, room, typing]);

  return (
    <Wrapper offset={keyboardOffset}>
      <ChatHeader 
       room={room} 
       textColor={textColor}
       onBackPress={onBackPress}
       backgroundHeaderColor={backgroundHeaderColor}
       groupHeader={false}
      />
      <FlatList
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        inverted
        data={timeline}
        renderItem={renderMessageItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item}
        style={{ paddingTop: 6 }}
        styles={styles}
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
          composerStyle={composerStyle}
          accentColor={accentColor}
          onMorepress={onMorepress}
          textColor={textColor}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = ({ offset, children }) => {
  const theme = useColorScheme();

  const style = {
    flex: 1,
    backgroundColor: theme == 'dark' ? colors.darkbackground : colors.lightbackground
  };
  return Platform.OS === 'ios' ? (
      <KeyboardAvoidingView style={style} behavior="padding" keyboardVerticalOffset={offset}>
        {children}
      </KeyboardAvoidingView>
  ) : (
    <View style={style}>{children}</View>
  );
};
