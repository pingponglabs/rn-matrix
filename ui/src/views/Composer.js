import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Platform, } from 'react-native';
import { useObservableState } from 'observable-hooks';
import { colors } from '../constants';
import Icon from './components/Icon';
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
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
import getUid from 'get-uid';
var RNFS = require('react-native-fs');

const audioRecorderPlayer = new AudioRecorderPlayer();

export default function Composer({
  room,
  isEditing = false,
  isReplying = false,
  onEndEdit = () => { },
  selectedMessage = null,
  enableReplies = false,
  onCancelReply = () => { },
  composerStyle = {},
  onMorepress = () => {},
  accentColor = 'crimson',
}) {
  const [value, setValue] = useState('');
  const [actionButtonsShowing, setActionButtonsShowing] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [showRecordView, setShowRecordView] = useState(false)

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
    };
    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) return;
      console.log('response',response)
      room.sendMessage(response, 'm.image');
      // room.sendMessage({...response, type: 'video/mov', name: `${getUid()}.mov`}, 'm.video');
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
        fileSize:statResult.size,
        uri:result,
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

    if (!value) {
      return (
        <View style={[styles.containerAddActions]}>
          <TouchableOpacity style={[styles.containerAddAudio]} onPress={() => onStartRecord()}>
            <Image source={require('../assets/icons/icon-add-audio.png')} style={[styles.iconActionsAddAudio]} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.containerAddImage]} onPress={() => openImagePicker()}>
            <Image source={require('../assets/icons/icon-add-image.png')} style={[styles.iconActionsAddImage]} />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity style={[styles.containerSend]} onPress={isEditing ? confirmEdit : handleSend}>
        <Image source={require('../assets/icons/icon-send.png')} style={[styles.iconActionsSend]} />
      </TouchableOpacity>
    );
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
        <Image source={require('../assets/icons/icon-add-files.png')} style={{ height: 30, width: 30 }}></Image>
      </TouchableOpacity>
    );
  }


  function renderInput() {

    return (
      <View style={[styles.containerTextInput]}>
        <TextInput
          accessible
          enablesReturnKeyAutomatically
          ref={textInputRef}
          style={[styles.textInput]}
          multiline
          placeholder={'Type a message...'}//{`Message ${roomName}...`}
          value={value}
          onChangeText={setValue}
          onFocus={() => setActionButtonsShowing(false)}
        />
        <TouchableOpacity style={[styles.containerAddSmiles]} onPress={() => setShowEmojis(true)}>
          <Image source={require('../assets/icons/icon-smile.png')} style={styles.iconActionsAddSmiles}></Image>
        </TouchableOpacity>
      </View>
    );
  }

  return (
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
            <TouchableHighlight
              onPress={cancel}
              underlayColor="#ddd"
              style={{ padding: 6, borderRadius: 50 }}>
              <View>
                <Icon name="close" color="gray" />
              </View>
            </TouchableHighlight>
          </View>
        )}
      {
        showRecordView && renderRecordAudio()
      }
     
      <View style={styles.container}>
        {renderAddFiles()}
        {renderInput()}
        {renderSend()}
        {renderEmojis()}
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  wrapper: {
    minHeight: 45,
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
    backgroundColor: colors.white,
    padding: 6,
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: colors.white,
    width: '100%',
    paddingTop: 0,
    paddingBottom: 10,
  },
  containerAddActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  containerAddFiles: { alignItems: 'center', justifyContent: 'center', width: 60, height: 40 },
  containerAddSmiles: { alignItems: 'center', justifyContent: 'center', width: 40, height: 36 },
  containerAddAudio: { alignItems: 'center', justifyContent: 'center', width: 40, height: 40 },
  containerAddImage: { alignItems: 'center', justifyContent: 'center', width: 40, height: 40 },
  containerSend: { alignItems: 'center', justifyContent: 'center', width: 60, height: 40 },
  iconActionsAddFiles: { width: 30, height: 30 },
  iconActionsAddSmiles: { width: 24, height: 24 },
  iconActionsAddAudio: { width: 24, height: 24 },
  iconActionsAddImage: { width: 24, height: 24 },
  iconActionsSend: { width: 30, height: 30 },
  containerTextInput: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', borderRadius: 25, backgroundColor: colors.greyLight, padding: 5 },
  textInput: { flex: 1, marginRight: 10, marginLeft: 10, color: colors.black, maxHeight: 150 },
  containerTouchEmojis: { flex: 1 },
  containerTouchEmojisInner: { flex: 1, backgroundColor: colors.blackTransparent, justifyContent: 'flex-end' },
  containerEmojis: { width: '100%', backgroundColor: colors.white, height: 500 },
  voiceContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingLeft: 16, paddingRight: 16 },
  actionContainer: { height: 36, alignItems: 'center', justifyContent: 'center' },
  voiceCancelText: { color: colors.blueDark, fontSize: 14 },
  voiceSendText: { color: colors.blue, fontSize: 14 },
  voiceTimerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  recordLabel: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.red },
  voiceTimeText: { paddingLeft: 5, color: colors.black, fontSize: 12 },

});
