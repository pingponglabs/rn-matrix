import { useObservableState } from 'observable-hooks';
import React from 'react';
import { EventStatus } from 'matrix-js-sdk';
import { Text, TouchableHighlight, View } from 'react-native';
import { SenderText, BubbleWrapper } from '../MessageItem';
import { isIos } from '../../../utilities/misc';
import { isEmoji } from '../../../utilities/emojis';
import Html from '../Html';
import { colors } from '../../../constants';
import Icon from '../Icon';
import { matrix } from '@rn-matrix/core';
import Color from 'color';

const debug = require('debug')('rnm:views:components:messageTypes:TextMessage');

export default function TextMessage({
  message,
  prevSame,
  nextSame,
  onPress,
  onLongPress,
  onSwipe,
  showReactions,
  myBubbleStyle,
  otherBubbleStyle,
  accentColor,
}) {
  const myUser = matrix.getMyUser();
  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);
  const status = useObservableState(message.status$);
  const reactions = useObservableState(message.reactions$);
  const props = { prevSame, nextSame };
  const isMe = myUser?.id === message.sender.id;

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************

  const _onLongPress = () => onLongPress(message);
  const _onPress = () => onPress(message);
  const _onSwipe = () => onSwipe(message);

  const getDefaultBackgroundColor = (me, pressed) => {
    return me
      ? pressed
        ? colors.blue500
        : colors.blue400
      : pressed
      ? colors.gray400
      : colors.gray300;
  };

  if (!content?.html) return null;
  return (
    <>
      <BubbleWrapper
        isMe={isMe}
        status={status}
        onSwipe={onSwipe ? _onSwipe : null}
        message={message}
        showReactions={showReactions}>
        {isEmoji(content?.text) ? (
          <Emoji style={!isIos() ? { fontFamily: 'NotoColorEmoji' } : {}} isMe={isMe} {...props}>
            {content.text}
          </Emoji>
        ) : (
          <View style={viewStyle(nextSame)}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <TouchableHighlight
                underlayColor={getDefaultBackgroundColor(isMe, true)}
                onPress={onPress ? _onPress : null}
                onLongPress={onLongPress ? _onLongPress : null}
                delayLongPress={200}
                style={[
                  bubbleStyles(isMe, prevSame, nextSame),
                  { backgroundColor: getDefaultBackgroundColor(isMe, false) },
                  reactions ? { alignSelf: isMe ? 'flex-end' : 'flex-start' } : {},
                  isMe ? myBubbleStyle() : otherBubbleStyle(),
                ]}
                {...props}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                  }}>
                  <Html html={content?.html} isMe={isMe} accentColor={accentColor} />
                  {isMe && (
                    <View style={{ marginLeft: 12, marginRight: -6 }}>
                      <Icon
                        name={status === EventStatus.SENDING ? 'circle' : 'check-circle'}
                        size={16}
                        color={
                          myBubbleStyle(false)?.backgroundColor
                            ? Color(myBubbleStyle(false).backgroundColor).darken(0.3).hex()
                            : Color(getDefaultBackgroundColor(isMe, false)).darken(0.3).hex()
                        }
                      />
                    </View>
                  )}
                </View>
              </TouchableHighlight>
            </View>
          </View>
        )}
      </BubbleWrapper>

      {!prevSame && <SenderText isMe={isMe}>{senderName}</SenderText>}
    </>
  );
}

const Emoji = ({ style, isMe, children }) => (
  <Text
    style={{
      ...style,
      fontSize: 45,
      marginHorizontal: 8,
      marginTop: isIos() ? 4 : -7,
      marginBottom: 4,
    }}>
    {children}
  </Text>
);

const sharpBorderRadius = 5;
const bubbleStyles = (isMe, prevSame, nextSame) => ({
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 18,
  ...(isMe
    ? {
        ...(prevSame ? { borderTopRightRadius: sharpBorderRadius } : {}),
        ...(nextSame ? { borderBottomRightRadius: sharpBorderRadius } : {}),
      }
    : {
        ...(prevSame ? { borderTopLeftRadius: sharpBorderRadius } : {}),
        ...(nextSame ? { borderBottomLeftRadius: sharpBorderRadius } : {}),
      }),
});

const viewStyle = (nextSame) => ({
  marginTop: 2,
  marginBottom: nextSame ? 1 : 4,
  maxWidth: '85%',
});
