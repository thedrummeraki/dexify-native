import React, {useEffect, useState} from 'react';
import {Manga} from '@app/api/mangadex/types';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import SimpleMangaThumbnail from '../SimpleMangaThumbnail';

type ViewMode = 'view' | 'select';

export interface Props {
  mangaList: Manga[];
  loading?: boolean;
  onMangaPress?(manga: Manga): void;
  onEndReached?(): void;
}

export function MangaCollection({
  mangaList,
  loading,
  onMangaPress,
  onEndReached,
}: Props) {
  const [selectedMangaIds, setSelectedMangaIds] = useState<string[]>([]);
  const [mode, setMode] = useState<ViewMode>('view');

  const handleMangaSelection = (manga: Manga) => {
    setSelectedMangaIds(current => {
      if (selectedMangaIds.includes(manga.id)) {
        return current.filter(x => x !== manga.id);
      } else {
        return [...current, manga.id];
      }
    });
  };

  const handleMangaPress = (manga: Manga) => {
    if (mode === 'view') {
      onMangaPress?.(manga);
    } else {
      handleMangaSelection(manga);
    }
  };

  useEffect(() => {
    if (selectedMangaIds.length > 0) {
      setMode('select');
    } else {
      setMode('view');
    }
  }, [selectedMangaIds.length]);

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
      renderItem={({item}) => (
        <SimpleMangaThumbnail
          selected={selectedMangaIds.includes(item.id)}
          manga={item}
          onPress={handleMangaPress}
          onLongPress={handleMangaSelection}
        />
      )}
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
