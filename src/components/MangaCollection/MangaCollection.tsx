import React, {useEffect, useState} from 'react';
import {Artist, Author, Manga} from '@app/api/mangadex/types';
import {FlatList, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Text} from 'react-native-paper';
import SimpleMangaThumbnail from '../SimpleMangaThumbnail';
import {spacing} from '@app/utils/styles';
import {useSubscribedLibrary} from '@app/providers/LibraryProvider';
import {VisibleThumbnailInfo} from '../SimpleMangaThumbnail/SimpleMangaThumbnail';
import {findRelationship} from '@app/api/mangadex/utils';

type ViewMode = 'view' | 'select';

export interface Props {
  mangaList: Manga[];
  loading?: boolean;
  numColumns?: number;
  hideThumbnailInfo?: VisibleThumbnailInfo[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  onMangaPress?(manga: Manga): void;
  onEndReached?(): void;
}

export function MangaCollection({
  mangaList,
  loading,
  numColumns = 2,
  hideThumbnailInfo,
  contentContainerStyle,
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
      contentContainerStyle={Object.assign(
        {...styles.contentContainer},
        contentContainerStyle,
      )}
      columnWrapperStyle={styles.columnWrapper}
      style={styles.root}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      ListEmptyComponent={
        <View style={styles.emptyStateRoot}>
          <Text>
            {loading
              ? 'Please wait...'
              : 'No manga was found with the current filters.'}
          </Text>
        </View>
      }
      renderItem={({item}) => {
        const by =
          findRelationship<Author>(item, 'author') ||
          findRelationship<Artist>(item, 'artist');
        const byName = by?.attributes.name;

        return (
          <View style={{flex: 1 / numColumns}}>
            <SimpleMangaThumbnail
              selected={selectedMangaIds.includes(item.id)}
              manga={item}
              subtitle={byName}
              onPress={handleMangaPress}
              onLongPress={handleMangaSelection}
              hideThumbnailInfo={hideThumbnailInfo}
              info={{readingStatus: library.statuses[item.id]}}
            />
          </View>
        );
      }}
      keyExtractor={item => item.id}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {paddingHorizontal: spacing(2), gap: spacing(2)},
  columnWrapper: {gap: spacing(2), marginBottom: spacing(1)},
  root: {flex: 1},
  emptyStateRoot: {flex: 1, alignItems: 'center'},
});
