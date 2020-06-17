import React from 'react';
// import styled from 'styled-components/native';

// import EventMessage from './components/EventMessage'
// import ImageMessage from './components/ImageMessage'
// import NoticeMessage from './components/NoticeMessage'
// import TextMessage from './components/TextMessage'
// import TypingIndicator from './components/TypingIndicator'
// import Message from './Message'
// import messages from './messageService'

import Message from '../../classes/Message';
import { MessageStatus } from '../../classes/Message';
import messages from '../../services/message';
import EventMessage from './messageTypes/EventMessage';
import NoticeMessage from './messageTypes/NoticeMessage';
import { View, Text, ActivityIndicator } from 'react-native';
import ImageMessage from './messageTypes/ImageMessage';
import TextMessage from './messageTypes/TextMessage';

// const debug = require('debug')('ditto:scenes:chat:message:MessageItem')

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
    // return <Loading />;
    return <ActivityIndicator />;
  }
  if (messageId === 'typing') {
    // return <TypingIndicator />;
    return <Text>...</Text>;
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

  if (Message.isTextMessage(message.type)) {
    return <TextMessage onLongPress={() => {}} {...props} />;
  }
  if (Message.isImageMessage(message.type)) {
    return <ImageMessage {...props} />;
  }
  if (Message.isNoticeMessage(message.type)) {
    return <NoticeMessage {...props} />;
  }
  return <EventMessage {...props} />;
}

// const Loading = () => (
//   <Row>
//     <Spinner />
//   </Row>
// );

// const Row = styled.View`
//   flex-direction: row;
//   justify-content: center;
//   padding-top: 10;
// `;

export function BubbleWrapper({ children, isMe, status }) {
  return <View style={{ marginHorizontal: 13 }}>{children}</View>;
}

export function SenderText({ isMe, children }) {
  return (
    <Text
      style={{
        fontSize: 14,
        fontWeight: '400',
        marginHorizontal: 22,
        marginTop: 8,
        opacity: 0.8,
        ...(isMe ? { textAlign: 'right' } : {}),
      }}>
      {children}
    </Text>
  );
}

// const Wrapper = styled.View`
//   flex-direction: ${({ isMe }) => (isMe ? 'row-reverse' : 'row')};
//   margin-left: 13;
//   margin-right: 10%;
// `;
