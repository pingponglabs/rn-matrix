import { useObservableState } from 'observable-hooks';
import React from 'react';
import { Text, StyleSheet } from 'react-native';

// const debug = require('debug')('rnm:scenes:chat:message:components:EventMessage')

export default function EventMessage({ message }) {
  const content = useObservableState(message.content$);
  return <Text style={styles.text}>{content?.text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: '#888',
    fontSize: 12,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
    marginHorizontal: 24,
    textAlign: 'center',
  },
});
