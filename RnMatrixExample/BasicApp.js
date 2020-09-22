import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';

import {matrix} from '@rn-matrix/core';
import {RoomList, MessageList} from '@rn-matrix/ui';

const accessToken =
  'MDAxOGxvY2F0aW9uIGRpdHRvLmNoYXQKMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDIzY2lkIHVzZXJfaWQgPSBAdGVzdDpkaXR0by5jaGF0CjAwMTZjaWQgdHlwZSA9IGFjY2VzcwowMDIxY2lkIG5vbmNlID0gLVZuX3RZVjJpRk80V2QsKwowMDJmc2lnbmF0dXJlIGYlwrKiStuijF4uaQ9KJStxRDueNHpAT3b74ZaZI-n_Cg';
const deviceId = 'EBIPBHNMDO';
const homeserver = 'https://matrix.ditto.chat';
const mxid = '@test:ditto.chat';

const App = () => {
  const [room, setRoom] = useState(null);

  const handleRoomPress = (r) => {
    setRoom(r);
  };

  useEffect(() => {
    matrix.createClient(homeserver, accessToken, mxid, deviceId);
    matrix.start(true);
  }, []);

  if (room) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <MessageList room={room} enableComposer />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        <RoomList onRowPress={handleRoomPress} />
      </SafeAreaView>
    );
  }
};

export default App;
