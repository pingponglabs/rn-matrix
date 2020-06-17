// import { StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { useObservableState } from 'observable-hooks';
import React from 'react';
import { Text } from 'react-native';

// const debug = require('debug')('ditto:scenes:chat:message:components:EventMessage')

export default function EventMessage({ message }) {
  // const styles = useStyleSheet(themedStyles);
  const content = useObservableState(message.content$);
  return <Text>{content?.text}</Text>;
}

// const themedStyles = StyleService.create({
//   text: {
//     color: 'text-hint-color',
//     fontSize: 12,
//     alignSelf: 'center',
//     marginTop: 8,
//     marginBottom: 4,
//     marginHorizontal: 24,
//     textAlign: 'center',
//   },
// });
