import React from 'react';
import { useObservableState } from 'observable-hooks';
import { StyleSheet, TouchableHighlight, Image, View, Text, TouchableOpacity } from 'react-native';
import Icon from './Icon';
import { matrix } from '@rn-matrix/core';
import { hp, normalize, wp } from '@rn-matrix/ui/src/Helper/responsiveScreen';
import { colors } from '@rn-matrix/ui/src/constants';
const avatarSize = 50;

export default function RoomInviteItem({
  room,
  textColor,
  OnselectUser,
  OnRemoveUser,
  selectedUsers,
  backgroundColor
}) {
  // const name = useObservableState(room.name$);
  // const avatar = useObservableState(room.avatar$);

  const joinRoom = () => {
    matrix.joinRoom(room.id);
  };

  const rejectInvite = () => {
    matrix.leaveRoom(room.id);
  };

  return (
  
    <View style={{ ...styles.rowWrapper, backgroundColor: backgroundColor }}>
      {room.avatar ? (
        <Image
          source={room.avatar ? {uri: matrix.getHttpUrl(room.avatar)} : null}
          style={styles.avatar}
        />
      ) : (
        <DefaultImage letter={room.name?.charAt(0)} textColor={textColor}/>
      )}

      <View style={{ flex: 1, marginLeft: wp(4), justifyContent: 'space-between', flexDirection: 'row' }}>
        <View style={styles.textWrapper}>
          <Text style={{ ...styles.title, color: textColor }} numberOfLines={1}>
            {room.name}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: wp(50), paddingVertical: hp(0.5) }}>

            <Text style={styles.snippet} numberOfLines={2} ellipsizeMode="tail">
              Online
            </Text>

            <Image source={require('../../assets/icons/whatsapp.png')} style={{ height: hp(3), width: wp(14), marginHorizontal: wp(5) }} resizeMode='cover'></Image>
          </View>
        </View>
        {
          selectedUsers.find(obj => obj.id == room.id) ?
            <TouchableOpacity style={styles.phoneBtnStyle} onPress={() => OnRemoveUser(room)}>
              <Icon name={'Invited'} size={22} color='transparent' />
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.phoneBtnStyle} onPress={() => OnselectUser(room)}>
              <Icon name={'Invite'} size={22} color='transparent' />
            </TouchableOpacity>
        }
      </View>
    </View>
    
  );
}

const DefaultImage = ({ letter,textColor }) => (
  <View
    style={[
      styles.avatar,
      { backgroundColor:'rgba(175, 175, 175, 0.6)', justifyContent: 'center', alignItems: 'center' },
    ]}>
    <Text style={{...styles.defaultAvatarLetter,color: textColor }}>{letter?.toUpperCase()}</Text>
  </View>
);

const styles = StyleSheet.create({
  rowWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: hp(2),
    marginHorizontal: wp(4)
  },
  avatar: {
    width: wp(13.5),
    height: wp(13.5),
    borderRadius: wp(7),
    alignSelf: 'center',
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: normalize(14),
  },
  snippet: {
    fontWeight: '500',
    fontSize: normalize(13),
    color: colors.gray3
  },
  defaultAvatarLetter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ddd',
  },
  unreadIndicator: {
    backgroundColor: 'dodgerblue',
    width: 16,
    height: 16,
    borderRadius: 40,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  phoneBtnStyle: {
    height: wp(12), width: wp(12), justifyContent: 'center', alignItems: 'center'
  }
});
