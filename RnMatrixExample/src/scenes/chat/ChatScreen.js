import React, {useState} from 'react';
import {View, Text, Pressable} from 'react-native';
import {MessageList} from '@rn-matrix/ui';
import ActionSheet from '../../components/ActionSheet';

export default function ChatScreen({navigation, route}) {
  const {room} = route.params;
  if (!room) navigation.goBack();

  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const onLongPress = (message) => {
    setSelectedMessage(message);
    setActionSheetVisible(true);
  };

  const onSwipe = (message) => {
    setSelectedMessage(message);
    setIsReplying(true);
  };

  const onEndEdit = () => {
    setIsEditing(null);
    setSelectedMessage(null);
  };

  const onCancelReply = () => {
    setIsReplying(null);
    setSelectedMessage(null);
  };

  const editMessage = () => {
    setActionSheetVisible(false);
    setIsEditing(true);
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <MessageList
          room={room}
          enableComposer
          enableReplies
          showReactions
          selectedMessage={selectedMessage}
          isEditing={isEditing}
          isReplying={isReplying}
          onSwipe={onSwipe}
          onLongPress={onLongPress}
          onEndEdit={onEndEdit}
          onCancelReply={onCancelReply}
        />
      </View>
      <ActionSheet
        visible={actionSheetVisible}
        gestureEnabled={false}
        innerScrollEnabled={false}
        style={{minHeight: 100, padding: 24, paddingBottom: 48}}
        onClose={() => setActionSheetVisible(false)}>
        <Pressable
          onPress={editMessage}
          style={({pressed}) => ({
            backgroundColor: pressed ? 'lightgray' : '#fff',
            padding: 12,
            borderRadius: 8,
          })}>
          <Text style={{color: 'dodgerblue', fontWeight: 'bold', fontSize: 16}}>
            Edit Message
          </Text>
        </Pressable>
      </ActionSheet>
    </>
  );
}
