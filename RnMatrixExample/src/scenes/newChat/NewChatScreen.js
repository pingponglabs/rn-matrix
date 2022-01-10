import { RoomList } from '@rn-matrix/ui';
import RoomInviteItem from '@rn-matrix/ui/src/views/components/RoomInviteItem';
import React, { useRef,useState } from 'react';
import {Text, View,SafeAreaView,useColorScheme} from 'react-native';
import { colors } from '../../constants/colors';

export default function NewChatScreen() {
  const theme = useColorScheme()
  const inputToolbarRef = useRef(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const renderInviteRow = ({ item }) => {
    return <RoomInviteItem 
    key={item.id} 
    room={item}
    textColor={theme === 'dark' ? "#fff" : "#000"}
    backgroundColor={theme === 'dark' ? colors.dark.Background : colors.light.Background}
    selectedUsers={selectedUsers}   
    OnselectUser={(item) => selectUser(item)} 
    OnRemoveUser={(item) => removeSelected(item)} 
    />;
  };

  const selectUser = (user) => {
   
    const userIndex = selectedUsers.findIndex((u) => u.id === user.id);
    if (userIndex >= 0) {
      // found
      const newUsers = [...selectedUsers];
      newUsers.push(user);
      setSelectedUsers(newUsers);
    } else {
      // not selected
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeSelected = (user) => {
    const index = selectedUsers.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      const newUsers = [...selectedUsers];
      newUsers.splice(index, 1);
      setSelectedUsers(newUsers);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme == 'dark' ? colors.dark.Background : colors.light.Background}}>
      {/* <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}> */}
      <RoomList 
      renderListItem={renderInviteRow}
      />
    {/* </SafeAreaView> */}
    </View>
  );
}
