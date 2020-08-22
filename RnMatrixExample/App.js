import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/AppNavigator';
import {matrix} from '@rn-matrix/core';

const debug = require('debug');
debug.enable('rnm:*');

matrix.initAuth();

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

// const accessToken =
//   'MDAxOGxvY2F0aW9uIGRpdHRvLmNoYXQKMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDIzY2lkIHVzZXJfaWQgPSBAdGVzdDpkaXR0by5jaGF0CjAwMTZjaWQgdHlwZSA9IGFjY2VzcwowMDIxY2lkIG5vbmNlID0gLVZuX3RZVjJpRk80V2QsKwowMDJmc2lnbmF0dXJlIGYlwrKiStuijF4uaQ9KJStxRDueNHpAT3b74ZaZI-n_Cg';
// const deviceId = 'EBIPBHNMDO';

// const App = () => {
//   const isReady = useObservableState(matrix.isReady$());
//   const rooms = useObservableState(matrix.getRooms$());

//   const [room, setRoom] = useState(null);

//   useEffect(() => {
//     matrix.createClient(
//       'https://matrix.ditto.chat',
//       accessToken,
//       '@test:ditto.chat',
//       deviceId,
//     );
//     matrix.start(true);
//   }, []);

//   if (!isReady) {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   console.log('room', room?.messages$);

//   return (
//     <>
//       <SafeAreaView style={{flex: 1, backgroundColor: 'yellow'}}>
//         <Text style={{fontWeight: 'bold'}}>ROOMS</Text>
//         <ScrollView>
//           {rooms.map((room) => (
//             <Pressable
//               onPress={() => setRoom(room)}
//               style={({pressed}) => ({
//                 opacity: pressed ? 0.5 : 1,
//                 padding: 12,
//               })}>
//               <Text>{room.name$.getValue()}</Text>
//             </Pressable>
//           ))}
//         </ScrollView>
//       </SafeAreaView>
//       <SafeAreaView style={{flex: 1, backgroundColor: 'pink'}}>
//         <Text style={{fontWeight: 'bold'}}>
//           MESSAGES ({room ? room.messages$.getValue().length : 0})
//         </Text>
//         <ScrollView>
//           {room?.messages$?.getValue()?.map((msg) => {
//             const message = matrix.getMessageById(msg, room.id);
//             console.log('message', message);
//             return <Text>{message.content$?.getValue().text}</Text>;
//           })}
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };

// export default App;
