import { useObservableState } from 'observable-hooks';
import React from 'react';
// import styled from 'styled-components/native';

// import { getNameColor } from '../../../../utilities';
// import users from '../../../user/userService';
// import BubbleWrapper from './BubbleWrapper';
// import SenderText from './SenderText';

import users from '../../../services/user';
import { StyleSheet, View, Image } from 'react-native';
import { BubbleWrapper, SenderText } from '../MessageItem';

// const debug = require('debug')('ditto:scene:chat:message:components:ImageMessage')

// const PlaceholderImage = require('../../../../assets/images/placeholder.png');

export default function ImageMessage({ message, prevSame, nextSame }) {
  const myUser = users.getMyUser();
  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);
  const status = useObservableState(message.status$);
  const isMe = myUser.id === message.sender.id;

  if (!content) return null;

  const imageWrapperStyles = {
    marginTop: 2,
    marginBottom: nextSame ? 1 : 4,
  };

  const sharpBorderRadius = 5;
  const imageStyles = {
    width: content.thumb.width,
    height: content.thumb.height,
    borderRadius: 20,
    ...(isMe
      ? {
          ...(prevSame ? { borderTopRightRadius: sharpBorderRadius } : {}),
          ...(nextSame ? { borderBottomRightRadius: sharpBorderRadius } : {}),
        }
      : {
          ...(prevSame ? { borderTopLeftRadius: sharpBorderRadius } : {}),
          ...(nextSame ? { borderBottomLeftRadius: sharpBorderRadius } : {}),
        }),
  };

  return (
    <>
      <BubbleWrapper isMe={isMe} status={status}>
        <View style={imageWrapperStyles}>
          <Image
            source={{ uri: content.thumb.url }}
            style={imageStyles}
            // defaultSource={PlaceholderImage}
          />
        </View>
      </BubbleWrapper>

      {!prevSame && <SenderText isMe={isMe}>{senderName}</SenderText>}
    </>
  );
}

const sharpBorderRadius = 5;
// const ImageWrapper = styled.View`
//   margin-top: 2;
//   margin-bottom: ${({ nextSame }) => (nextSame ? 1 : 4)};
// `;

// const StyledImage = styled.Image`
//   height: ${({ height }) => height};
//   width: ${({ width }) => width};
//   border-radius: 20;

//   ${({ isMe, prevSame, nextSame }) =>
//     isMe
//       ? `
//     ${prevSame ? `border-top-right-radius: ${sharpBorderRadius};` : ''}
//     ${nextSame ? `border-bottom-right-radius: ${sharpBorderRadius};` : ''}
//   `
//       : `
//     ${prevSame ? `border-top-left-radius: ${sharpBorderRadius};` : ''}
//     ${nextSame ? `border-bottom-left-radius: ${sharpBorderRadius};` : ''}
//   `}
// `;
