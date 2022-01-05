import React from 'react';
import { matrix, Message } from '@rn-matrix/core';
import EventMessage from './messageTypes/EventMessage';
import NoticeMessage from './messageTypes/NoticeMessage';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import ImageMessage from './messageTypes/ImageMessage';
import VideoMessage from './messageTypes/VideoMessage';
import TextMessage from './messageTypes/TextMessage';
import { TypingAnimation } from 'react-native-typing-animation';
import { useObservableState } from 'observable-hooks';
import Swipeable from 'react-native-swipeable';
import Icon from './Icon';
import ReadReceipts from './ReadReceipts';
import FileMessage from './messageTypes/FileMessage';
import Reactions from './Reactions';
import { BehaviorSubject } from 'rxjs';

// const debug = require('debug')('rnm:scenes:chat:message:MessageItem')

function isSameSender(messageA, messageB) {
  if (
    !messageA ||
    !messageB ||
    !Message.isBubbleMessage(messageA) ||
    !Message.isBubbleMessage(messageB) ||
    messageA.sender.id !== messageB.sender.id
  ) {
    return false;
  }
  return true;
}

export default function MessageItem({
  roomId,
  messageId,
  prevMessageId,
  nextMessageId,
  ...otherProps
}) {
  if (messageId === 'loading') {
    return <ActivityIndicator />;
  }
  if (messageId === 'typing') {
    if (otherProps.renderTypingIndicator) {
      return otherProps.renderTypingIndicator();
    }
    return (
      <View style={{ marginLeft: 24, marginTop: 10, marginBottom: 30 }}>
        <TypingAnimation dotColor="#ccc" dotAmplitude={2} dotRadius={4} dotMargin={8} />
      </View>
    );
  }

  const message = matrix.getMessageById(messageId, roomId);

  if (!message.type$) return null;

  const prevMessage =
    prevMessageId && prevMessageId !== 'loading'
      ? matrix.getMessageById(prevMessageId, roomId)
      : null;
  const nextMessage =
    nextMessageId && nextMessageId !== 'typing'
      ? matrix.getMessageById(nextMessageId, roomId)
      : null;
  const prevSame = isSameSender(message, prevMessage);
  const nextSame = isSameSender(message, nextMessage);
  const props = { ...otherProps, message, prevSame, nextSame };

  const messageType = useObservableState(message.type$);

  if (message.redacted$.getValue()) {
    return <EventMessage {...props} />;
  }

  if (Message.isTextMessage(messageType)) {
    return <TextMessage {...props} />;
  }
  if (Message.isImageMessage(messageType)) {
    return <ImageMessage {...props} />;
  }
  // if (Message.isVideoMessage(messageType)) {
  //   return <VideoMessage {...props} />;
  // }
  if (Message.isVideoMessage(messageType) || Message.isFileMessage(messageType)) {
    return <FileMessage {...props} />;
  }
  if (Message.isNoticeMessage(messageType)) {
    return <NoticeMessage {...props} />;
  }
  return <EventMessage {...props} />;
}

export function BubbleWrapper({
  children,
  isMe,
  status,
  onSwipe = null,
  message,
  showReactions = false,
}) {
  const reactions = useObservableState(message.reactions$);
  const receipts = useObservableState(message.receipts$);

  const myUser = matrix.getMyUser();

  const toggleReaction = (key) => {
    message.toggleReaction(key);
  };

  const rightButtons = [
    <View style={{ height: '100%', justifyContent: 'center' }}>
      <Icon name="reply" size={30} color="#666" />
    </View>,
  ];

  const Wrapper = ({ children }) =>
    !onSwipe ? (
      children
    ) : (
      <Swipeable
        rightButtons={rightButtons}
        rightActionActivationDistance={10}
        rightButtonWidth={0}
        onRightActionRelease={onSwipe}>
        {children}
      </Swipeable>
    );

  return (
    <Wrapper>
      <View style={{ marginHorizontal: 12 }}>
        <View
          style={{
            flexDirection: isMe ? 'row-reverse' : 'row',
            alignItems: 'center',
          }}>
          {children}
          {receipts && isMe && <ReadReceipts isMe={isMe} receipts={receipts} />}
        </View>
        {reactions && showReactions && (
          <Reactions
            reactions={reactions}
            toggleReaction={toggleReaction}
            myUserId={myUser.id}
            isMyBubble={isMe}
          />
        )}
      </View>
    </Wrapper>
  );
}

export function SenderText({ isMe, children }) {
  return (
    <Text
      style={{
        fontSize: 14,
        fontWeight: '400',
        marginHorizontal: 22,
        marginTop: 8,
        opacity: 0.6,
        ...(isMe ? { textAlign: 'right' } : {}),
      }}>
      {children}
    </Text>
  );
}
