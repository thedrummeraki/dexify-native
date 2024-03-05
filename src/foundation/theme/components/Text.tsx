import React from 'react';
import {Text as ReactNativeText, TextProps} from 'react-native';
import {useTheme} from '../ThemeProvider';
import {themeColorToString} from '../utils';

export default function Text({children, style, ...props}: TextProps) {
  const {
    color: {text},
  } = useTheme();

  const overrideStyle = Object.assign(
    {
      color: themeColorToString(text),
    },
    style,
  );
  return (
    <ReactNativeText style={overrideStyle} {...props}>
      {children}
    </ReactNativeText>
  );
}
