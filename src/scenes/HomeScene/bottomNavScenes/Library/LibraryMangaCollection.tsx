import React from 'react';
import {
  AllReadingStatusResponse,
  ContentRating,
  ReadingStatus,
} from '@app/api/mangadex/types';
import {MangaSearchCollection} from '@app/components';
import {StyleSheet, View} from 'react-native';
import {ProgressBar, Text} from 'react-native-paper';

export interface LibraryMangaCollectionProps {
  loading?: boolean;
  readingStatus: ReadingStatus;
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
      override={{ids: mangaIds, contentRating: Object.values(ContentRating)}}
    />
  );
}

const styles = StyleSheet.create({
  emptyStateContainer: {flex: 1, alignItems: 'center'},
});
