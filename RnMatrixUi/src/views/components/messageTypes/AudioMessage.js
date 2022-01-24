import { useObservableState } from 'observable-hooks';
import React, { useEffect, useState } from 'react';
import { EventStatus } from 'matrix-js-sdk';
import { Text, TouchableHighlight, View, StyleSheet, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { SenderText, BubbleWrapper } from '../MessageItem';
import { isIos } from '../../../utilities/misc';
import { isEmoji } from '../../../utilities/emojis';
import Html from '../Html';
import { colors } from '../../../constants';
import Icon from '../Icon';
import { matrix } from '@rn-matrix/core';
import Color from 'color';
import Moment from 'moment';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import LinearGradient from 'react-native-linear-gradient';
var RNFS = require('react-native-fs');
const debug = require('debug')('rnm:views:components:messageTypes:AudioMessage');
const audioRecorderPlayer = new AudioRecorderPlayer();

export default function AudioMessage({
  message,
  prevSame,
  nextSame,
  onPress,
  onLongPress,
  onSwipe,
  showReactions,
  myBubbleStyle,
  otherBubbleStyle,
  accentColor,
  audioPlayid,
  onplayPress,
  messageId,
  textColor
}) {
  const theme = useColorScheme();
  const myUser = matrix.getMyUser();
  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);
  const status = useObservableState(message.status$);
  const reactions = useObservableState(message.reactions$);
  const props = { prevSame, nextSame };
  const isMe = myUser?.id === message.sender.id;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPositionSec, setcurrentPositionSec] = useState(0);
  const [currentDurationSec, setcurrentDurationSec] = useState(0);
  const [playtime, setPlayTime] = useState(`00:00`)
  const [leftposition, setLeftPosition] = useState(0)

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************

  const _onLongPress = () => onLongPress(message);
  const _onPress = () => onPress(message);
  const _onSwipe = () => onSwipe(message);

  const getDefaultBackgroundColor = (me, pressed) => {
    return me
      ? pressed
        ? colors.blue500
        : colors.blue400
      : pressed
        ? colors.gray400
        : colors.gray300;
  };

  const action = async () => {
    console.log('content?.url....', content)
    console.log('isPlaying...', isPlaying)

    if (isPlaying) {
      // console.log('isPlaying...',isPlaying)
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false)
    }
    else {
      let localSong = RNFS.CachesDirectoryPath + `/${content?.name || content?.raw.name}`;

      let downloadOptions = {
        fromUrl: content?.url,
        toFile: localSong,
        background: true,
      };
      let res = RNFS.downloadFile(downloadOptions);
      console.log('downloaded', res);
      console.log('localSong', localSong);

      audioRecorderPlayer.setSubscriptionDuration(0.09);
      await audioRecorderPlayer.stopPlayer();

      const msg = await audioRecorderPlayer.startPlayer(`file://${localSong}`);
      const volume = await audioRecorderPlayer.setVolume(1.0);
      console.log(`file: ${msg}`, `volume: ${volume}`);

      audioRecorderPlayer.addPlayBackListener(async (e) => {
        console.log(e)
        if (e.currentPosition === e.duration) {
          setLeftPosition(0)
          setIsPlaying(false)
          setPlayTime(`00:00`)
          audioRecorderPlayer.stopPlayer();
          audioRecorderPlayer.removePlayBackListener();
        }
        else {
          setIsPlaying(true)
          setcurrentPositionSec(e.currentPosition)
          setcurrentPositionSec(e.duration)
          const leftPosition = e.currentPosition / e.duration * 99;
          console.log('leftPosition', leftPosition)
          setLeftPosition(leftPosition)
          setPlayTime(audioRecorderPlayer.mmss(
            Math.floor(e.currentPosition),
          ))
        }
        return;
      });
    }
  }

  const getDefaultGradientBackgroundColor = (me, pressed) => {
    return me
      ? myBubbleStyle().gradientColor
      : otherBubbleStyle().gradientColor
  };

  console.log('audioncontent from UI....', content)
  //   const leftPosition = currentPositionSec ? currentPositionSec / currentDurationSec * 99 : 0;
  console.log('messageId', audioPlayid);
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
              underlayColor='transparent' //{getDefaultBackgroundColor(isMe, true)}
              onPress={onPress ? _onPress : null}
              onLongPress={onLongPress ? _onLongPress : null}
              delayLongPress={200}
              style={[
                // bubbleStyles(isMe, prevSame, nextSame),
                // { backgroundColor: getDefaultBackgroundColor(isMe, false) },
                (!isMe && theme == 'dark' ? { borderColor: '#00FFA3', backgroundColor: '#000' } : {}),
                (!isMe && theme == 'dark' ? { borderRadius: 16, borderWidth: 4 } : {}),
                (isMe ? { borderTopRightRadius: 5 } : { borderTopLeftRadius: 5 }),
                reactions ? { alignSelf: isMe ? 'flex-end' : 'flex-start' } : {},
                isMe ? myBubbleStyle() : otherBubbleStyle(),
              ]}
              {...props}>
              <LinearGradient colors={getDefaultGradientBackgroundColor(isMe, true)} style={{ ...bubbleStyles(isMe, prevSame, nextSame), padding: 10 }}>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                  }}>

                  {/* <ContentAudio contentObj={content} isOwn={isMe} 
                   startAudioPlay={() =>  alert('start')}
                    stopAudioPlay={() => alert('stop')}
               /> */}

                  <View style={[styles.audioPreview, isMe && styles.audioPreviewMy]}>
                    <TouchableOpacity style={styles.touchArea} onPress={() => { onplayPress(messageId); action() }}>
                      <Image source={isPlaying && audioPlayid == messageId ? require('../../../assets/icons/icon-player-pause.png') : require('../../../assets/icons/icon-player-play.png')} style={styles.icon32} />
                    </TouchableOpacity>
                    <View style={styles.audioTrackProgress}>
                      <View style={styles.audioTrackContainer}>
                        <View style={styles.audioTrackContainerInner}>
                          <View style={[styles.audioTrack, { left: leftposition }]} />
                        </View>
                      </View>
                      <View style={styles.audioTimeContainer}>
                        <Text style={[styles.audioTimeText]}>{playtime}</Text>
                      </View>
                    </View>
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
      {!prevSame && <SenderText isMe={isMe} color={textColor}>{Moment(dateTime).format('d MMM HH:mm').toLocaleUpperCase()}</SenderText>}

    </>
  );
}

