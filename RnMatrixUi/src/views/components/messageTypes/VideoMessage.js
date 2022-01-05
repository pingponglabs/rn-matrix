import React, { useRef } from 'react';
import { View, Image } from 'react-native';
import { useObservableState } from 'observable-hooks';
import { BubbleWrapper, SenderText } from '../MessageItem';
import Video from 'react-native-video';
import { matrix } from '@rn-matrix/core';

export default function VideoMessage({
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
  const flatListRef = useRef();
  // const receipts = message.receipts$
  //   ? useObservableState(message.receipts$)
  //   : [];
  const status = useObservableState(message.status$);
  const isMe = myUser.id === message.sender.id;

  if (!content) return null;
  const _onLongPress = () => onLongPress(message);
  const _onPress = () => onPress(message);
  const _onSwipe = () => onSwipe(message);
  // const { width, height } = content?.thumb;
  console.log('video UI content....', JSON.stringify(content))

  return (
    <>
      <BubbleWrapper
        isMe={isMe}
        status={status}
        onSwipe={onSwipe ? _onSwipe : null}
        message={message}
        showReactions={showReactions}>
        <View style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 5 }}>
          <Video
            paused={true}
            ref={flatListRef}
            controls
            resizeMode="cover"  
            source={{ uri: content.url , type: content.type}}
            // onLoad={() => alert('hi')}
            style={{
              width: 250,
              height: 140,
              backgroundColor: '#ddd',
            }}
            onError={(e) =>
              console.log('Error rendering video\nContent: ', content, '\nError: ', e)
            }
            fullscreen
            pictureInPicture
          />
        </View>
      </BubbleWrapper>

      {!prevSame && <SenderText isMe={isMe}>{senderName}</SenderText>}
    </>
  );
}
