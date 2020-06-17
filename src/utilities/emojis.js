import emojiRegex from 'emoji-regex';
import striptags from 'striptags';

import { isIos } from './misc';

export function isEmoji(str) {
  const text = striptags(str);
  if (text.match(emojiRegex())) {
    if (text.match(/[a-zA-Z0-9\t\s\w]/)) {
      return false;
    }
    return true;
  } else {
    return false;
  }
}

export function getEmojis(emojiIndex) {
  const emojis = [];
  for (const category of emojiIndex.data.categories) {
    for (const emojiName of category.emojis) {
      const emoji = emojiIndex.emojis[emojiName];
      if (!emoji) continue;
      if (emoji['1']) emojis.push(emoji['1']);
      else emojis.push(emoji);
    }
  }
  return emojis;
}

export function htmlEmojis(html) {
  if (isIos()) return html;
  return html.replace(emojiRegex(), '<emoji>$&</emoji>');
}
