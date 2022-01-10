import React, {useState} from 'react';
import {View, Text, Pressable, StatusBar, useColorScheme} from 'react-native';
import {MessageList} from '@rn-matrix/ui';
import ActionSheet from '../../components/ActionSheet';
import {useHeaderHeight} from '@react-navigation/stack';
import EmojiButtons from './components/EmojiButtons';
import ImagePicker from 'react-native-image-picker';
import getUid from 'get-uid';
import DocumentPicker from 'react-native-document-picker';
import { colors } from '../../constants/colors';

export default function ChatScreen({navigation, route}) {
  const {room} = route.params;
  if (!room) navigation.goBack();

  const headerHeight = useHeaderHeight();
  const theme = useColorScheme();
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [moreactionSheetVisible, setMoreActionSheetVisible] = useState(false);
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
  
  const fileMessage = () => {
  
    DocumentPicker.pick({}).then((res) => {
      if (res) {
        console.log('file response',res)
        room.sendMessage(res, 'm.file');
        setMoreActionSheetVisible(false);
      }
    });
   
  };

  const videoMessage = () => {
  
    const options = {
      mediaType: 'video',// 'mixed',
      allowsEditing: true,
    };
    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) return;
      console.log('response',response)
      room.sendMessage({...response, type: 'video/mov', name: `${getUid()}.mov`}, 'm.video');
      setMoreActionSheetVisible(false);
    });
   
  };

  const onMorePress = () => {
    setMoreActionSheetVisible(true);
  };

  const onBackPress = () => {
    navigation.goBack();
  }
  return (
    <>
      <View style={{flex: 1, backgroundColor: theme == 'dark' ? colors.dark.backgroundColor : colors.light.backgroundColor}}>
        <MessageList
          room={room}
          keyboardOffset={headerHeight + StatusBar.currentHeight}
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
          onMorepress={onMorePress}
          onBackPress={onBackPress}
          myBubbleStyle={(pressed) => ({
            gradientColor: theme === 'dark' ? colors.dark.megradient : colors.light.megradient
          })}
          otherBubbleStyle={(pressed) => ({
            gradientColor: theme === 'dark' ? colors.dark.othergradient : colors.light.othergradient,
          })}
          // accentColor="orange"
          textColor={theme === 'dark' ? "#fff" : "#000"}
          fontWeight={theme === 'dark' ? '600' : '400'}
          composerStyle={{ backgroundColor: theme === 'dark' ? 
          colors.dark.ComposerBackground : 
          colors.light.ComposerBackground }}
          backgroundHeaderColor={ theme === 'dark' ? 'black' : 'white'}
          
        />
      </View>
      <ActionSheet
        visible={actionSheetVisible}
        gestureEnabled={false}
        innerScrollEnabled={false}
        style={{minHeight: 100, padding: 24, paddingBottom: 48,backgroundColor:theme === 'dark' ? 'black' : 'white'}}
        onClose={() => setActionSheetVisible(false)}>
        <EmojiButtons
          message={selectedMessage}
          setActionSheetVisible={setActionSheetVisible}
          setSelectedMessage={setSelectedMessage}
        />
        <Pressable
          onPress={editMessage}
          style={({pressed}) => ({
            backgroundColor: pressed ? 'lightgray' : theme === 'dark' ? 'black' : 'white',
            padding: 12,
            borderRadius: 8,
          })}>
          <Text style={{color: 'dodgerblue', fontWeight: 'bold', fontSize: 16}}>
            Edit Message
          </Text>
        </Pressable>
      </ActionSheet>
      <ActionSheet
        visible={moreactionSheetVisible}
        gestureEnabled={false}
        innerScrollEnabled={false}
        style={{minHeight: 100, padding: 24, paddingBottom: 48,backgroundColor:theme === 'dark' ? 'black' : 'white'}}
        onClose={() => setMoreActionSheetVisible(false)}>
        <Pressable
          onPress={videoMessage}
          style={({pressed}) => ({
            backgroundColor: pressed ? 'lightgray' : theme === 'dark' ? 'black' : 'white',
            padding: 12,
            borderRadius: 8,
          })}>
          <Text style={{color: 'dodgerblue', fontWeight: 'bold', fontSize: 16}}>
            choose Video
          </Text>
        </Pressable>

        <Pressable
          onPress={fileMessage}
          style={({pressed}) => ({
            backgroundColor: pressed ? 'lightgray' : theme === 'dark' ? 'black' : 'white',
            padding: 12,
            borderRadius: 8,
          })}>
          <Text style={{color: 'dodgerblue', fontWeight: 'bold', fontSize: 16}}>
            choose file
          </Text>
        </Pressable>
      </ActionSheet>
    </>
  );
}
