import { useObservableState } from 'observable-hooks';
import React, { useState } from 'react';
import { EventStatus } from 'matrix-js-sdk';
import { Text, TouchableHighlight, View, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import { SenderText, BubbleWrapper } from '../MessageItem';
import { colors } from '../../../constants';
import Icon from '../Icon';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { matrix } from '@rn-matrix/core';
import Color from 'color';
import Moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { DateFormate, TimeFormate } from '@rn-matrix/ui/src/Helper/constantString';
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
  textColor,
  otherBubbleStyle,
}) {
  const theme = useColorScheme();
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

    // IMPORTANT: A file extension is always required on iOS.
    // You might encounter issues if the file extension isn't included
    // or if the extension doesn't match the mime type of the file.
    const localFile = `${RNFS.DocumentDirectoryPath}/${content.name}`;
    console.log('localFile....',localFile);
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

  const getDefaultGradientBackgroundColor = (me, pressed) => {
    return me
      ? myBubbleStyle().gradientColor
      : otherBubbleStyle().gradientColor
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

  var dateTime = new Date(parseInt(message?.timestamp, 10));

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
               underlayColor='transparent' //{getDefaultBackgroundColor(isMe, true)}
              onPress={onPress ? _onPress : null}
              onLongPress={onLongPress ? _onLongPress : null}
              delayLongPress={200}
              style={[
                // bubbleStyles(isMe, prevSame, nextSame),
                // { backgroundColor: isMe ? colors.blue400 : colors.gray300 },
                (!isMe && theme == 'dark' ? { borderColor: '#00FFA3', backgroundColor: '#000'} : {}),
                (!isMe && theme == 'dark' ? {borderRadius: 16,borderWidth: 4} : {}),
                (isMe ? {borderTopRightRadius: 5} : {borderTopLeftRadius: 5 }),
                reactions ? { alignSelf: isMe ? 'flex-end' : 'flex-start' } : {},
                isMe ? myBubbleStyle() : otherBubbleStyle(),
              ]}>
                <LinearGradient colors={getDefaultGradientBackgroundColor(isMe, true)} style={{ ...bubbleStyles(isMe, prevSame, nextSame), padding: 10 }}>

              <View style={{ alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row'}}>
                  {downloadIcon}
                  <Text
                    onPress={openFile}
                    style={[styles.fileText, { color: textColor}]}> 
                    {content.name}
                  </Text>
                  <Text style={{color: theme == 'dark' ? 'white' : '#696969', fontSize: 11, fontWeight: '700', marginLeft: 10, alignSelf:'flex-end',paddingVertical:5}}>{Moment(dateTime).format(TimeFormate)}</Text>
                </View>
                {/* {isMe && (
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
                )} */}
              </View>
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </View>
      </BubbleWrapper>

      {!prevSame && <SenderText isMe={isMe} color={textColor}>{Moment(dateTime).format(DateFormate).toLocaleUpperCase()}</SenderText>}
   
    </>
  );
}

const sharpBorderRadius = 5;
const bubbleStyles = (isMe, prevSame, nextSame) => ({
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 16,
  ...(isMe ? {borderTopRightRadius: 5} : {borderTopLeftRadius: 5 }),
});

const viewStyle = (nextSame) => ({
  marginTop:20,
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
    fontSize: 16,
    fontWeight:'400',
    flexDirection: 'column',
  },
});
