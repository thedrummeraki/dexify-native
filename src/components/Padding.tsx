import {spacing as computeSpacing} from '@app/utils/styles';
import {PropsWithChildren} from 'react';
import {View} from 'react-native';

export type PaddingProps = PropsWithChildren<{
  spacing?: number;
}>;

export default function Padding({spacing = 1, children}: PaddingProps) {
  return <View style={{padding: computeSpacing(spacing)}}>{children}</View>;
}
