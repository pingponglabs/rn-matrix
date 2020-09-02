import { useObservableState } from 'observable-hooks';
import React from 'react';
import { EventStatus } from 'matrix-js-sdk';
import { Text, TouchableHighlight, View, Pressable } from 'react-native';
import { SenderText, BubbleWrapper } from '../MessageItem';
import { colors } from '../../../constants';
import Icon from '../Icon';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { matrix } from '@rn-matrix/core';
import Color from 'color';

const debug = require('debug')('rnm:views:components:messageTypes:TextMessage');

export default function FileMessage({
  message,
  prevSame,
  nextSame,
  onPress,
  onLongPress,
  onSwipe,
  showReactions,
  myBubbleStyle,
  otherBubbleStyle,
}) {
  const myUser = matrix.getMyUser();
  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);
  const status = useObservableState(message.status$);
  const reactions = useObservableState(message.reactions$);
  const props = { prevSame, nextSame };
  const isMe = myUser?.id === message.sender.id;

  if (!content) return null;

  const _onLongPress = () => onLongPress(message);
  const _onPress = () => onPress(message);
  const _onSwipe = () => onSwipe(message);

  const openFile = () => {
    // IMPORTANT: A file extension is always required on iOS.
    // You might encounter issues if the file extension isn't included
    // or if the extension doesn't match the mime type of the file.
    const localFile = `${RNFS.DocumentDirectoryPath}/${content.name}`;

    const options = {
      fromUrl: content.url,
      toFile: localFile,
    };
    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile, { showOpenWithDialog: true }))
      .then(() => {
        // success
      })
      .catch((error) => {
        // error
      });
  };

  const getDefaultBackgroundColor = (me, pressed) => {
    return me
      ? pressed
        ? colors.blue500
        : colors.blue400
      : pressed
      ? colors.gray400
      : colors.gray300;
  };

  const downloadIcon = (
    <Pressable
      onPress={openFile}
      style={({ pressed }) => ({
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 60,
        width: 60,
        height: 60,
        backgroundColor: isMe
          ? Color(
              myBubbleStyle(pressed)?.backgroundColor || getDefaultBackgroundColor(isMe, pressed)
            )
              .darken(0.2)
              .hex()
          : Color(
              otherBubbleStyle(pressed)?.backgroundColor || getDefaultBackgroundColor(isMe, pressed)
            )
              .darken(0.2)
              .hex(),
      })}>
      <Icon name="file" color={isMe ? colors.white : '#222'} size={32} />
    </Pressable>
  );

  return (
    <>
      <BubbleWrapper
        isMe={isMe}
        status={status}
        onSwipe={onSwipe ? _onSwipe : null}
        message={message}
        showReactions={showReactions}>
        <View style={viewStyle(nextSame)}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Pressable
              {...props}
              onPress={onPress ? _onPress : null}
              onLongPress={onLongPress ? _onLongPress : null}
              delayLongPress={200}
              style={({ pressed }) => [
                bubbleStyles(isMe, prevSame, nextSame),
                { backgroundColor: isMe ? colors.blue400 : colors.gray300 },
                reactions ? { alignSelf: isMe ? 'flex-end' : 'flex-start' } : {},
                isMe ? myBubbleStyle(pressed) : otherBubbleStyle(pressed),
              ]}>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row' }}>
                  {downloadIcon}
                  <Text
                    onPress={openFile}
                    style={{
                      fontSize: 18,
                      flexDirection: 'column',
                      color: isMe ? colors.white : '#222',
                      alignSelf: 'center',
                      textDecorationLine: 'underline',
                      marginLeft: 12,
                    }}>
                    {content.name}
                  </Text>
                </View>
                {isMe && (
                  <View style={{ marginLeft: 12, marginRight: -6 }}>
                    <Icon
                      name={status === EventStatus.SENDING ? 'circle' : 'check-circle'}
                      size={16}
                      color={
                        myBubbleStyle(false)?.backgroundColor
                          ? Color(myBubbleStyle(false).backgroundColor).darken(0.3).hex()
                          : Color(getDefaultBackgroundColor(isMe, false)).darken(0.3).hex()
                      }
                    />
                  </View>
                )}
              </View>
            </Pressable>
          </View>
        </View>
      </BubbleWrapper>

      {!prevSame && <SenderText isMe={isMe}>{senderName}</SenderText>}
    </>
  );
}

const sharpBorderRadius = 5;
const bubbleStyles = (isMe, prevSame, nextSame) => ({
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 18,
  ...(isMe
    ? {
        ...(prevSame ? { borderTopRightRadius: sharpBorderRadius } : {}),
        ...(nextSame ? { borderBottomRightRadius: sharpBorderRadius } : {}),
      }
    : {
        ...(prevSame ? { borderTopLeftRadius: sharpBorderRadius } : {}),
        ...(nextSame ? { borderBottomLeftRadius: sharpBorderRadius } : {}),
      }),
});

const viewStyle = (nextSame) => ({
  marginTop: 2,
  marginBottom: nextSame ? 1 : 4,
  maxWidth: '85%',
});
