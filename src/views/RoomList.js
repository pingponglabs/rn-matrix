import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import matrix from '../services/matrix';
import chatService from '../services/chat';
import { useObservableState } from 'observable-hooks';
import RoomListItem from './components/RoomListItem';

type Props = {
  renderListItem?: (props: any) => JSX.Element | null,
  onRowPress?: Function,
};

export default function RoomList({ renderListItem = null, onRowPress = () => {} }: Props) {
  const chatList = useObservableState(chatService.getChats());
  const isReady = useObservableState(matrix.isReady$());
  const isSynced = useObservableState(matrix.isSynced$());

  const renderRow = ({ item }) => {
    return <RoomListItem room={item} onPress={onRowPress} />;
  };

  if (!isReady || !isSynced) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <FlatList data={chatList} renderItem={renderListItem ? renderListItem : renderRow} />;
}
