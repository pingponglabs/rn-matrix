import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import matrix from '../services/matrix';
import chatService from '../services/chat';
import { useObservableState } from 'observable-hooks';
import RoomListItem from './components/RoomListItem';
import RoomInviteItem from './components/RoomInviteItem';

type Props = {
  renderListItem?: (props: any) => JSX.Element | null,
  renderInvite?: (props: any) => JSX.Element | null,
  onRowPress?: Function,
};

export default function RoomList({
  renderListItem = null,
  renderInvite = null,
  onRowPress = () => {},
}: Props) {
  const inviteList = useObservableState(chatService.getListByType$('invites'));
  const chatList = useObservableState(chatService.getChats());
  const isReady = useObservableState(matrix.isReady$());
  const isSynced = useObservableState(matrix.isSynced$());

  const renderRow = ({ item }) => {
    return <RoomListItem room={item} onPress={onRowPress} />;
  };

  const renderInviteRow = ({ item }) => {
    return <RoomInviteItem room={item} />;
  };

  if (!isReady || !isSynced) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const InviteList = () => (
    <>
      {inviteList.map(item => (renderInvite ? renderInvite({ item }) : renderInviteRow({ item })))}
    </>
  );

  return (
    <FlatList
      data={chatList}
      renderItem={renderListItem ? renderListItem : renderRow}
      keyExtractor={item => item.id}
      ListHeaderComponent={InviteList}
    />
  );
}
