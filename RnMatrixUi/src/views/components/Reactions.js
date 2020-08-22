import React from 'react';

import { StyleSheet, View, Text, TouchableHighlight, Platform } from 'react-native';
import { colors } from '../../constants';

export default function Reactions({ reactions, toggleReaction, myUserId, isMyBubble }) {
  return (
    <View style={[styles.wrapper, { flexDirection: isMyBubble ? 'row-reverse' : 'row' }]}>
      {Object.keys(reactions).map(key => {
        const isSelected = !!reactions[key][myUserId];
        const selectedStyle = {
          backgroundColor: colors.blue400,
          borderWidth: 1.8,
          borderColor: colors.blue600,
        };
        const toggle = () => toggleReaction(key);
        return (
          <TouchableHighlight key={key} onPress={toggle} style={styles.button}>
            <View style={[styles.buttonContent, isSelected ? selectedStyle : {}]}>
              <Text
                style={
                  Platform.OS === 'android'
                    ? {
                        // fontFamily: 'NotoColorEmoji',
                        marginTop: -5,
                      }
                    : {}
                }>
                {key}
              </Text>
              <Text
                style={{
                  color: isSelected ? colors.white : colors.gray900,
                  fontSize: 16,
                  marginTop: Platform.OS !== 'ios' ? -5 : null,
                }}>
                &nbsp;{`${Object.keys(reactions[key]).length}`}
              </Text>
            </View>
          </TouchableHighlight>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    zIndex: 2,
    flexWrap: 'wrap',
    marginTop: 6,
    marginBottom: 8,
  },
  button: {
    width: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderRadius: 30,
    overflow: 'hidden',
    marginHorizontal: 2,
  },
  buttonContent: {
    backgroundColor: colors.gray300,
    width: 50,
    height: 30,
    paddingTop: 2,
    borderRadius: 30,
    borderWidth: 0.6,
    borderColor: '#00000050',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
