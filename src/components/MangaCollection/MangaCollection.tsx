import React, {useEffect, useState} from 'react';
import {Manga, ReadingStatus} from '@app/api/mangadex/types';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import SimpleMangaThumbnail from '../SimpleMangaThumbnail';
import {spacing} from '@app/utils/styles';
import {useSubscribedLibrary} from '@app/providers/LibraryProvider';
import {VisibleThumbnailInfo} from '../SimpleMangaThumbnail/SimpleMangaThumbnail';

type ViewMode = 'view' | 'select';

export interface Props {
  mangaList: Manga[];
  loading?: boolean;
  numColumns?: number;
  hideThumbnailInfo?: VisibleThumbnailInfo[];
  onMangaPress?(manga: Manga): void;
  onEndReached?(): void;
}

export function MangaCollection({
  mangaList,
  loading,
  numColumns = 2,
  hideThumbnailInfo,
  onMangaPress,
  onEndReached,
}: Props) {
  const [selectedMangaIds, setSelectedMangaIds] = useState<string[]>([]);
  const [mode, setMode] = useState<ViewMode>('view');
  const {data: library} = useSubscribedLibrary();

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

  useEffect(() => {
    return () => {
      // unselect mangas when unmounted.
      setSelectedMangaIds([]);
    };
  }, []);

  if (numColumns < 1) {
    throw new Error('Must at least have on column');
  }

  return (
    <FlatList
      data={mangaList}
      numColumns={numColumns}
      contentContainerStyle={styles.contentContainer}
      columnWrapperStyle={styles.columnWrapper}
      style={styles.root}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      ListEmptyComponent={
        <View style={styles.emptyStateRoot}>
          <Text>{loading ? 'Please wait...' : 'No manga was found.'}</Text>
        </View>
      }
      renderItem={({item}) => (
        <View style={{flex: 1 / numColumns}}>
          <SimpleMangaThumbnail
            selected={selectedMangaIds.includes(item.id)}
            manga={item}
            onPress={handleMangaPress}
            onLongPress={handleMangaSelection}
            hideThumbnailInfo={hideThumbnailInfo}
            info={{readingStatus: library.statuses[item.id]}}
          />
        </View>
      )}
      keyExtractor={item => item.id}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {paddingHorizontal: 8, gap: 8},
  columnWrapper: {gap: 8, marginBottom: spacing(1)},
  root: {flex: 1},
  emptyStateRoot: {flex: 1, alignItems: 'center'},
});
