import {preferredMangaTitle, volumeInfoTitle} from '@app/api/mangadex/utils';
import {Padding, PaddingHorizontal, SceneContainer} from '@app/components';
import {useShowMangaVolumeRoute} from '@app/foundation/navigation';
import {Banner, ProgressBar, Text} from 'react-native-paper';
import {VolumePoster} from './components';
import {useLazyGetRequest} from '@app/api/utils';
import {Chapter, PagedResultsList, isSuccess} from '@app/api/mangadex/types';
import {useEffect} from 'react';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import ChaptersList from './components/ChaptersList';

export type GroupedChapters = Map<string | null, Chapter[]>;

export default function ShowMangaVolumeScene() {
  const route = useShowMangaVolumeRoute();
  const {manga, volumeInfo} = route.params;

  const {
    attributes: {contentRating},
  } = manga;
  const {chapterIds} = volumeInfo;

  const [fetchChapters, {data, loading}] =
    useLazyGetRequest<PagedResultsList<Chapter>>();

  const chapters = isSuccess(data) ? data.data : [];
  const groupedChapters: GroupedChapters = chapters.reduce((map, chapter) => {
    map.set(chapter.attributes.chapter, [
      ...(map.get(chapter.attributes.chapter) || []),
      chapter,
    ]);
    return map;
  }, new Map());

  useEffect(() => {
    fetchChapters(
      UrlBuilder.chaptersList({
        ids: chapterIds,
        contentRating: [contentRating],
        includes: ['scanlation_group'],
        order: {chapter: 'asc'},
        limit: 100,
      }),
    );
  }, [chapterIds, contentRating]);

  return (
    <SceneContainer
      title={volumeInfoTitle(volumeInfo)}
      subtitle={preferredMangaTitle(manga)}
      headerIcon="arrow-left">
      <ChaptersList
        chapters={chapters}
        groupedChapters={groupedChapters}
        onChapterPress={() => {}}
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
