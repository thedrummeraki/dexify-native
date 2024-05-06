import {
  groupChapters,
  preferredMangaTitle,
  volumeInfoTitle,
} from '@app/api/mangadex/utils';
import {SceneContainer} from '@app/components';
import {useShowMangaVolumeRoute} from '@app/foundation/navigation';
import {Banner, ProgressBar} from 'react-native-paper';
import {VolumePoster} from './components';
import {useLazyGetRequest} from '@app/api/utils';
import {Chapter, PagedResultsList, isSuccess} from '@app/api/mangadex/types';
import React, {useEffect, useState} from 'react';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import ChaptersList from './components/ChaptersList';
import {useMangadexPagination} from '@app/api/mangadex/hooks';
import {View} from 'react-native';

export default function ShowMangaVolumeScene() {
  const route = useShowMangaVolumeRoute();
  const {manga, volumeInfo} = route.params;

  const {
    attributes: {contentRating},
  } = manga;
  const {chapterIds} = volumeInfo;

  const {offset, limit} = useMangadexPagination([]);

  const [fetchChapters, {loading}] =
    useLazyGetRequest<PagedResultsList<Chapter>>();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const groupedChapters = groupChapters(chapters);

  useEffect(() => {
    // if (offset + limit < chapterIds.length) {
    //   return;
    // }
    fetchChapters(
      UrlBuilder.chaptersList({
        ids: chapterIds.slice(offset, limit),
        contentRating: [contentRating],
        includes: ['scanlation_group'],
        order: {chapter: 'asc'},
        limit,
      }),
    ).then(res => {
      if (isSuccess(res)) {
        setChapters(current => [...current, ...res.data]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterIds, contentRating, offset, limit]);

  return (
    <SceneContainer
      title={volumeInfoTitle(volumeInfo)}
      subtitle={preferredMangaTitle(manga)}
      headerIcon="arrow-left">
      <View style={{flex: 4}}>
        <ChaptersList
          groupedChapters={groupedChapters}
          // onEndReached={() => nextPage()}
          ListHeaderComponent={
            <>
              <VolumePoster
                volumeInfo={volumeInfo}
                manga={manga}
                aspectRatio={1.5}
              />
              {loading && <ProgressBar indeterminate />}
            </>
          }
          ListEmptyComponent={
            loading || !chapterIds ? null : (
              <Banner visible>No chapters were found for this volume.</Banner>
            )
          }
        />
      </View>
    </SceneContainer>
  );
}
