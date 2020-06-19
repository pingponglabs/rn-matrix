import { useObservableState } from 'observable-hooks';
import React from 'react';

import users from '../../../services/user';
import { View, Image } from 'react-native';
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
