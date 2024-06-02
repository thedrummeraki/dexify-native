import {
  ReadingStatus,
  OtherReadingStatuses,
  LibraryStates,
} from '@app/api/mangadex/types';
import {sharedStyles, spacing} from '@app/utils/styles';
import React, {useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {Chip, Text} from 'react-native-paper';
import LibraryMangaCollection from './LibraryMangaCollection';
import {useStore} from '@app/foundation/state/StaterinoProvider';

export default function Library() {
  const readingStatuses = Object.values(ReadingStatus);
  const otherReadingStatuses: Array<ReadingStatus | OtherReadingStatuses> =
    Object.values(OtherReadingStatuses);
  const allReadingStatus = otherReadingStatuses.concat(readingStatuses);

  const [currentReadingStatus, setCurrentReadingStatus] =
    useState<LibraryStates>(ReadingStatus.Reading);

  const {data: mapping, loading} = useStore(state => state.library);
  const allStatuses = Object.values(mapping.statuses).flat();

  const handleReadingStatusSelection = (readingStatus: LibraryStates) => {
    setCurrentReadingStatus(readingStatus);
  };

  return (
    <SafeAreaView style={[sharedStyles.flex]}>
      <View style={sharedStyles.container}>
        <View style={[sharedStyles.aCenter, sharedStyles.row]}>
          <Text variant="headlineMedium">Library</Text>
        </View>
        <FlatList
          horizontal
          data={allReadingStatus}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
          renderItem={({item}) => (
            <Chip
              showSelectedCheck
              showSelectedOverlay
              selected={currentReadingStatus === item}
              onPress={() => handleReadingStatusSelection(item)}>
              {readingStatusName(item)} (
              {
                allStatuses.filter(status => String(status) === String(item))
                  .length
              }
              )
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

export function readingStatusName(readingStatus: LibraryStates) {
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
    case OtherReadingStatuses.MdLists:
      return 'MdLists';
    // case OtherReadingStatuses.Downloads:
    //   return 'Downloads';
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
