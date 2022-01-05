import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight } from 'react-native';
import { useObservableState } from 'observable-hooks';
import { colors } from '../constants';
import Icon from './components/Icon';
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { matrix } from '@rn-matrix/core';

const debug = require('debug')('rnm:views:components:Composer');

export default function Composer({
  room,
  isEditing = false,
  isReplying = false,
  onEndEdit = () => {},
  selectedMessage = null,
  enableReplies = false,
  onCancelReply = () => {},
  composerStyle = {},
  accentColor = 'crimson',
}) {
  const [value, setValue] = useState('');
  const [actionButtonsShowing, setActionButtonsShowing] = useState(false);

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
      mediaType: 'mixed',
    };
    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) return;
      room.sendMessage(response, response.type ? 'm.image' : 'm.video');
      setActionButtonsShowing(false);
    });
  };

  const openDocPicker = () => {
    DocumentPicker.pick({}).then((res) => {
      if (res) {
        room.sendMessage(res, 'm.file');
        setActionButtonsShowing(false);
      }
    });
  };

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
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        {room.isEncrypted() && (
          <Icon name="lock" color="#888" style={{ marginVertical: 10, marginHorizontal: 4 }} />
        )}
        <TouchableHighlight
          onPress={toggleActionButtons}
          underlayColor="#ddd"
          style={styles.actionButton}>
          <Icon
            name={'add'}
            color="#888"
            size={30}
            style={{
              transform: [{ rotate: actionButtonsShowing ? '45deg' : '0deg' }],
            }}
          />
        </TouchableHighlight>
        {actionButtonsShowing && (
          <>
            <TouchableHighlight
              onPress={openImagePicker}
              underlayColor="#ddd"
              style={styles.sendButton}>
              <Icon name="image" color="#888" size={20} />
            </TouchableHighlight>
            <TouchableHighlight
              onPress={openDocPicker}
              underlayColor="#ddd"
              style={styles.sendButton}>
              <Icon
                name="attach"
                color="#888"
                size={20}
                style={{ transform: [{ rotate: '38deg' }] }}
              />
            </TouchableHighlight>
          </>
        )}
        <TextInput
          ref={textInputRef}
          style={styles.input}
          multiline
          placeholder={`Message ${roomName}...`}
          value={value}
          onChangeText={setValue}
          onFocus={() => setActionButtonsShowing(false)}
        />
        <TouchableHighlight
          disabled={value.length === 0}
          onPress={isEditing ? confirmEdit : handleSend}
          underlayColor="#ddd"
          style={styles.sendButton}>
          <Text
            style={[
              styles.sendText,
              value.length === 0 ? { color: '#888' } : { color: accentColor },
            ]}>
            {isEditing ? 'Save' : 'Send'}
          </Text>
        </TouchableHighlight>
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
  input: {
    padding: 12,
    paddingLeft: 6,
    maxHeight: 200,
    flex: 1,
    fontSize: 14,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 6,
    // marginVertical: 5,
    // marginHorizontal: 6,
    borderRadius: 6,
  },
  sendText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
