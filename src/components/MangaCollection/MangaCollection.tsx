import React from 'react';
import {Manga} from '@app/api/mangadex/types';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import SimpleMangaThumbnail from '../SimpleMangaThumbnail';

export interface Props {
  mangaList: Manga[];
  loading?: boolean;
  onEndReached?(): void;
}

export function MangaCollection({mangaList, loading, onEndReached}: Props) {
  return (
    <FlatList
      data={mangaList}
      numColumns={2}
      contentContainerStyle={styles.flatListContentContainer}
      columnWrapperStyle={styles.flatListColumnWrapper}
      style={styles.flatList}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      ListEmptyComponent={
        <View style={styles.flatListEmptyStateRoot}>
          <Text>{loading ? 'Please wait...' : 'No manga was found.'}</Text>
        </View>
      }
      renderItem={({item}) => <SimpleMangaThumbnail manga={item} />}
      keyExtractor={item => item.id}
    />
  );
}

const styles = StyleSheet.create({
  flatListContentContainer: {paddingHorizontal: 8, gap: 8},
  flatListColumnWrapper: {gap: 8},
  flatList: {flex: 1},
  flatListEmptyStateRoot: {flex: 1, alignItems: 'center'},
});
