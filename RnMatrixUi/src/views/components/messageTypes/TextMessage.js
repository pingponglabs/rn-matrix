import { useObservableState } from 'observable-hooks';
import React from 'react';
import { Text, TouchableHighlight, View,useColorScheme } from 'react-native';
import { SenderText, BubbleWrapper } from '../MessageItem';
import { isIos } from '../../../utilities/misc';
import { isEmoji } from '../../../utilities/emojis';
import Html from '../Html';
import { matrix } from '@rn-matrix/core';
import LinearGradient from 'react-native-linear-gradient';
import Moment from 'moment';
import { DateFormate, TimeFormate } from '@rn-matrix/ui/src/Helper/constantString';

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
  textColor,
  fontWeight
}) {
  const theme = useColorScheme();
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

  console.log('timeobj..',message.timestamp);
  const getDefaultGradientBackgroundColor = (me, pressed) => {
    return me
      ? myBubbleStyle().gradientColor
      : otherBubbleStyle().gradientColor
  };

  if (!content?.html) return null;
  
  var dateTime = new Date(parseInt(message?.timestamp, 10));

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
                underlayColor='transparent' //{getDefaultBackgroundColor(isMe, true)}
                onPress={onPress ? _onPress : null}
                onLongPress={onLongPress ? _onLongPress : null}
                delayLongPress={200}
                style={[
                  (!isMe && theme == 'dark' ? { borderColor: '#00FFA3', backgroundColor: '#000'} : {}),
                  (!isMe && theme == 'dark' ? {borderRadius: 16,borderWidth: 4} : {}),
                    (isMe ? {borderTopRightRadius: 5} : {borderTopLeftRadius: 5 }),
                  reactions ? { alignSelf: isMe ? 'flex-end' : 'flex-start' } : {},
                  isMe ? myBubbleStyle() : otherBubbleStyle(),
                ]}
                {...props}>
                <LinearGradient colors={getDefaultGradientBackgroundColor(isMe, true)} style={{...bubbleStyles(isMe, prevSame, nextSame),padding: 10}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      flexWrap: 'wrap',
                    }}>
                    <Html html={content?.html} isMe={isMe} accentColor={accentColor} color={textColor} fontWeight={fontWeight}/>
                    <Text style={{color: theme == 'dark' ? 'white' : '#696969', fontSize: 11, fontWeight: '700', marginLeft: 10, alignSelf:'flex-end',paddingVertical:5}}>{Moment(dateTime).format(TimeFormate)}</Text>
                    {/* {isMe && (
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
                    )} */}
                  </View>
                </LinearGradient>
              </TouchableHighlight>
            </View>
          </View>
        )}
      </BubbleWrapper>
      {!prevSame && <SenderText isMe={isMe} color={textColor}>{Moment(dateTime).format(DateFormate).toLocaleUpperCase()}</SenderText>}
    </>
  );
}

const Emoji = ({ style, isMe, children }) => (
  <Text
    style={{
      ...style,
      fontSize: 45,
      marginHorizontal: 8,
      marginTop: isIos() ? 20 : -7,
      marginBottom: 4,
    }}>
    {children}
  </Text>
);

const sharpBorderRadius = 5;
const bubbleStyles = (isMe, prevSame, nextSame) => ({
  paddingHorizontal: 16,
  paddingVertical: isMe ? 10 : 8,
  borderRadius: 16,
  ...(isMe ? {borderTopRightRadius: 5} : {borderTopLeftRadius: 5 }),
  // ...(isMe
  //   ? {
  //     ...(prevSame ? { borderTopRightRadius: sharpBorderRadius } : {}),
  //     ...(nextSame ? { borderBottomRightRadius: sharpBorderRadius } : {}),
  //   }
  //   : {
  //     ...(prevSame ? { borderTopLeftRadius: sharpBorderRadius} : {}),
  //     ...(nextSame ? { borderBottomLeftRadius: sharpBorderRadius} : {}),
  //   }),
    
});

const viewStyle = (nextSame) => ({
  marginTop: 20,
  marginBottom: nextSame ? 1 : 4,
  maxWidth: '85%',
});
