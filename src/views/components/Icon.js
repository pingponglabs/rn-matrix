import React from 'react';
import { ViewStyle } from 'react-native';
import * as Icons from '../../assets/icons';

type Props = {
  name: IconNames,
  size?: number,
  color?: string,
  style?: ViewStyle,
};

export default function Icon({ name, size = 24, color = '#000', style = {} }: Props) {
  const props = {
    width: size,
    height: size,
    fill: color,
    style,
  };
  switch (name) {
    case 'check':
      return <Icons.Check {...props} />;
    case 'check-circle':
      return <Icons.CheckCircle {...props} />;
    case 'circle':
      return <Icons.Circle {...props} />;
    case 'close':
      return <Icons.Close {...props} />;
    case 'lock':
      return <Icons.Lock {...props} />;
    case 'reply':
      return <Icons.Reply {...props} />;
    default:
      return <Icons.Check {...props} />;
  }
}

type IconNames = 'check' | 'check-circle' | 'circle' | 'close' | 'lock' | 'reply';
