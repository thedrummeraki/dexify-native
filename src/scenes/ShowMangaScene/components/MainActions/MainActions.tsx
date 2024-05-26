import React from 'react';
import {spacing} from '@app/utils/styles';
import {StyleSheet, View} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import {useMangaDetails} from '../MangaProvider';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {useDexifyNavigation} from '@app/foundation/navigation';
import {ReadingStatus} from '@app/api/mangadex/types';

function getReadingNowTextFrom(
  readingStatus: ReadingStatus | null | undefined,
): string {
  switch (readingStatus) {
    case ReadingStatus.Reading:
    case ReadingStatus.ReReading:
      return 'Continue reading...';
    case ReadingStatus.PlanToRead:
      return 'Start reading now...';
    default:
      return 'Read now...';
  }
}

export default function MainActions() {
  const navigation = useDexifyNavigation();
  const [library, mdLists, _user] = useStore([
    state => state.library.data,
    state => state.mdLists.data,
    state => state.user.user,
  ]);
  const {manga} = useMangaDetails();

  const readingStatus = library.statuses[manga.id];
  const addedToList = (mdLists[manga.id] || []).length > 0;
  const inLibrary = Boolean(readingStatus) || addedToList;

  const mainActionText = getReadingNowTextFrom(readingStatus);

  return (
    <View style={styles.root}>
      <View style={styles.minor}>
        {/* <IconButton
          disabled
          mode={addedToList ? 'contained' : 'outlined'}
          icon={addedToList ? 'cloud-download' : 'cloud-download-outline'}
          style={styles.icon}
        /> */}
        <IconButton
          mode={inLibrary ? 'contained' : 'outlined'}
          icon={inLibrary ? 'bookmark-check' : 'bookmark-outline'}
          style={styles.icon}
          onPress={() => navigation.push('ShowMangaLibraryModal', manga)}
        />
      </View>
      <View style={styles.major}>
        <Button
          mode="contained-tonal"
          icon="book-play"
          onPress={() => navigation.push('ShowMangaLibraryModal', manga)}>
          {mainActionText}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  minor: {
    flexDirection: 'row',
    flexShrink: 1,
    gap: spacing(2),
    marginLeft: spacing(2),
  },
  icon: {
    marginLeft: spacing(-2),
  },
  major: {
    flexGrow: 1,
  },
});
