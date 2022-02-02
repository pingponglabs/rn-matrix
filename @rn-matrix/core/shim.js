import { randomBytes } from 'react-native-randombytes';

// implement window.getRandomValues(), for packages that rely on it
if (typeof window === 'object') {
  if (!window.crypto) window.crypto = {};
  if (!window.crypto.getRandomValues) {
    window.crypto.getRandomValues = function getRandomValues(arr) {
      let orig = arr;
      if (arr.byteLength != arr.length) {
        // Get access to the underlying raw bytes
        arr = new Uint8Array(arr.buffer);
      }
      const bytes = randomBytes(arr.length);
      for (var i = 0; i < bytes.length; i++) {
        arr[i] = bytes[i];
      }

      return orig;
    };
  }
}

// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
  protocol: 'file:',
  href: '',
};
