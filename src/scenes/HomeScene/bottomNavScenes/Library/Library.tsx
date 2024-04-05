import {AllReadingStatusResponse, ReadingStatus} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useLazyGetRequest} from '@app/api/utils';
import {sharedStyles, spacing} from '@app/utils/styles';
import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {Chip, Text} from 'react-native-paper';
import LibraryMangaCollection from './LibraryMangaCollection';
import {useUserStore} from '@app/foundation/state/StaterinoProvider';

export default function Library() {
  const allReadingStatuses = Object.values(ReadingStatus);
  const [readingStatuses, setReadingStatuses] =
    useState<ReadingStatus[]>(allReadingStatuses);
  const [currentReadingStatus, setCurrentReadingStatus] = useState(
    ReadingStatus.Reading,
  );

  const handleReadingStatusSelection = (readingStatus: ReadingStatus) => {
    // setReadingStatuses((current) => {
    //   const unselected = current.filter(x => x !== readingStatus);
    //   return [readingStatus, ...unselected]
    // });
    setCurrentReadingStatus(readingStatus);
  };

  const [fetchReadingStatus, {data: mapping, loading, error}] =
    useLazyGetRequest<AllReadingStatusResponse>();

  useEffect(() => {
    fetchReadingStatus(UrlBuilder.readingStatusMangaIds(currentReadingStatus));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentReadingStatus]);

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
        mapping={mapping || {statuses: {}}}
      />
    </SafeAreaView>
  );
}

function readingStatusName(readingStatus: ReadingStatus) {
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
