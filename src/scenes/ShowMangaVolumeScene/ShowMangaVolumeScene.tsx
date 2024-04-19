import {preferredMangaTitle, volumeInfoTitle} from '@app/api/mangadex/utils';
import {Padding, PaddingHorizontal, SceneContainer} from '@app/components';
import {useShowMangaVolumeRoute} from '@app/foundation/navigation';
import {Banner, ProgressBar, Text} from 'react-native-paper';
import {VolumePoster} from './components';
import {useLazyGetRequest} from '@app/api/utils';
import {Chapter, PagedResultsList, isSuccess} from '@app/api/mangadex/types';
import {useEffect, useState} from 'react';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import ChaptersList from './components/ChaptersList';
import {useMangadexPagination} from '@app/api/mangadex/hooks';
import {Linking} from 'react-native';

export type GroupedChapters = Map<string | null, Chapter[]>;

export default function ShowMangaVolumeScene() {
  const route = useShowMangaVolumeRoute();
  const {manga, volumeInfo} = route.params;

  const {
    attributes: {contentRating},
  } = manga;
  const {chapterIds} = volumeInfo;

  const {offset, limit, nextPage} = useMangadexPagination([]);

  const [fetchChapters, {loading}] =
    useLazyGetRequest<PagedResultsList<Chapter>>();

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const groupedChapters: GroupedChapters = chapters.reduce((map, chapter) => {
    map.set(chapter.attributes.chapter, [
      ...(map.get(chapter.attributes.chapter) || []),
      chapter,
    ]);
    return map;
  }, new Map());

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
  }, [chapterIds, contentRating, offset, limit]);

  return (
    <SceneContainer
      title={volumeInfoTitle(volumeInfo)}
      subtitle={preferredMangaTitle(manga)}
      headerIcon="arrow-left">
      <ChaptersList
        chapters={chapters}
        groupedChapters={groupedChapters}
        onChapterPress={chapter => {
          if (chapter.attributes.externalUrl) {
            Linking.openURL(chapter.attributes.externalUrl).catch(console.warn);
          } else {
            // temporary open on mangadex directly until manga reader is open
            const mangadexChapterUrl = `https://mangadex.org/chapter/${chapter.id}`;
            Linking.openURL(mangadexChapterUrl).catch(console.warn);
          }
        }}
        // onEndReached={() => nextPage()}
        ListHeaderComponent={
          <Padding spacing={0}>
            <VolumePoster
              volumeInfo={volumeInfo}
              manga={manga}
              aspectRatio={1.5}
            />
            {loading && <ProgressBar indeterminate />}
          </Padding>
        }
        ListEmptyComponent={
          loading || !chapterIds ? null : (
            <Banner visible>No chapters were found for this volume.</Banner>
          )
        }
      />
    </SceneContainer>
  );
}
