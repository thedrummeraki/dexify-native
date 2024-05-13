import {sharedStyles, spacing} from '@app/utils/styles';
import React, {ComponentProps} from 'react';
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';
import {Caption, IconButton, Text} from 'react-native-paper';

export type ItemsSectionProps<T> = {
  data: T[];
  title?: string;
  subtitle?: string;
  hideIfEmpty?: boolean;
  renderItem: ListRenderItem<T> | null | undefined;
  onViewMorePress?(): void;
} & Pick<
  ComponentProps<typeof FlatList<T>>,
  'ListEmptyComponent' | 'keyExtractor'
>;

export default function ItemsSection<T>({
  data,
  title,
  subtitle,
  hideIfEmpty,
  renderItem,
  onViewMorePress,
  ...flatListProps
}: ItemsSectionProps<T>) {
  if (data.length === 0 && hideIfEmpty) {
    return null;
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={[styles.titles, sharedStyles.titleCaptionContainer]}>
          {title ? <Text variant="titleMedium">{title}</Text> : null}
          {subtitle ? <Caption>{subtitle}</Caption> : null}
        </View>
        {onViewMorePress ? <IconButton icon="arrow-right" /> : null}
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        contentContainerStyle={{gap: spacing(1), padding: spacing(2)}}
        {...flatListProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flexDirection: 'column'},
  header: {
    flexDirection: 'row',
    marginHorizontal: spacing(2),
    alignItems: 'center',
  },
  titles: {flexDirection: 'column', flexGrow: 1},
});
