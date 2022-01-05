import React from 'react';
import { useObservableState } from 'observable-hooks';
import { StyleSheet, TouchableHighlight, Image, View, Text } from 'react-native';
import moment from 'moment';
import Icon from './Icon';

const avatarSize = 50;

export default function RoomListItem({ room, onPress }) {
  const name = useObservableState(room.name$);
  const avatar = useObservableState(room.avatar$);
  const snippet = useObservableState(room.snippet$);
  const readState = useObservableState(room.readState$);

  const handleOnPress = () => {
    onPress(room);
  };

  return (
    <TouchableHighlight underlayColor="#ddd" onPress={handleOnPress}>
      <View style={styles.rowWrapper}>
        {avatar ? (
          <Image
            source={room.getAvatarUrl(avatarSize) ? { uri: room.getAvatarUrl(avatarSize) } : {}}
            style={styles.avatar}
          />
        ) : (
          <DefaultImage letter={name?.charAt(0)} />
        )}

        <View style={{ flex: 1, marginRight: 12 }}>
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
        </View>
      </View>
    </TouchableHighlight>
  );
}

const DefaultImage = ({ letter }) => (
  <View
    style={[
      styles.avatar,
      { backgroundColor: '#666', justifyContent: 'center', alignItems: 'center' },
    ]}>
    <Text style={styles.defaultAvatarLetter}>{letter?.toUpperCase()}</Text>
  </View>
);

const UnreadIndicator = () => <View style={styles.unreadIndicator} />;

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
  snippet: {
    maxWidth: 300,
    color: '#444',
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
});
