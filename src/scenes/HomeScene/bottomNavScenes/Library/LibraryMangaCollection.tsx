import React, {useMemo} from 'react';
import {
  AllReadingStatusResponse,
  ContentRating,
  LibraryStates,
} from '@app/api/mangadex/types';
import {MangaSearchCollection} from '@app/components';
import {StyleSheet, View} from 'react-native';
import {ProgressBar, Text} from 'react-native-paper';

export interface LibraryMangaCollectionProps {
  loading?: boolean;
  readingStatus: LibraryStates;
  mapping: AllReadingStatusResponse;
}

export default function LibraryMangaCollection({
  loading,
  readingStatus,
  mapping,
}: LibraryMangaCollectionProps) {
  const mangaIds = Object.entries(mapping?.statuses || [])
    .filter(([_, status]) => status === readingStatus)
    .map(([mangaId, _]) => mangaId);

  const contentRating = useMemo(() => ContentRating.defaultSFWValues(), []);

  if (loading) {
    return <ProgressBar indeterminate />;
  }

  if (mangaIds.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text>No manga added.</Text>
      </View>
    );
  }

  return (
    <MangaSearchCollection
      hidePreview
      hideSearchbar
      hideThumbnailInfo={['readingStatus']}
      override={{ids: mangaIds, contentRating}}
    />
  );
}

const styles = StyleSheet.create({
  emptyStateContainer: {flex: 1, alignItems: 'center'},
});
