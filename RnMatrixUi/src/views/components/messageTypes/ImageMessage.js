import { useObservableState } from 'observable-hooks';
import React from 'react';

import { View, Image, TouchableOpacity } from 'react-native';
import { BubbleWrapper, SenderText } from '../MessageItem';
import { matrix } from '@rn-matrix/core';

// const debug = require('debug')('rnm:scene:chat:message:components:ImageMessage')

// const PlaceholderImage = require('../../../../assets/images/placeholder.png');

export default function ImageMessage({
  message,
  prevSame,
  nextSame,
  onPress,
  onLongPress,
  onSwipe,
  showReactions,
}) {
  const myUser = matrix.getMyUser();
  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);
  const reactions = useObservableState(message.reactions$);
  // const receipts = message.receipts$ ? useObservableState(message.receipts$) : [];
  const status = useObservableState(message.status$);
  const isMe = myUser.id === message.sender.id;

  if (!content || !message || message.redacted$.getValue()) return null;

  const imageWrapperStyles = {
    marginTop: 2,
    marginBottom: nextSame ? 1 : 4,
  };

  const sharpBorderRadius = 5;
  const imageStyles = {
    width: content.thumb.width,
    height: content.thumb.height,
    backgroundColor: '#ccc',
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

  const _onLongPress = () => onLongPress(message);
  const _onPress = () => onPress(message);
  const _onSwipe = () => onSwipe(message);

  return (
    <>
      <BubbleWrapper
        isMe={isMe}
        status={status}
        onSwipe={onSwipe ? _onSwipe : null}
        message={message}
        showReactions={showReactions}>
        <TouchableOpacity
          onPress={onPress ? _onPress : null}
          onLongPress={onLongPress ? _onLongPress : null}
          delayLongPress={200}
          style={[reactions ? { alignSelf: isMe ? 'flex-end' : 'flex-start' } : {}]}>
          <View style={imageWrapperStyles}>
            <Image
              source={{
                uri: content.thumb.url,
              }}
              style={imageStyles}
              // defaultSource={PlaceholderImage}
            />
          </View>
        </TouchableOpacity>
      </BubbleWrapper>

      {!prevSame && <SenderText isMe={isMe}>{senderName}</SenderText>}
    </>
  );
}
