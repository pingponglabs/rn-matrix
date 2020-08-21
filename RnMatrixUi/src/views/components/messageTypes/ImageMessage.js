import {useObservableState} from 'observable-hooks';
import React from 'react';

import {View, Image, Pressable} from 'react-native';
import {BubbleWrapper, SenderText} from '../MessageItem';
import {matrix} from '@rn-matrix/core';

// const debug = require('debug')('rnm:scene:chat:message:components:ImageMessage')

// const PlaceholderImage = require('../../../../assets/images/placeholder.png');

export default function ImageMessage({
  message,
  prevSame,
  nextSame,
  onPress,
  onLongPress,
  onSwipe,
}) {
  const myUser = matrix.getMyUser();
  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);
  const receipts = message.receipts$
    ? useObservableState(message.receipts$)
    : [];
  const status = useObservableState(message.status$);
  const isMe = myUser.id === message.sender.id;

  if (!content || message.redacted$.getValue()) return null;

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
          ...(prevSame ? {borderTopRightRadius: sharpBorderRadius} : {}),
          ...(nextSame ? {borderBottomRightRadius: sharpBorderRadius} : {}),
        }
      : {
          ...(prevSame ? {borderTopLeftRadius: sharpBorderRadius} : {}),
          ...(nextSame ? {borderBottomLeftRadius: sharpBorderRadius} : {}),
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
        receipts={receipts}>
        <Pressable
          // {...props}
          // underlayColor={isMe ? colors.blue600 : colors.gray400}
          onPress={onPress ? _onPress : null}
          onLongPress={onLongPress ? _onLongPress : null}
          delayLongPress={200}
          //       style={[
          //         bubbleStyles(isMe, prevSame, nextSame),
          //         { backgroundColor: isMe ? colors.blue400 : colors.gray300 },
          //         reactions ? { alignSelf: isMe ? 'flex-end' : 'flex-start' } : {},
          // ]}
          style={({pressed}) => ({
            opacity: pressed ? 0.75 : 1,
          })}>
          <View style={imageWrapperStyles}>
            <Image
              source={{
                uri: content.thumb.url,
              }}
              style={imageStyles}
              // defaultSource={PlaceholderImage}
            />
          </View>
        </Pressable>
      </BubbleWrapper>

      {!prevSame && <SenderText isMe={isMe}>{senderName}</SenderText>}
    </>
  );
}
