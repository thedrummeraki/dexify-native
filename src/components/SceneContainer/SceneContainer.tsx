import {useDexifyNavigation} from '@app/foundation/navigation';
import {useDimensions} from '@app/utils';
import {sharedStyles, spacing} from '@app/utils/styles';
import React, {PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Appbar, Caption, IconButton, Text, useTheme} from 'react-native-paper';

export interface SceneContainerHeaderProps {
  title?: string;
  subtitle?: string;
  headerIcon?: string;
  onBackPress?(): void;
  onDetailsPress?(): void;
}

export type SceneContainerProps = PropsWithChildren<
  SceneContainerHeaderProps & {canScroll?: boolean}
>;

export default function SceneContainer({
  children,
  canScroll,
  ...headerProps
}: SceneContainerProps) {
  const ContainerComponent = canScroll ? ScrollView : View;

  return (
    <View style={styles.root}>
      <Header {...headerProps} />
      <ContainerComponent style={[styles.container]}>
        {children}
      </ContainerComponent>
    </View>
  );
}

function Header({
  title,
  subtitle,
  headerIcon = 'close',
  onBackPress,
  onDetailsPress,
}: Omit<SceneContainerProps, 'children'>) {
  const navigation = useDexifyNavigation();
  const handleBackPress = () => {
    onBackPress?.();
    navigation.goBack();
  };

  const {width: screenWidth} = useDimensions();
  const iconSize = 24;

  // size + margin, padding, etc.
  const fullIconSize = iconSize + spacing(7.5);
  const widthOccupiedByIcons = [
    fullIconSize,
    onDetailsPress ? fullIconSize : 0,
  ].reduce((acc, value) => acc + value);

  const titleContainerWidth = screenWidth - widthOccupiedByIcons;

  const theme = useTheme();
  return (
    <Appbar.Header
      elevated
      theme={theme}
      style={[styles.header, {backgroundColor: theme.colors.surface}]}>
      <View style={styles.headerLeft}>
        <IconButton
          icon={headerIcon}
          size={iconSize}
          onPress={handleBackPress}
        />
        {title ? (
          <View
            style={[
              sharedStyles.container,
              sharedStyles.titleCaptionContainer,
              styles.headerTitleContainer,
              {width: titleContainerWidth},
            ]}>
            <Text numberOfLines={1} variant="titleMedium">
              {title}
            </Text>
            {subtitle ? <Caption numberOfLines={1}>{subtitle}</Caption> : null}
          </View>
        ) : null}
      </View>
      <View style={styles.headerRight}>
        {onDetailsPress ? (
          <IconButton
            icon="information-outline"
            size={iconSize}
            onPress={onDetailsPress}
          />
        ) : null}
      </View>
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  root: {display: 'flex', flex: 1},
  header: {display: 'flex', backgroundColor: 'transparent'},
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: spacing(0.5),
  },
  headerTitleContainer: {
    flexDirection: 'column',
  },
  headerRight: {flexShrink: 1, flexDirection: 'row-reverse'},
  container: {flex: 1},
});
