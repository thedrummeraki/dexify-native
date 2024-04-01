import React, {PropsWithChildren} from 'react';
import {Icon, Text, useTheme} from 'react-native-paper';
import {
  StyleProp,
  TextStyle,
  TouchableNativeFeedback,
  View,
  ViewStyle,
} from 'react-native';
import {MD3Colors} from 'react-native-paper/lib/typescript/types';
import {spacing} from '@app/utils/styles';

type BackgroundColor = keyof MD3Colors;

interface Props {
  content: React.ReactNode;
  numberOfLines?: number;
  fontSize?: number;
  background?: BackgroundColor;
  textColor?: BackgroundColor;
  icon?: string;
  disablePress?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function TextBadge({
  content,
  numberOfLines,
  fontSize = spacing(3),
  background = 'background',
  textColor,
  icon,
  style,
  textStyle,
  disablePress,
  onPress,
}: Props) {
  const theme = useTheme();
  const backgroundColor = theme.colors[background];
  const color = theme.colors[textColor || 'onSurface'];

  return (
    <View
      style={Object.assign(
        {
          paddingBottom: spacing(0.5),
          paddingTop: spacing(1),
          borderRadius: 5,
          backgroundColor,
        },
        style,
      )}>
      <MaybeTouchable
        onPress={disablePress ? undefined : onPress}
        backgroundColor={backgroundColor || theme.dark ? '#fff' : '#000'}>
        <Text
          numberOfLines={numberOfLines}
          style={Object.assign(
            {
              color,
              fontSize,
              paddingHorizontal: spacing(1),
            },
            textStyle,
          )}>
          {icon && (
            <>
              <Icon source={icon} size={fontSize} />{' '}
            </>
          )}
          {content}
        </Text>
      </MaybeTouchable>
    </View>
  );
}

function MaybeTouchable({
  onPress,
  backgroundColor,
  children,
}: PropsWithChildren<Pick<Props, 'onPress'>> & {backgroundColor: string}) {
  if (!onPress) {
    return <>{children}</>;
  }

  return (
    <TouchableNativeFeedback
      onPress={onPress}
      background={TouchableNativeFeedback.Ripple(backgroundColor, true)}>
      <View>{children}</View>
    </TouchableNativeFeedback>
  );
}
