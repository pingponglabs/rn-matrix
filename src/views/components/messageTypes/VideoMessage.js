import React from 'react';
import { View } from 'react-native';
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

  if (!content) return null;

  const _onLongPress = () => onLongPress(message);
  const _onPress = () => onPress(message);
  const _onSwipe = () => onSwipe(message);

  const { width, height } = content.thumb;

  const iframeHtml = `<iframe src="${content.url}" frameborder="0" width="${width}" height="${height}" style="height:${height}px;width:${width}px;"></iframe>`;
  const videoHtml = `<video src="${content.url}" alt="science.mp4" controls="" preload="none" autoplay="" playsinline height="100%" width="100%" style="background-color:#ddd" ></video>`;
  const head = `<style>body{margin:0}</style><meta name="viewport" content="width=device-width, initial-scale=1">`;
  const html = `<!DOCTYPE html><html><head>${head}</head><body>${iframeHtml}</body></html>`;

  const test = `<html style="background-color:#ddd"><head><meta name="viewport" content="width=${width}"></head><body><video controls="true" autoplay="true" name="media" width="${width}"><source src="${content.url}" type="video/mp4"></video></body></html>`;

  return (
    <>
      <BubbleWrapper
        isMe={isMe}
        status={status}
        onSwipe={onSwipe ? _onSwipe : null}
        receipts={receipts}>
        <View style={{ borderRadius: 20, overflow: 'hidden' }}>
          <Video
            controls
            source={{ uri: content.url, type: content.type }}
            style={{
              width,
              height,
              backgroundColor: '#ddd',
            }}
            onError={console.warn}
            fullscreen
            pictureInPicture
          />
        </View>
      </BubbleWrapper>

      {!prevSame && <SenderText isMe={isMe}>{senderName}</SenderText>}
    </>
  );
}
