import { Platform } from 'react-native';

export function isIos() {
  return Platform.OS === 'ios';
}
