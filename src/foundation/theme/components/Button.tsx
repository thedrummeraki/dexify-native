import React, {PropsWithChildren} from 'react';
import {
  StyleProp,
  TouchableNativeFeedback,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../ThemeProvider';
import {themeColorToString} from '../utils';
import Text from './Text';

export type ButtonFlavor = 'primary' | 'secondary' | 'accent';
export type ButtonSize = 'small' | 'medium' | 'large';

type ExtraButtonProps = {
  flavor?: ButtonFlavor;
  size?: ButtonSize;
  title?: string;
  onPress?(): void;
};

export type ButtonProps = Omit<ViewProps, 'color' | 'style'> &
  PropsWithChildren<ExtraButtonProps>;

export default function Button({
  flavor = 'primary',
  size = 'medium',
  title,
  children,
  onPress,
  ...props
}: ButtonProps) {
  const {
    color: {text: textColor},
  } = useTheme();
  const backgroundColorProfile = useColorFromFlavor(flavor);
  const backgroundColor = themeColorToString(backgroundColorProfile);
  const {margin, padding, ...typography} = useSizesFromButtonSize(size);

  const style: StyleProp<ViewStyle> = {
    backgroundColor,
    padding,
    margin,
    borderRadius: 4,
  };

  const childrenMarkup = title ? (
    <Text style={{color: themeColorToString(textColor), ...typography}}>
      {title}
    </Text>
  ) : (
    children
  );

  return (
    <View style={style} {...props}>
      <TouchableNativeFeedback useForeground onPress={onPress}>
        {childrenMarkup}
      </TouchableNativeFeedback>
    </View>
  );
}

const useColorFromFlavor = (flavor: ButtonFlavor) => {
  const {
    color: {primary, secondary, accent},
  } = useTheme();

  switch (flavor) {
    case 'accent':
      return accent;
    case 'primary':
      return primary;
    case 'secondary':
      return secondary;
  }
};

const useSizesFromButtonSize = (buttonSize: ButtonSize) => {
  const {
    spacing,
    typography: {text, subtitle, note},
  } = useTheme();

  if (buttonSize === 'large') {
    return {margin: spacing(1), padding: spacing(4), ...subtitle};
  }
  if (buttonSize === 'small') {
    return {margin: spacing(1), padding: spacing(1), ...note};
  }
  return {margin: spacing(1), padding: spacing(2), ...text};
};
