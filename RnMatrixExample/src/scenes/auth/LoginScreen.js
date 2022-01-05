import React, {useState, useEffect} from 'react';
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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (text) => {
    // if (text.charAt(0) === '@') {
    //   const domain = `https://matrix.${text.slice(text.lastIndexOf(':') + 1)}`;
    //   setHomeserver(domain);
    // }
    setUsername(text);
  };

  const login = async () => {
    setLoading(true);
    const result = await matrix.loginWithPassword(
      username,
      password,
      homeserver,
      true,
    );
    if (result.error) {
      setLoading(false);
      console.log('Error logging in: ', result);
      setError(result.message);
    }
  };

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [username, password, homeserver, error]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={{alignSelf: 'center', marginTop: 24}}>
        the most vanilla basic matrix client you ever did see
      </Text>
      <ScrollView
        contentContainerStyle={{flex: 1, alignItems: 'center'}}
        keyboardShouldPersistTaps="handled">
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
          onSubmitEditing={login}
        />
        {error && error.length > 0 && (
          <Text
            style={{
              marginTop: 24,
              color: 'red',
              textAlign: 'center',
              width: '70%',
            }}>
            {error}
          </Text>
        )}
        <Pressable
          onPress={login}
          disabled={loading}
          style={({pressed}) => [
            styles.input,
            styles.button,
            {opacity: pressed || loading ? 0.5 : 1},
          ]}>
          <Text style={styles.buttonText}>
            {loading ? 'LOADING...' : 'LOGIN'}
          </Text>
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
