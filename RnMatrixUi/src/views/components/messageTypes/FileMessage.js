import {useObservableState} from 'observable-hooks';
import React from 'react';
import {EventStatus} from 'matrix-js-sdk';
import {Text, TouchableHighlight, View, Pressable} from 'react-native';
import {SenderText, BubbleWrapper} from '../MessageItem';
import {colors} from '../../../constants';
import Icon from '../Icon';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import {matrix} from '@rn-matrix/core';

const debug = require('debug')('rnm:views:components:messageTypes:TextMessage');

export default function FileMessage({
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
  const status = useObservableState(message.status$);
  const reactions = useObservableState(message.reactions$);
  const props = {prevSame, nextSame};
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
      .promise.then(() =>
        FileViewer.open(localFile, {showOpenWithDialog: true}),
      )
      .then(() => {
        // success
      })
      .catch((error) => {
        // error
      });
  };

  const downloadIcon = (
    <Pressable
      onPress={openFile}
      style={({pressed}) => ({
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 60,
        width: 60,
        height: 60,
        backgroundColor: pressed
          ? isMe
            ? colors.blue200
            : colors.gray500
          : isMe
          ? colors.blue300
          : colors.gray400,
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
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <TouchableHighlight
              {...props}
              underlayColor={isMe ? colors.blue600 : colors.gray400}
              onPress={onPress ? _onPress : null}
              onLongPress={onLongPress ? _onLongPress : null}
              delayPressIn={0}
              delayLongPress={200}
              style={[
                bubbleStyles(isMe, prevSame, nextSame),
                {backgroundColor: isMe ? colors.blue400 : colors.gray300},
                reactions ? {alignSelf: isMe ? 'flex-end' : 'flex-start'} : {},
              ]}>
              <View style={{alignItems: 'flex-end'}}>
                <View style={{flexDirection: 'row'}}>
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
                  <View style={{marginLeft: 12, marginRight: -6}}>
                    <Icon
                      name={
                        status === EventStatus.SENDING
                          ? 'circle'
                          : 'check-circle'
                      }
                      size={16}
                      color="#0f5499"
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
        ...(prevSame ? {borderTopRightRadius: sharpBorderRadius} : {}),
        ...(nextSame ? {borderBottomRightRadius: sharpBorderRadius} : {}),
      }
    : {
        ...(prevSame ? {borderTopLeftRadius: sharpBorderRadius} : {}),
        ...(nextSame ? {borderBottomLeftRadius: sharpBorderRadius} : {}),
      }),
});

const viewStyle = (nextSame) => ({
  marginTop: 2,
  marginBottom: nextSame ? 1 : 4,
  maxWidth: '85%',
});
