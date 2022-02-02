import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableHighlight, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Platform, FlatList, } from 'react-native';
import { useObservableState } from 'observable-hooks';
import { colors } from '../constants';
import Icon from './components/Icon';
import * as ImagePicker from 'react-native-image-picker';
import EmojiSelector from 'react-native-emoji-selector';
import { matrix } from '@rn-matrix/core';
import { stat } from 'react-native-fs';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import Svg, {
  LinearGradient,
  Defs,
  Stop,
  TSpan
} from 'react-native-svg';
// import getUid from 'get-uid';
import { hp, wp } from '@rn-matrix/ui/src/Helper/responsiveScreen';
import { JSONData } from '@rn-matrix/ui/src/Helper/constantString';
var RNFS = require('react-native-fs');

const audioRecorderPlayer = new AudioRecorderPlayer();
var counter = Date.now() % 1e9;

export default function Composer({
  room,
  isEditing = false,
  isReplying = false,
  onEndEdit = () => { },
  selectedMessage = null,
  enableReplies = false,
  onCancelReply = () => { },
  composerStyle = {},
  onMorepress = () => { },
  onMoreMsgOptionpress = () => { },
  accentColor = 'crimson',
  textColor,
}) {
  const [value, setValue] = useState('');
  const [actionButtonsShowing, setActionButtonsShowing] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [showRecordView, setShowRecordView] = useState(false);
  const [visibleMoreMsg, setVisibleMoreMsg] = useState(false);
  const [selectedMsgOption, setSelectedMsgOption] = useState();

  const textInputRef = useRef(null);
  const roomName = useObservableState(room.name$);

  const toggleActionButtons = () => {
    setActionButtonsShowing(!actionButtonsShowing);
  };

  const handleSend = () => {
    if (enableReplies && isReplying && selectedMessage && !isEditing) {
      room.sendReply(selectedMessage, value);
      onCancelReply();
    } else {
      room.sendMessage(value, 'm.text');
    }
    setValue('');
  };

  const addSmiles = (emoji) => {
    room.sendMessage(emoji, 'm.text');
    setShowEmojis(false)
  }

  const cancel = () => {
    setValue('');
    if (isEditing) {
      onEndEdit();
    } else {
      onCancelReply();
    }
  };

  const confirmEdit = () => {
    matrix.send(value, 'm.edit', room.id, selectedMessage.id);
    setValue('');
    textInputRef.current.blur();
    onEndEdit();
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photos',// 'mixed',
      allowsEditing: true,
      includeBase64: true
    };
    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) return;
      console.log('response', response)
      if (response.errorCode || response.error) {
        alert(response?.errorCode || response?.error)
      }
      else {
        if (response instanceof Array) {
          room.sendMessage(response.assets[0], 'm.image');
        }
        else {
          room.sendMessage(response, 'm.image');
        }

      }
    });
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photos',// 'mixed',
      allowsEditing: true,
      includeBase64: true
    };
    ImagePicker.launchCamera(options, async (response) => {
      if (response.didCancel) return;
      console.log('response', response)
      if (response.errorCode || response.error) {
        alert(response?.errorCode || response?.error)
      }
      else {
        if (response instanceof Array) {
          room.sendMessage(response.assets[0], 'm.image');
        }
        else {
          room.sendMessage(response, 'm.image');
        }
      }
    });
  };

  // const openDocPicker = () => {
  //   DocumentPicker.pick({}).then((res) => {
  //     if (res) {
  //       console.log('file response',res)
  //       room.sendMessage(res, 'm.file');
  //     }
  //   });
  // };

  useEffect(() => {
    if (isEditing && selectedMessage) {
      setValue(selectedMessage.content$.getValue().text);
      textInputRef.current.focus();
    }
  }, [isEditing, selectedMessage]);

  if (!room) {
    return (
      <View style={styles.wrapper}>
        <Text style={{ marginLeft: 12 }}>No room specified.</Text>
      </View>
    );
  }

  //start recording event
  const onStartRecord = async () => {

    setShowRecordView(true);

    audioRecorderPlayer.setSubscriptionDuration(0.09);

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    const path = Platform.select({
      ios: 'hello.m4a',
      android: `${RNFS.CachesDirectoryPath}/hello.mp3`,
    });
    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);

    audioRecorderPlayer.addRecordBackListener((e) => {
      console.log(e)
      setRecordTime(audioRecorderPlayer.mmssss(
        Math.floor(e.currentPosition),
      ))
      return;
    });
    console.log(`uri: ${uri}`);

  };

  function getUid() {
    return (Math.random() * 1e9 >>> 0) + (counter++);
  };

  const onStopAudio = async (obj) => {

    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    setShowRecordView(false)
    setRecordTime('00:00:00')
    // this.audioRecorderPlayer = null;
    console.log('result///', result);

    if (obj == 'send') {
      const statResult = await stat(result);
      // var base = RNFS.readFile(result, 'base64').then(res => { return res });;
      // console.log('file size: ' + JSON.stringify(base));
      const obj = {
        fileSize: statResult.size,
        uri: result,
        type: `audio/${Platform.OS == 'android' ? 'mp3' : 'm4a'}`,
        name: `${getUid()}${Platform.OS == 'android' ? '.mp3' : '.m4a'}`
      }

      console.log('file size: ' + JSON.stringify(obj));
      // room.sendMessage(obj, 'm.audio');
      room.sendMessage(obj, 'm.audio');
    }

  }

  const renderRecordAudio = () => {

    return (
      <View style={styles.voiceContainer}>
        <TouchableOpacity style={styles.actionContainer} onPress={() => onStopAudio('cancel')}>
          <Text style={styles.voiceCancelText}>cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionContainer} onPress={() => onStopAudio('send')}>
          <Text style={styles.voiceSendText}>Send</Text>
        </TouchableOpacity>
        <View style={styles.voiceTimerContainer}>
          <View style={styles.recordLabel} />
          <Text style={styles.voiceTimeText}>{recordTime}</Text>
        </View>
      </View>
    );
  }


  function renderSend() {
    // if (!value) {
    return (
      <View style={[styles.containerAddActions]}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.containerAddSmiles]} onPress={() => setShowEmojis(true)}>
            <Icon
              name={'smile'}
              size={22}
              color='transparent'
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.containerAddImage]} onPress={() => openCamera()}>
            <Icon
              name={'camera'}
              size={22}
              color='transparent'
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.containerAddImage]} onPress={() => openImagePicker()}>
            <Icon
              name={'image'}
              size={22}
              color='white'
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.containerAddAudio]} onPress={() => { }}>
            <Icon
              name={'gif'}
              size={22}
              color='transparent'
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.containerAddAudio]} onPress={() => onStartRecord()}>
            <Icon
              name={'audio'}
              size={22}
              color='transparent'
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.containerAddAudio]} onPress={() => setVisibleMoreMsg(!visibleMoreMsg)}>
          <Icon
            name={'VerticalDots'}
            size={22}
            color='transparent'
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.containerSend]} onPress={isEditing ? confirmEdit : handleSend}>
          <Icon
            name={'send'}
            size={22}
            color='transparent'
          />
        </TouchableOpacity>
      </View>
    );
    // }
  }

  function renderEmojis() {
    return (
      <Modal animationType="fade" transparent visible={showEmojis} onRequestClose={() => setShowEmojis(false)}>
        <TouchableWithoutFeedback style={[styles.containerTouchEmojis,]} onPress={() => setShowEmojis(false)}>
          <View style={[styles.containerTouchEmojisInner]}>
            <View style={[styles.containerEmojis]}>
              <EmojiSelector columns={10} showSectionTitles={false} showSearchBar={true} onEmojiSelected={emoji => addSmiles(emoji)} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  function renderAddFiles() {

    return (
      <TouchableOpacity style={[styles.containerAddFiles]} onPress={onMorepress}>
        <Icon
          name={'addfile'}
          size={22}
          color='white'
        />
      </TouchableOpacity>
    );
  }

  function MoreMsgOption() {

    return (
      <View style={[{ height: hp(35), marginTop: hp(0.5), padding: hp(2), justifyContent: 'center', alignItems: 'center' }, composerStyle]}>

        <FlatList
          key={4}
          showsVerticalScrollIndicator={false}
          data={JSONData.MsgOptions}
          numColumns={4}
          renderItem={({ item, index }) => {
            return (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{...styles.msgoptionItemView, borderColor: textColor ,borderWidth: selectedMsgOption == index ? 4 : 0}} onPress={() => setSelectedMsgOption(index)}>
                  <Icon
                    name={item.image}
                    size={30}
                  // color={selectedMsgOption == index ? '#44F556' : 'transparent'}
                  />
                </TouchableOpacity>
                <Text style={{ ...styles.msgoptionName, color: selectedMsgOption == index ? '#44F556' : textColor }}>{item.name}</Text>
              </View>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />

      </View>
    );
  }

  function renderInput() {

    return (
      <View style={[styles.containerTextInput]}>
        <TextInput
          accessible
          enablesReturnKeyAutomatically
          ref={textInputRef}
          style={[styles.textInput, { color: textColor }]}
          multiline
          placeholder={'Type a message...'} //{`Message ${roomName}...`}
          placeholderTextColor={'#696969'}
          value={value}
          onChangeText={setValue}
          onFocus={() => setActionButtonsShowing(false)}
        />
        <TouchableOpacity style={[styles.containerAddSmiles]} onPress={() => { }}>
          <Icon
            name={'expand'}
            size={22}
            color='transparent'
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <View style={[styles.wrapper, composerStyle]}>
        {selectedMessage &&
          ((isEditing && !isReplying) || (!isEditing && isReplying && enableReplies)) && (
            <View style={[styles.activeMessageBar, { borderLeftColor: accentColor }]}>
              <View>
                <Text style={{ color: accentColor, fontWeight: 'bold' }}>
                  {isEditing ? 'Editing' : `Replying to ${selectedMessage.sender.name$.getValue()}`}
                </Text>
                <Text numberOfLines={1} style={{ color: 'gray' }}>
                  {selectedMessage.content$?.getValue()?.text}
                </Text>
              </View>
              <TouchableOpacity
                onPress={cancel}
                underlayColor="#ddd"
                style={{ padding: 6, borderRadius: 50 }}>
                <View>
                  <Icon name="close" color="gray" />
                </View>
              </TouchableOpacity>
            </View>
          )}
        {
          showRecordView && renderRecordAudio()
        }

        <View style={styles.container}>
          {renderInput()}
          <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
            {renderAddFiles()}
            {renderSend()}
            {renderEmojis()}
          </View>
        </View>
      </View>

      {visibleMoreMsg && MoreMsgOption()}

    </View>

  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 6,
    borderRadius: 24,
    marginHorizontal: wp(2),
    marginBottom: hp(1.5)
  },

  activeMessageBar: {
    margin: 6,
    padding: 6,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  container: {
    width: '100%',
  },

  containerAddActions: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  containerAddFiles: { alignItems: 'center', justifyContent: 'center', width: wp(15), height: hp(5) },
  containerAddSmiles: { alignItems: 'center', justifyContent: 'center', width: wp(11), height: hp(5) },
  containerAddAudio: { alignItems: 'center', justifyContent: 'center', width: wp(11), height: hp(5) },
  containerAddImage: { alignItems: 'center', justifyContent: 'center', width: wp(11), height: hp(5) },
  containerSend: { alignItems: 'center', justifyContent: 'center', width: wp(12), height: hp(5) },
  containerTextInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: hp(1) },
  textInput: { flex: 1, marginHorizontal: wp(4), maxHeight: 150, fontWeight: '400', fontSize: 14 },
  containerTouchEmojis: { flex: 1 },
  containerTouchEmojisInner: { flex: 1, backgroundColor: colors.blackTransparent, justifyContent: 'flex-end' },
  containerEmojis: { width: '100%', backgroundColor: colors.white, height: hp(50) },
  voiceContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingLeft: 16, paddingRight: 16 },
  actionContainer: { height: 36, alignItems: 'center', justifyContent: 'center' },
  voiceCancelText: { color: colors.blueDark, fontSize: 14 },
  voiceSendText: { color: colors.blue, fontSize: 14 },
  voiceTimerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  recordLabel: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.red },
  voiceTimeText: { paddingLeft: 5, color: colors.black, fontSize: 12 },
  msgoptionItemView: { backgroundColor: '#353535', height: wp(18), width: wp(18), borderRadius: wp(9), margin: wp(2), justifyContent: 'center', alignItems: 'center'},
  msgoptionName: { fontWeight: '500', fontSize: 10, paddingVertical: hp(0.5), width: wp(17), height: hp(5), textAlign: 'center' }

});
