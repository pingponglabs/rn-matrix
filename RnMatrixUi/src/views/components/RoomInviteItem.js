import React from 'react';
import {useObservableState} from 'observable-hooks';
import {StyleSheet, TouchableHighlight, Image, View, Text} from 'react-native';
import Icon from './Icon';
import {matrix} from '@rn-matrix/core';

const avatarSize = 50;

export default function RoomInviteItem({room}) {
  const name = useObservableState(room.name$);
  const avatar = useObservableState(room.avatar$);

  const joinRoom = () => {
    matrix.joinRoom(room.id);
  };

  const rejectInvite = () => {
    matrix.leaveRoom(room.id);
  };

  return (
    <TouchableHighlight underlayColor="#ddd">
      <View style={styles.rowWrapper}>
        {avatar ? (
          <Image
            source={
              room.getAvatarUrl(avatarSize)
                ? {uri: room.getAvatarUrl(avatarSize)}
                : {}
            }
            style={styles.avatar}
          />
        ) : (
          <DefaultImage letter={name?.charAt(0)} />
        )}

        <View style={{flex: 1, marginRight: 12, justifyContent: 'center'}}>
          <View style={styles.textWrapper}>
            <Text style={styles.title} numberOfLines={1}>
              {name}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <ResponseButton onPress={rejectInvite} />
              <ResponseButton accept onPress={joinRoom} />
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const ResponseButton = ({accept = false, onPress}) => (
  <TouchableHighlight
    onPress={onPress}
    style={{borderRadius: 30, marginRight: accept ? 0 : 12}}
    underlayColor="#222">
    <View
      style={{
        width: 40,
        height: 40,
        backgroundColor: accept ? 'darkseagreen' : 'indianred',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
      }}>
      <Icon
        name={accept ? 'check' : 'close'}
        size={accept ? 28 : 22}
        color={accept ? 'darkgreen' : 'darkred'}
      />
    </View>
  </TouchableHighlight>
);

const DefaultImage = ({letter}) => (
  <View
    style={[
      styles.avatar,
      {backgroundColor: '#666', justifyContent: 'center', alignItems: 'center'},
    ]}>
    <Text style={styles.defaultAvatarLetter}>{letter?.toUpperCase()}</Text>
  </View>
);

const styles = StyleSheet.create({
  rowWrapper: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginHorizontal: 12,
    alignSelf: 'center',
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    maxWidth: 200,
  },
  defaultAvatarLetter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ddd',
  },
});
