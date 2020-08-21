import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {matrix} from '@rn-matrix/core';
import RoomList from './src/views/RoomList';

const accessToken =
  'MDAxOGxvY2F0aW9uIGRpdHRvLmNoYXQKMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDIzY2lkIHVzZXJfaWQgPSBAdGVzdDpkaXR0by5jaGF0CjAwMTZjaWQgdHlwZSA9IGFjY2VzcwowMDIxY2lkIG5vbmNlID0gLVZuX3RZVjJpRk80V2QsKwowMDJmc2lnbmF0dXJlIGYlwrKiStuijF4uaQ9KJStxRDueNHpAT3b74ZaZI-n_Cg';
const deviceId = 'EBIPBHNMDO';

const App = () => {
  useEffect(() => {
    matrix.createClient(
      'https://matrix.ditto.chat',
      accessToken,
      '@test:ditto.chat',
      deviceId,
    );
    matrix.start(true);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <RoomList />
    </SafeAreaView>
  );
};

export default App;
