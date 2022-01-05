import { useObservableState } from 'observable-hooks';
import React, { useState } from 'react';
import { EventStatus } from 'matrix-js-sdk';
import { Text, TouchableHighlight, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SenderText, BubbleWrapper } from '../MessageItem';
import { colors } from '../../../constants';
import Icon from '../Icon';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { matrix, Message } from '@rn-matrix/core';
import Color from 'color';

const debug = require('debug')('rnm:views:components:messageTypes:FileMessage');

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

  const [openingFile, setOpeningFile] = useState(false);

  if (!content) return null;

  const _onLongPress = () => onLongPress(message);
  const _onPress = () => onPress(message);
  const _onSwipe = () => onSwipe(message);

  const openFile = () => {
    setOpeningFile(true);

    const name = Message.isVideoMessage(message.type$.getValue()) ? content.raw.body : content.name;

    // IMPORTANT: A file extension is always required on iOS.
    // You might encounter issues if the file extension isn't included
    // or if the extension doesn't match the mime type of the file.
    const localFile = `${RNFS.DocumentDirectoryPath}/${name}`;

    const options = {
      fromUrl: content.url,
      toFile: localFile,
    };
    RNFS.downloadFile(options)
      .promise.then(() => {
        FileViewer.open(localFile, { showOpenWithDialog: true });
      })
      .then(() => {
        // success
        setOpeningFile(false);
      })
      .catch((error) => {
        // error
        setOpeningFile(false);
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

  const downloadIconBackgroundColor = (me, pressed) => {
    return me
      ? Color(myBubbleStyle(pressed)?.backgroundColor || getDefaultBackgroundColor(me, pressed))
          .darken(0.2)
          .hex()
      : Color(otherBubbleStyle(pressed)?.backgroundColor || getDefaultBackgroundColor(me, pressed))
          .darken(0.2)
          .hex();
  };

  const downloadIcon = (
    <TouchableHighlight
      onPress={openFile}
      underlayColor={downloadIconBackgroundColor(isMe, true)}
      style={[styles.downloadIcon, { backgroundColor: downloadIconBackgroundColor(isMe, false) }]}>
      {openingFile ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Icon name="file" color={isMe ? colors.white : '#222'} size={32} />
      )}
    </TouchableHighlight>
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
            <TouchableHighlight
              {...props}
              underlayColor={downloadIconBackgroundColor(isMe, false)}
              onPress={onPress ? _onPress : null}
              onLongPress={onLongPress ? _onLongPress : null}
              delayLongPress={200}
              style={[
                bubbleStyles(isMe, prevSame, nextSame),
                { backgroundColor: isMe ? colors.blue400 : colors.gray300 },
                reactions ? { alignSelf: isMe ? 'flex-end' : 'flex-start' } : {},
                isMe ? myBubbleStyle() : otherBubbleStyle(),
              ]}>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row' }}>
                  {downloadIcon}
                  <Text
                    onPress={openFile}
                    style={[styles.fileText, { color: isMe ? colors.white : '#222' }]}>
                    {content.name || content.raw.body || 'Uploading...'}
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
            </TouchableHighlight>
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

const styles = StyleSheet.create({
  downloadIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 60,
    width: 60,
    height: 60,
  },
  fileText: {
    alignSelf: 'center',
    textDecorationLine: 'underline',
    marginLeft: 12,
    maxWidth: 200,
    fontSize: 18,
    flexDirection: 'column',
  },
});
