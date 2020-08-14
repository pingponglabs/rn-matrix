import React from 'react';
import Message from '../../classes/Message';
import messages from '../../services/message';
import EventMessage from './messageTypes/EventMessage';
import NoticeMessage from './messageTypes/NoticeMessage';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import ImageMessage from './messageTypes/ImageMessage';
import TextMessage from './messageTypes/TextMessage';
import { TypingAnimation } from 'react-native-typing-animation';
import { useObservableState } from 'observable-hooks';
import Swipeable from 'react-native-swipeable';
import Icon from './Icon';
import ReadReceipts from './ReadReceipts';

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

  const message = messages.getMessageById(messageId, roomId);

  const prevMessage =
    prevMessageId && prevMessageId !== 'loading'
      ? messages.getMessageById(prevMessageId, roomId)
      : null;
  const nextMessage =
    nextMessageId && nextMessageId !== 'typing'
      ? messages.getMessageById(nextMessageId, roomId)
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
  if (Message.isNoticeMessage(messageType)) {
    return <NoticeMessage {...props} />;
  }
  return <EventMessage {...props} />;
}

export function BubbleWrapper({ children, isMe, status, onSwipe = null, receipts = [] }) {
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
      <View
        style={{
          marginHorizontal: 12,
          flexDirection: isMe ? 'row-reverse' : 'row',
          alignItems: 'center',
        }}>
        {children}
        <ReadReceipts isMe={isMe} receipts={receipts} />
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
