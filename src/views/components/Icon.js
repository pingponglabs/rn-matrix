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
    case 'add':
      return <Icons.Add {...props} />;
    case 'attach':
      return <Icons.Attach {...props} />;
    case 'check':
      return <Icons.Check {...props} />;
    case 'check-circle':
      return <Icons.CheckCircle {...props} />;
    case 'circle':
      return <Icons.Circle {...props} />;
    case 'close':
      return <Icons.Close {...props} />;
    case 'download':
      return <Icons.Download {...props} />;
    case 'file':
      return <Icons.File {...props} />;
    case 'image':
      return <Icons.Image {...props} />;
    case 'lock':
      return <Icons.Lock {...props} />;
    case 'reply':
      return <Icons.Reply {...props} />;
    default:
      return <Icons.Check {...props} />;
  }
}

type IconNames =
  | 'add'
  | 'attach'
  | 'check'
  | 'check-circle'
  | 'circle'
  | 'close'
  | 'download'
  | 'file'
  | 'image'
  | 'lock'
  | 'reply';
