// import { useTheme } from '@ui-kitten/components';
// import Color from 'color';
import { useObservableState } from 'observable-hooks';
import React from 'react';
// import styled from 'styled-components/native';

// import { getNameColor, isEmoji, isIos } from '../../../../utilities';
// import users from '../../../user/userService';
// import BubbleWrapper from './BubbleWrapper';
// import Html from './Html';
// import Reactions from './Reactions';
// import SenderText from './SenderText';

import users from '../../../services/user';
import { Text, TouchableHighlight } from 'react-native';
import { SenderText, BubbleWrapper } from '../MessageItem';
import { isIos } from '../../../utilities/misc';
import { isEmoji } from '../../../utilities/emojis';
import Html from '../Html';

// const debug = require('debug')('ditto:scene:chat:message:components:TextMessage')

export default function TextMessage({ message, prevSame, nextSame, onPress, onLongPress }) {
  const myUser = users.getMyUser();
  const content = useObservableState(message.content$);
  const senderName = useObservableState(message.sender.name$);
  const status = useObservableState(message.status$);
  const reactions = useObservableState(message.reactions$);
  const props = { prevSame, nextSame };
  const isMe = myUser.id === message.sender.id;

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************
  const toggleReaction = key => {
    message.toggleReaction(key);
  };

  const _onLongPress = () => onLongPress(message);
  const _onPress = () => onPress(message);

  if (!content?.html) return null;
  return (
    <>
      <BubbleWrapper isMe={isMe} status={status}>
        {isEmoji(content?.text) ? (
          <Emoji style={!isIos() ? { fontFamily: 'NotoColorEmoji' } : {}} isMe={isMe} {...props}>
            {content.text}
          </Emoji>
        ) : (
          <TouchableHighlight
            {...props}
            underlayColor={isMe ? '#2d5bc4' : '#bbb'}
            onPress={onPress ? _onPress : null}
            onLongPress={onLongPress ? _onLongPress : null}
            delayPressIn={0}
            delayLongPress={200}
            style={[
              bubbleStyles(isMe, prevSame, nextSame),
              { backgroundColor: isMe ? '#4375e9' : '#ddd' },
              reactions && reactions.length > 0 ? { marginBottom: 18 } : {},
            ]}>
            <>
              <Html html={content?.html} isMe={isMe} />
              {/* {reactions && (
                <Reactions
                  reactions={reactions}
                  toggleReaction={toggleReaction}
                  myUserId={myUser.id}
                  isMyBubble={isMe}
                />
              )} */}
            </>
          </TouchableHighlight>
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
  marginTop: 2,
  marginBottom: nextSame ? 1 : 4,
  borderRadius: 18,
  maxWidth: '85%',
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
