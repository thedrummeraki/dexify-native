import {spacing} from '@app/utils/styles';
import React from 'react';
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';

export interface HomeSectionProps<T> {
  data: T[];
  title?: string;
  subtitle?: string;
  vertical?: boolean;
  renderItem: ListRenderItem<T>;
}

export default function HomeSection<T>({
  data,
  title,
  subtitle,
  vertical,
  renderItem,
}: HomeSectionProps<T>) {
  const {
    colors: {secondary: subtitleColor},
  } = useTheme();

  return (
    <View style={styles.root}>
      <View style={styles.titleContainer}>
        {title ? <Text variant="titleLarge">{title}</Text> : null}
        {subtitle ? (
          <Text variant="titleSmall" style={{color: subtitleColor}}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <FlatList
        horizontal={!vertical}
        data={data}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContentContainer}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {marginBottom: spacing(0.5), marginTop: spacing(0.5)},
  titleContainer: {padding: spacing(2)},
  flatListContentContainer: {
    gap: spacing(2),
    marginLeft: spacing(2),
    paddingRight: spacing(4),
  },
});
