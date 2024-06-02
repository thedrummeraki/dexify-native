import React, {Children, isValidElement} from 'react';
import {sharedStyles} from '@app/utils/styles';
import {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {Caption, Text, useTheme} from 'react-native-paper';
import {ItemWrapper, Navigatable, Toggle} from './Item';

interface BaseSettingsSectionWrapperProps {
  title?: string;
  subtitle?: string;
}

export type SettingsSectionWrapperProps =
  PropsWithChildren<BaseSettingsSectionWrapperProps>;

function useStyles() {
  const theme = useTheme();

  return StyleSheet.create({
    settingsWrapper: {
      backgroundColor: theme.colors.secondaryContainer,
    },
  });
}

function SettingsSectionWrapper({
  title,
  subtitle,
  children,
}: SettingsSectionWrapperProps) {
  const styles = useStyles();

  const titleMarkup = title ? <Text variant="titleMedium">{title}</Text> : null;
  const subtitleMarkup = subtitle ? <Caption>{subtitle}</Caption> : null;
  const childrenCount = Children.count(children);

  return (
    <View style={sharedStyles.container}>
      <View
        style={[
          sharedStyles.titleCaptionContainer,
          sharedStyles.noLeftPadding,
        ]}>
        {titleMarkup}
        {subtitleMarkup}
      </View>
      <View style={[styles.settingsWrapper, sharedStyles.roundBorders]}>
        {Children.map(children, (child, index) => {
          if (isValidElement(child)) {
            if (child.props.disabled) {
              return null;
            }

            return (
              <ItemWrapper
                first={index === 0}
                last={index >= childrenCount - 1}
                {...child.props}>
                {child}
              </ItemWrapper>
            );
          }
          return null;
        })}
      </View>
    </View>
  );
}

SettingsSectionWrapper.Navigatable = Navigatable;
SettingsSectionWrapper.Toggle = Toggle;

export default SettingsSectionWrapper;
