import {Button, Text} from 'react-native-paper';
import {
  CoverSize,
  mangaImage,
  preferredMangaTitle,
} from '@app/api/mangadex/utils';
import {useShowMangaDetailsModalRoute} from '@app/foundation/navigation';
import {
  BasicResultsResponse,
  Manga,
  ReadingStatus,
} from '@app/api/mangadex/types';
import {SceneContainer} from '@app/components';
import {Image, StyleSheet, View} from 'react-native';
import {readingStatusName} from './HomeScene/bottomNavScenes/Library/Library';
import React, {useEffect, useState} from 'react';
import {usePostRequest} from '@app/api/utils';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {sharedStyles, spacing} from '@app/utils/styles';

export default function ShowMangaLibraryModalScene() {
  const route = useShowMangaDetailsModalRoute();
  const manga = route.params as Manga;

  const {subscribe, set} = useStore;

  // Must be a string due to the RadioButton API.
  const [readingStatus, setReadingStatus] = useState<
    ReadingStatus | null | undefined
  >(undefined);

  useEffect(() => {
    return subscribe(
      state => state.library.data,
      library => {
        setReadingStatus(library.statuses[manga.id]);
      },
    );
    // manga.id not needed here as we know that it's available at this point.
  }, [manga.id, subscribe]);

  const [post] = usePostRequest<BasicResultsResponse | undefined>(undefined, {
    requireSession: true,
  });

  useEffect(() => {
    if (readingStatus === undefined) {
      // the state is not initialized. Don't send an update request to the API.
      return;
    }

    post(UrlBuilder.updateReadingStatus(manga.id), {
      status: readingStatus || null,
    }).then(res => {
      if (res?.result === 'ok') {
        set({
          library: {data: {statuses: {[manga.id]: readingStatus || undefined}}},
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readingStatus, manga.id, set]);

  return (
    <SceneContainer canScroll title="Add to library...">
      <View style={[styles.root, sharedStyles.container]}>
        <Image
          source={{uri: mangaImage(manga, {size: CoverSize.Small})}}
          style={{height: 150, width: 100}}
        />
        <Text>{preferredMangaTitle(manga)}</Text>
        <Button
          mode={readingStatus ? 'outlined' : 'contained'}
          onPress={() => setReadingStatus(null)}>
          Not tracking this title
        </Button>
        {Object.values(ReadingStatus).map(availableReadingStatus => (
          <Button
            key={availableReadingStatus}
            mode={
              availableReadingStatus === readingStatus
                ? 'contained'
                : 'outlined'
            }
            onPress={() => setReadingStatus(availableReadingStatus)}>
            {readingStatusName(availableReadingStatus)}
          </Button>
        ))}
      </View>

      {/* <RadioButton.Group */}
      {/*   value={readingStatus || ''} */}
      {/*   onValueChange={value => setReadingStatus(value as ReadingStatus)}> */}
      {/*   <View> */}
      {/*     <Text>- Not added to library -</Text> */}
      {/*     <RadioButton value="" /> */}
      {/*   </View> */}
      {/*   {Object.values(ReadingStatus).map(readingStatus => ( */}
      {/*     <View key={readingStatus} style={{flexDirection: 'row'}}> */}
      {/*       <Text>{readingStatusName(readingStatus)}</Text> */}
      {/*       <RadioButton value={readingStatus} /> */}
      {/*     </View> */}
      {/*   ))} */}
      {/* </RadioButton.Group> */}
    </SceneContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing(2),
  },
});
