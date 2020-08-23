import React, {useState} from 'react';
import {
  SafeAreaView,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import {matrix} from '@rn-matrix/core';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [homeserver, setHomeserver] = useState('');

  const handleUsernameChange = (text) => {
    if (text.charAt(0) === '@') {
      const domain = `https://${text.slice(text.lastIndexOf(':') + 1)}`;
      setHomeserver(domain);
    }
    setUsername(text);
  };

  const login = async () => {
    const result = await matrix.loginWithPassword(
      username,
      password,
      homeserver,
      true,
    );
    console.log(result);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={{alignSelf: 'center', marginTop: 24}}>
        the most vanilla basic matrix client you ever did see
      </Text>
      <ScrollView contentContainerStyle={{flex: 1, alignItems: 'center'}}>
        <Text style={styles.label}>Username or MXID</Text>
        <TextInput
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          placeholder="Username or MXID"
          value={username}
          onChangeText={handleUsernameChange}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.label}>Homeserver</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          placeholder="Homeserver"
          value={homeserver}
          onChangeText={setHomeserver}
        />
        <Pressable
          onPress={login}
          style={({pressed}) => [
            styles.input,
            styles.button,
            {opacity: pressed ? 0.5 : 1},
          ]}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
    color: 'dodgerblue',
    marginTop: 24,
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginBottom: 6,
  },
  input: {
    marginHorizontal: 24,
    height: 60,
    paddingHorizontal: 18,
    width: '90%',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'dodgerblue',
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'dodgerblue',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});