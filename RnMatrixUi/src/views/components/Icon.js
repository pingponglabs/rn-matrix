import React from 'react';
import { ViewStyle } from 'react-native';
import * as Icons from '../../assets/icons';

type Props = {
  name: IconNames,
  size?: number,
  color?: string,
  style?: ViewStyle,
};

export default function Icon({ name, size = 24, color = '#000', style = {}, stroke}: Props) {
  const props = {
    width: size,
    height: size,
    fill: color,
    style,
    stroke
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
    case 'smile':
      return <Icons.smile {...props} />;
    case 'addfile':
      return <Icons.addfiles {...props} />;
    case 'expand':
      return <Icons.expand {...props} />;
    case 'send':
      return <Icons.send {...props} />;
    case 'audio':
      return <Icons.audio {...props} />;
    case 'camera':
      return <Icons.camera {...props} />;
    case 'gif':
      return <Icons.gif {...props} />;
    case 'horizontaldots':
      return <Icons.horizontaldots {...props} />;
    case 'phone':
      return <Icons.phone {...props} />;
    case 'backWhite':
      return <Icons.backWhite {...props} />;
    case 'Invite':
      return <Icons.Invite {...props} />;
      case 'Invited':
      return <Icons.Invited {...props} />;

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
  | 'reply'
  | 'smile'
  | 'addfile'
  | 'camera'
  | 'expand'
  | 'send'
  | 'audio'
  | 'gif'
  | 'phone'
  | 'backWhite'
  | 'horizontaldots';
