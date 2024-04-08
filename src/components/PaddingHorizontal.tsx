import { spacing as computeSpacing } from '@app/utils/styles';
import { PropsWithChildren } from 'react';
import { View, ViewProps } from 'react-native';

export type PaddingHorizontalProps = PropsWithChildren<{
  spacing?: number;
}> &
  ViewProps;

export default function PaddingHorizontal({
  spacing = 1,
  children,
  ...viewProps
}: PaddingHorizontalProps) {
  const style = Object.assign(viewProps.style || {}, {
    paddingHorizontal: computeSpacing(spacing),
  });

  return (
    <View style={style} {...viewProps}>
      {children}
    </View>
  );
}
