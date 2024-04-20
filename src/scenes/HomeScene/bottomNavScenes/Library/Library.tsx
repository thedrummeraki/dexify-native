import {ReadingStatus} from '@app/api/mangadex/types';
import {sharedStyles, spacing} from '@app/utils/styles';
import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {Chip, Text} from 'react-native-paper';
import LibraryMangaCollection from './LibraryMangaCollection';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {defaultLibraryStore} from '@app/foundation/state/library';
import {useSubscribedLibrary} from '@app/providers/LibraryProvider';

export default function Library() {
  const readingStatuses = Object.values(ReadingStatus);
  const [currentReadingStatus, setCurrentReadingStatus] = useState(
    ReadingStatus.Reading,
  );

  const {data: mapping, loading} = useStore(state => state.library);

  const handleReadingStatusSelection = (readingStatus: ReadingStatus) => {
    setCurrentReadingStatus(readingStatus);
  };

  return (
    <SafeAreaView style={[sharedStyles.flex]}>
      <View style={sharedStyles.container}>
        <Text variant="titleLarge">Library</Text>
        <FlatList
          horizontal
          data={readingStatuses}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
          renderItem={({item}) => (
            <Chip
              showSelectedCheck
              showSelectedOverlay
              selected={currentReadingStatus === item}
              onPress={() => handleReadingStatusSelection(item)}>
              {readingStatusName(item)}
            </Chip>
          )}
        />
      </View>
      <LibraryMangaCollection
        loading={loading}
        readingStatus={currentReadingStatus}
        mapping={mapping}
      />
    </SafeAreaView>
  );
}

export function readingStatusName(readingStatus: ReadingStatus) {
  switch (readingStatus) {
    case ReadingStatus.Reading:
      return 'Reading';
    case ReadingStatus.Completed:
      return 'Completed';
    case ReadingStatus.Dropped:
      return 'Dropped';
    case ReadingStatus.OnHold:
      return 'On Hold';
    case ReadingStatus.PlanToRead:
      return 'Plan to Read';
    case ReadingStatus.ReReading:
      return 'Re-reading';
  }
}

const styles = StyleSheet.create({
  root: {
    gap: spacing(1),
  },
  chipsWrapper: {
    flex: 0,
  },
  chipsContainer: {
    gap: spacing(1),
  },
});
