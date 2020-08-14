import React from 'react';
import { Text, View } from 'react-native';
import users from '../../../services/user';
import { useObservableState } from 'observable-hooks';
import { BubbleWrapper, SenderText } from '../MessageItem';
import Video from 'react-native-video';

export default function VideoMessage({
  message,
  prevSame,
  nextSame,
  onPress,
  onLongPress,
  onSwipe,
}) {
  const myUser = users.getMyUser();
  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);
  const receipts = message.receipts$ ? useObservableState(message.receipts$) : [];
  const status = useObservableState(message.status$);
  const isMe = myUser.id === message.sender.id;

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
        <View style={{ borderRadius: 20, overflow: 'hidden' }}>
          <Video
            source={{ uri: 'http://techslides.com/demos/sample-videos/small.mp4' }}
            //  onBuffer={this.onBuffer}                // Callback when remote video is buffering
            //  onError={this.videoError}
            style={{ width: 300, height: 200 }}
            controls
            pictureInPicture
          />
        </View>
      </BubbleWrapper>

      {!prevSame && <SenderText isMe={isMe}>{senderName}</SenderText>}
    </>
  );
}
