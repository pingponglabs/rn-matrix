import { Platform } from 'react-native';

export function isIos() {
  return Platform.OS === 'ios';
}

var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
export function htmlLinks(html) {
  return html ? html.replace(urlRegex, '<a href="$&">$&</a>') : html;
}

export function htmlUserTags(html) {
  return html ? html.replace(urlRegex, '<a href="$&"></a>') : html;
}
