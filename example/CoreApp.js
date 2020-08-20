/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {View, SafeAreaView, Text, ActivityIndicator} from 'react-native';
import {useObservableState} from 'observable-hooks';

import {matrix} from './packages/core';

const accessToken =
  'MDAxOGxvY2F0aW9uIGRpdHRvLmNoYXQKMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDIzY2lkIHVzZXJfaWQgPSBAdGVzdDpkaXR0by5jaGF0CjAwMTZjaWQgdHlwZSA9IGFjY2VzcwowMDIxY2lkIG5vbmNlID0gLVZuX3RZVjJpRk80V2QsKwowMDJmc2lnbmF0dXJlIGYlwrKiStuijF4uaQ9KJStxRDueNHpAT3b74ZaZI-n_Cg';
const deviceId = 'EBIPBHNMDO';

const App: () => React$Node = () => {
  const isReady = useObservableState(matrix.isReady$());
  const rooms = useObservableState(matrix.getRooms());

  useEffect(() => {
    matrix.createClient(
      'https://matrix.ditto.chat',
      accessToken,
      '@test:ditto.chat',
      deviceId,
    );
    matrix.start(true);
  }, []);

  console.log('rooms!', rooms);

  if (!isReady) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        {rooms.map((room, i) => (
          <View key={i}>
            <Text>{room.name$.getValue()}</Text>
          </View>
        ))}
      </SafeAreaView>
      <SafeAreaView
        style={{flex: 1, borderTopWidth: 4, borderTopColor: '#000'}}>
        {rooms.map((room, i) => (
          <View key={i}>
            <Text>{room.name$.getValue()}</Text>
          </View>
        ))}
      </SafeAreaView>
    </>
  );
};
export default App;
