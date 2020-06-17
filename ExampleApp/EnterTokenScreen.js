import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function EnterTokenScreen() {
  const [token, setToken] = useState('');
  return (
    <View style={styles.wrapper}>
      <Text>Enter Access Token</Text>
      <TextInput style={styles.input} autoFocus value={token} onChangeText={setToken} />
      <TouchableOpacity
        disabled={token.length === 0}
        style={[styles.button, { backgroundColor: token.length === 0 ? '#555' : 'dodgerblue' }]}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 120,
  },
  input: {
    backgroundColor: '#eee',
    padding: 12,
    width: '80%',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
