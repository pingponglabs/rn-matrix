import React from 'react';
import * as Icons from '../../assets/icons';

type Props = {
  name?: IconNames,
  size?: number,
  color?: string,
};

export default function Icon({ name = 'check', size = 24, color = '#000' }: Props) {
  const props = {
    width: size,
    height: size,
    fill: color,
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
    default:
      return <Icons.Check {...props} />;
  }
}

type IconNames = 'check' | 'check-circle' | 'circle' | 'close';
