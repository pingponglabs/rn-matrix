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
  const name = useObservableState(room.name$);
  const avatar = useObservableState(room.avatar$);

  const joinRoom = () => {
    matrix.joinRoom(room.id);
  };

  const rejectInvite = () => {
    matrix.leaveRoom(room.id);
  };

  return (
    // <TouchableHighlight underlayColor="#ddd">
    //   <View style={styles.rowWrapper}>
    //     {avatar ? (
    //       <Image
    //         source={
    //           room.getAvatarUrl(avatarSize)
    //             ? {uri: room.getAvatarUrl(avatarSize)}
    //             : {}
    //         }
    //         style={styles.avatar}
    //       />
    //     ) : (
    //       <DefaultImage letter={name?.charAt(0)} />
    //     )}
    //     <View style={{flex: 1, marginRight: 12, justifyContent: 'center'}}>
    //       <View style={styles.textWrapper}>
    //         <Text style={styles.title} numberOfLines={1}>
    //           {name}
    //         </Text>
    //         <View style={{flexDirection: 'row', alignItems: 'center'}}>
    //           <ResponseButton onPress={rejectInvite} />
    //           <ResponseButton accept onPress={joinRoom} />
    //         </View>
    //       </View>
    //     </View>
    //   </View>
    // </TouchableHighlight>

    // <TouchableHighlight underlayColor="#ddd" >
    <View style={{ ...styles.rowWrapper, backgroundColor: backgroundColor }}>
      {avatar ? (
        <Image
          source={room.getAvatarUrl(avatarSize) ? { uri: room.getAvatarUrl(avatarSize) } : {}}
          style={styles.avatar}
        />
      ) : (
        <DefaultImage letter={name?.charAt(0)} />
      )}

      <View style={{ flex: 1, marginLeft: wp(4), justifyContent: 'space-between', flexDirection: 'row' }}>
        <View style={styles.textWrapper}>
          <Text style={{ ...styles.title, color: textColor }} numberOfLines={1}>
            {name}
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
    // </TouchableHighlight>
  );
}

// const ResponseButton = ({ accept = false, onPress }) => (
//   <TouchableHighlight
//     onPress={onPress}
//     style={{ borderRadius: 30, marginRight: accept ? 0 : 12 }}
//     underlayColor="#222">
//     <View
//       style={{
//         width: 40,
//         height: 40,
//         backgroundColor: accept ? 'darkseagreen' : 'indianred',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 30,
//       }}>
//       <Icon
//         name={accept ? 'check' : 'close'}
//         size={accept ? 28 : 22}
//         color={accept ? 'darkgreen' : 'darkred'}
//       />
//     </View>
//   </TouchableHighlight>
// );

const DefaultImage = ({ letter }) => (
  <View
    style={[
      styles.avatar,
      { backgroundColor: '#666', justifyContent: 'center', alignItems: 'center' },
    ]}>
    <Text style={styles.defaultAvatarLetter}>{letter?.toUpperCase()}</Text>
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
    width: wp(13),
    height: wp(13),
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
    fontSize: 24,
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