const styles = StyleSheet.create({
  audioPreview: { paddingTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopLeftRadius: Platform.OS === 'ios' ? 0 : 20, borderTopRightRadius: 20, width: 170 },
  audioPreviewMy: { borderTopLeftRadius: 20, borderTopRightRadius: Platform.OS === 'ios' ? 0 : 20 },
  audioTrackContainer: { height: 2, width: 105, backgroundColor: colors.grey, borderRadius: 1 },
  audioTrackContainerInner: { height: 2, width: 100, position: 'relative' },
  audioTrack: { height: 10, width: 10, position: 'relative', backgroundColor: colors.orange, borderRadius: 5, left: 0, top: -4 },
  audioTimeContainer: { alignSelf: 'flex-end', paddingTop: 4 },
  audioTimeText: { fontSize: 12, color: colors.greyDark2 },
  audioTimeTextMy: { color: colors.white },
  audioTrackProgress: { alignItems: 'center', justifyContent: 'center', marginTop: 16, paddingRight: 10 },
  icon32: { width: 32, height: 32 },
  touchArea: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});


const sharpBorderRadius = 5;
const bubbleStyles = (isMe, prevSame, nextSame) => ({
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 16,
  ...(isMe ? { borderTopRightRadius: 5 } : { borderTopLeftRadius: 5 }),
});

const viewStyle = (nextSame) => ({
  marginTop: 20,
  marginBottom: nextSame ? 1 : 4,
  maxWidth: '85%',
});
