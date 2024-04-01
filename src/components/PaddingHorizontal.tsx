import {spacing as computeSpacing} from '@app/utils/styles';
import {PropsWithChildren} from 'react';
import {View, ViewProps} from 'react-native';

export type PaddingHorizontalProps = PropsWithChildren<{
  spacing?: number;
}> &
  ViewProps;

export default function PaddingHorizontal({
  spacing = 1,
  children,
  ...viewProps
}: PaddingHorizontalProps) {
  return (
    <View style={{paddingHorizontal: computeSpacing(spacing)}} {...viewProps}>
      {children}
    </View>
  );
}
