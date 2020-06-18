// import { useTheme } from '@ui-kitten/components'
import React, { useEffect, useState } from 'react';
import { Linking, Text } from 'react-native';
import HtmlRenderer from 'react-native-render-html';
import { htmlEmojis } from '../../utilities/emojis';
import { htmlLinks } from '../../utilities/misc';

// const debug = require('debug')('ditto:scene:chat:message:components:Html')

const parseHtml = html => {
  return htmlEmojis(htmlLinks(html));
};

export default function Html({ html, isMe }) {
  // const styles = getHtmlStyles(theme)
  const styles = getHtmlStyles({ isMe });
  const [parsedHtml, setParsedHtml] = useState(parseHtml(html));

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************
  const onLinkPress = (e, link) => {
    if (link) {
      Linking.canOpenURL(link).then(() => {
        Linking.openURL(link);
      });
    }
  };

  const renderers = {
    emoji: { renderer: emojiRenderer, wrapper: 'Text' },
  };

  //* *******************************************************************************
  // Lifecycle
  //* *******************************************************************************
  useEffect(() => {
    if (html === parsedHtml) return;

    setParsedHtml(parseHtml(html));
  }, [html, parsedHtml]);

  console.log(parsedHtml);

  return parsedHtml ? (
    <HtmlRenderer html={parsedHtml} renderers={renderers} onLinkPress={onLinkPress} {...styles} />
  ) : null;
}

const emojiRenderer = (htmlAttribs, children, convertedCSSStyles, passProps) => (
  <Text key={passProps.key} style={{ fontFamily: 'NotoColorEmoji' }}>
    {children}
  </Text>
);

const getHtmlStyles = ({ isMe }) => ({
  baseFontStyle: {
    color: isMe ? '#fff' : '#222',
    fontSize: 16,
    letterSpacing: 0.3,
    fontWeight: '400',
  },
  tagsStyles: {
    blockquote: {
      borderLeftColor: 'red',
      borderLeftWidth: 3,
      paddingLeft: 10,
      marginVertical: 10,
      opacity: 0.8,
    },
    a: {
      color: isMe ? '#fff' : '#222',
      textDecorationLine: 'underline',
    },
  },
});
