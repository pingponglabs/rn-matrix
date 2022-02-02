import { useObservableState } from 'observable-hooks';
import React from 'react';

import { View, Image, TouchableOpacity,useColorScheme, Text } from 'react-native';
import { BubbleWrapper, SenderText } from '../MessageItem';
import { matrix } from '@rn-matrix/core';
import Moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { DateFormate, TimeFormate } from '@rn-matrix/ui/src/Helper/constantString';
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
  myBubbleStyle,
  otherBubbleStyle,
  textColor
}) {
  const theme = useColorScheme();
  const myUser = matrix.getMyUser();
  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);
  const reactions = useObservableState(message.reactions$);
  const messageType = useObservableState(message.type$);
  console.log('messageType....',messageType)
  // const receipts = message.receipts$ ? useObservableState(message.receipts$) : [];
  const status = useObservableState(message.status$);
  const isMe = myUser.id === message.sender.id;

  if (!content || !message || message.redacted$.getValue()) return null;
  const sharpBorderRadius = 5;
  const imageWrapperStyles = {
    marginTop: 20,
    marginBottom: nextSame ? 1 : 4,
    padding: 10,
    borderRadius: 16,
    ...(isMe ? {borderTopRightRadius: 5} : {borderTopLeftRadius: 5 }),
  };


  const imageStyles = {
    width: content?.thumb?.width || '50%',
    height: content?.thumb?.height,
    backgroundColor: messageType == 'm.sticker' ? 'transparent' : '#ccc',
    borderRadius: 8,
    // ...(isMe
    //   ? {
    //       ...(prevSame ? { borderTopRightRadius: sharpBorderRadius } : {}),
    //       ...(nextSame ? { borderBottomRightRadius: sharpBorderRadius } : {}),
    //     }
    //   : {
    //       ...(prevSame ? { borderTopLeftRadius: sharpBorderRadius } : {}),
    //       ...(nextSame ? { borderBottomLeftRadius: sharpBorderRadius } : {}),
    //     }),
  };

  const _onLongPress = () => onLongPress(message);
  const _onPress = () => onPress(message);
  const _onSwipe = () => onSwipe(message);

  const getDefaultGradientBackgroundColor = (me, pressed) => {
    return me
      ? myBubbleStyle().gradientColor
      : otherBubbleStyle().gradientColor
  };

  var dateTime = new Date(parseInt(message?.timestamp, 10));


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
          <LinearGradient colors={getDefaultGradientBackgroundColor(isMe, true)} style={imageWrapperStyles}>
            <Image
              source={{
                uri: content.thumb.url,
              }}
              style={imageStyles}
              // defaultSource={PlaceholderImage}
            />
            <Text style={{color: 'white', fontSize: 11, fontWeight: '700', position:'absolute', right:20, bottom:15 ,paddingVertical:5}}>{Moment(dateTime).format(TimeFormate)}</Text>
         
          </LinearGradient>
        </TouchableOpacity>
      </BubbleWrapper>

      {!prevSame && <SenderText isMe={isMe} color={textColor}>{Moment(dateTime).format(DateFormate).toLocaleUpperCase()}</SenderText>}
   
    </>
  );
}
