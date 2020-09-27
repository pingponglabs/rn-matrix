import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { matrix } from '@rn-matrix/core';

export default function ReadReceipts({ receipts, isMe = false }) {
  const user = matrix.getMyUser();
  return (
    <View style={[styles.wrapper, { justifyContent: isMe ? 'flex-end' : 'flex-start' }]}>
      {receipts
        .slice(0, 5)
        .filter((r) => r.userId !== user.id)
        .map((r) => {
          if (r.avatar) {
            return (
              <Image
                key={r.userId}
                source={{ uri: r.avatar }}
                style={[styles.circle, isMeStyle(isMe)]}
              />
            );
          } else {
            return (
              <View key={r.userId} style={[styles.circle, isMeStyle(isMe)]}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                  {r.name?.charAt(0) === '@'
                    ? r.name?.charAt(1)?.toUpperCase()
                    : r.name?.charAt(0)?.toUpperCase()}
                </Text>
              </View>
            );
          }
        })}
      {receipts.length > 5 && <Text style={isMeStyle(isMe)}>+{receipts.length - 5}</Text>}
    </View>
  );
}

const isMeStyle = (isMe) => ({
  marginRight: isMe ? 4 : 0,
  marginLeft: isMe ? 0 : 4,
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexWrap: 'wrap',
    marginBottom: 3,
  },
  circle: {
    width: 20,
    height: 20,
    marginBottom: 3,
    borderRadius: 40,
    backgroundColor: 'darkgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
