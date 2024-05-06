import {spacing as computeSpacing} from '@app/utils/styles';
import React, {PropsWithChildren} from 'react';
import {View, ViewProps} from 'react-native';

export type PaddingHorizontalProps = PropsWithChildren<{
  spacing?: number;
}> &
  ViewProps;

export default function PaddingHorizontal({
  spacing = 1,
  children,
  style,
  ...viewProps
}: PaddingHorizontalProps) {
  const overridenStyle = Object.assign(
    {
      paddingHorizontal: computeSpacing(spacing),
    },
    style,
  );

  return (
    <View style={overridenStyle} {...viewProps}>
      {children}
    </View>
  );
}
