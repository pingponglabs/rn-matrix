import React from 'react';
import { useObservableState } from 'observable-hooks';
import { StyleSheet, TouchableHighlight, Image, View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Icon from './Icon';
import { hp, isX, normalize, wp } from '@rn-matrix/ui/src/Helper/responsiveScreen';
import { colors } from '@rn-matrix/ui/src/constants';

const avatarSize = wp(10);

export default function ChatHeader({
    room,
    textColor,
    onBackPress,
    backgroundHeaderColor
}) {
    const name = useObservableState(room.name$);
    const avatar = useObservableState(room.avatar$);
    const snippet = useObservableState(room.snippet$);
    const readState = useObservableState(room.readState$);

    return (

        <View style={{...styles.rowWrapper,backgroundColor: backgroundHeaderColor}}>
            <TouchableOpacity style={styles.phoneBtnStyle} onPress={onBackPress}>
                <Icon name='backWhite' size={30} color={textColor} />
            </TouchableOpacity>
            {avatar ? (
                <Image
                    source={room.getAvatarUrl(avatarSize) ? { uri: room.getAvatarUrl(avatarSize) } : {}}
                    style={styles.avatar}
                />
            ) : (
                <DefaultImage letter={name?.charAt(0)} />
            )}

            <View style={{ flex: 1, marginHorizontal: wp(4), justifyContent: 'space-between', flexDirection: 'row' }}>
                <View style={styles.textWrapper}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: wp(50) }}>
                        <Text style={{ ...styles.title, color: textColor }} numberOfLines={1}>
                            {name}
                        </Text>
                       
                        <Image source={require('../../assets/icons/whatsapp.png')} style={{ height: hp(3), width: wp(15), marginHorizontal: 5}} resizeMode='cover'></Image>

                    </View>
                    <Text style={styles.snippet} numberOfLines={2} ellipsizeMode="tail">
                        Online
                    </Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.phoneBtnStyle}>
                        <Icon name='phone' size={22} color={textColor} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.phoneBtnStyle}>
                        <Icon name='horizontaldots' size={22} color={textColor} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    );
}

const DefaultImage = ({ letter }) => (
    <View
        style={[
            styles.avatar,
            { backgroundColor: '#666', justifyContent: 'center', alignItems: 'center' },
        ]}>
        <Text style={styles.defaultAvatarLetter}>{letter?.toUpperCase()}</Text>
    </View>
);

const UnreadIndicator = () => <View style={styles.unreadIndicator} />;

const styles = StyleSheet.create({
    rowWrapper: {
        justifyContent:'center',
        alignItems:'center',
        flexDirection: 'row',
        paddingTop: isX? hp(6.5) : hp(5),
        paddingBottom: hp(2.5),
        // borderBottomColor: '#ccc',
        // borderBottomWidth: 0.5,
      

    },
    avatar: {
        width: wp(13),
        height: wp(13),
        borderRadius: wp(7),
        // marginHorizontal: wp(4),
        alignSelf: 'center',
    },
    textWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: normalize(14),
        width: wp(18),
       
    },
    snippet: {
        // maxWidth: 300,
        fontWeight: '500',
        fontSize: normalize(13),
        color: colors.gray3,
    },
    defaultAvatarLetter: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ddd',
    },
    unreadIndicator: {
        backgroundColor: 'dodgerblue',
        width: 16,
        height: 16,
        borderRadius: 40,
        alignSelf: 'flex-start',
        marginTop: 6,
    },
    phoneBtnStyle: {
        height: wp(12), width: wp(12), justifyContent: 'center', alignItems: 'center'
    }
});
