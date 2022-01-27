import React from 'react';
import { useObservableState } from 'observable-hooks';
import { StyleSheet, TouchableHighlight, Image, View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Icon from './Icon';
import { hp, isX, normalize, wp } from '@rn-matrix/ui/src/Helper/responsiveScreen';
import { colors } from '@rn-matrix/ui/src/constants';

const avatarSize = wp(10);

export default function RoomListItem({
  room,
  onPress,
  textColor,
  onlineTextColor,
}) {
  const name = useObservableState(room.name$);
  const avatar = useObservableState(room.avatar$);
  const snippet = useObservableState(room.snippet$);
  const readState = useObservableState(room.readState$);

  const handleOnPress = () => {
    onPress(room);
  };

  return (
    <TouchableOpacity underlayColor="#ddd" onPress={handleOnPress}>
      <View style={styles.rowWrapper}>
        {avatar ? (
          <Image
            source={room.getAvatarUrl(avatarSize) ? { uri: room.getAvatarUrl(avatarSize) } : {}}
            style={styles.avatar}
          />
        ) : (
          <DefaultImage letter={name?.charAt(0)} textColor={textColor} />
        )}

        {/* <View style={{ flex: 1, marginRight: 12 }}>
          <View style={styles.textWrapper}>
            <Text style={styles.title} numberOfLines={1}>
              {room.isEncrypted() && (
                <>
                  <Icon name="lock" color="#888" size={18} />
                  &nbsp;
                </>
              )}
              {name}
            </Text>
            <Text style={{ color: '#444' }}>{moment(snippet?.timestamp).fromNow()}</Text>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.snippet} numberOfLines={2} ellipsizeMode="tail">
              {snippet?.content}
            </Text>
            {readState === 'unread' && <UnreadIndicator />}
          </View>
        </View> */}
        <View style={{ flex: 1, marginLeft: wp(4), justifyContent: 'space-between', flexDirection: 'row' }}>
          <View style={styles.textWrapper}>
            <Text style={{ ...styles.title, color: textColor }} numberOfLines={1}>
              {name}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: wp(50), paddingVertical: hp(0.5) }}>
              <Text style={{ ...styles.snippet, color: onlineTextColor }} numberOfLines={2} ellipsizeMode="tail">
                Online
              </Text>
              <Image source={require('../../assets/icons/whatsapp.png')} style={{ height: hp(3), width: wp(14), marginHorizontal: wp(5) }} resizeMode='cover'></Image>
            </View>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity style={styles.phoneBtnStyle}>
              <Image source={require('../../assets/icons/Send.png')} style={{ height: wp(5), width: wp(5), marginHorizontal: wp(2), tintColor: textColor }} resizeMode='cover'></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const DefaultImage = ({ letter, textColor }) => (
  <View
    style={[
      styles.avatar,
      { backgroundColor: 'rgba(175, 175, 175, 0.6)', justifyContent: 'center', alignItems: 'center' },
    ]}>
    <Text style={{ ...styles.defaultAvatarLetter, color: textColor }}>{letter?.toUpperCase()}</Text>
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
