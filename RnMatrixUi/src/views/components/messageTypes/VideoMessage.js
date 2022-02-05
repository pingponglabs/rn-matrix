import React, { useRef } from 'react';
import { View, Image, Text } from 'react-native';
import { useObservableState } from 'observable-hooks';
import { BubbleWrapper, SenderText } from '../MessageItem';
import Video from 'react-native-video';
import { matrix } from '@rn-matrix/core';
import Moment from 'moment';
// import { Thumbnail } from 'react-native-thumbnail-video';
import LinearGradient from 'react-native-linear-gradient';
import { DateFormate, TimeFormate } from '@rn-matrix/ui/src/Helper/constantString';

export default function VideoMessage({
  message,
  prevSame,
  nextSame,
  onPress,
  onLongPress,
  onSwipe,
  showReactions,
  textColor,
  myBubbleStyle,
  otherBubbleStyle,
}) {
  const myUser = matrix.getMyUser();
  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);
  const flatListRef = useRef();
  const status = useObservableState(message.status$);
  const isMe = myUser.id === message.sender.id;
  if (!content) return null;
  const _onLongPress = () => onLongPress(message);
  const _onPress = () => onPress(message);
  const _onSwipe = () => onSwipe(message);
  // const { width, height } = content?.thumb;

  const getDefaultGradientBackgroundColor = (me, pressed) => {
    return me
      ? myBubbleStyle().gradientColor
      : otherBubbleStyle().gradientColor
  };

  const imageStyles = {
    width: 250,
    height: 170,
    backgroundColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems:'center',
  };

  const imageWrapperStyles = {
    marginTop: 20,
    marginBottom: nextSame ? 1 : 4,
   
    padding: 10,
    borderRadius: 16,
    ...(isMe ? {borderTopRightRadius: 5} : {borderTopLeftRadius: 5 }),
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
           <LinearGradient colors={getDefaultGradientBackgroundColor(isMe, true)} style={imageWrapperStyles}>
           <Video
            paused={true}
            ref={flatListRef}
            controls
            resizeMode="cover"  
            source={{ uri: content.url , type: content.type}}
            style={imageStyles}
            onError={(e) =>
              console.log('Error rendering video\nContent: ', content, '\nError: ', e)
            }
            fullscreen
            pictureInPicture
          />
           <Text style={{color: 'white', fontSize: 11, fontWeight: '700', position:'absolute', right:20, bottom:15 ,paddingVertical:5}}>{Moment(dateTime).format(TimeFormate)}</Text>
            {/* <Thumbnail url='https://www.youtube.com/watch?v=6yvs1No7t1c' blurRadius={1} style={imageStyles}/> */}
          </LinearGradient>
        {/* <View style={{ borderRadius: 20, overflow: 'hidden', marginTop: 20 }}>
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
        </View> */}
      </BubbleWrapper>
      {!prevSame && <SenderText isMe={isMe} color={textColor}>{Moment(dateTime).format(DateFormate).toLocaleUpperCase()}</SenderText>}
    </>
  );
}
