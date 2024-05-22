import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Chapter,
  ChapterRequestParams,
  Manga,
  PagedResultsList,
  isSuccess,
} from '@app/api/mangadex/types';
import {groupChapters, preferredMangaTitle} from '@app/api/mangadex/utils';
import {sharedStyles, spacing} from '@app/utils/styles';
import {StyleSheet, View} from 'react-native';
import {Banner, IconButton, ProgressBar, Text} from 'react-native-paper';
import {useLazyGetRequest} from '@app/api/utils';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import ChaptersList from '../ShowMangaVolumeScene/components/ChaptersList';
import {useMangadexPagination} from '@app/api/mangadex/hooks';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {ChapterFiltersPreview} from './components';
import {useDexifyNavigation} from '@app/foundation/navigation';
import {intersectPrimitives} from '@app/utils';
import {ChapterFiltersParamsState} from '@app/foundation/state/filters';

import mergerino from 'mergerino';

export interface ShowMangaChaptersSceneDetailsProps {
  manga: Manga;
}

export interface ChaptersState {
  order: (string | null)[];
  data: {[key: string]: Chapter[]};
}

export default function ShowMangaChaptersSceneDetails({
  manga,
}: ShowMangaChaptersSceneDetailsProps) {
  const navigation = useDexifyNavigation();

  const [hasMore, setHasMore] = useState(true);
  const [chapters, setChapters] = useState<ChaptersState>({
    order: [],
    data: {},
  });

  const [get, {data, loading}] = useLazyGetRequest<PagedResultsList<Chapter>>();
  const limit = 100;
  const {offset, nextOffset, nextPage, resetPage} = useMangadexPagination(
    [],
    limit,
  );

  const [order, params] = useStore(state => [
    state.chapterFilters.sort.order,
    state.chapterFilters.params,
  ]);

  const options = useMemo(
    () => ({offset, limit, order, ...params} as Required<ChapterRequestParams>),
    [order, offset, params],
  );

  const fetchChapters = useCallback(
    () => {
      return get(
        UrlBuilder.chaptersFeed(manga, sanitizeOptions(options, manga)),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [manga.id, options],
  );

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  useEffect(() => {
    resetPage();
    setChapters({data: {}, order: []});
    setHasMore(true);
  }, [order, params, resetPage]);

  useEffect(() => {
    if (isSuccess(data)) {
      setChapters(current => {
        const newChapters = data.data;

        return mergerino(current, {
          order: (previousOrder: (string | null)[]) => [
            ...new Set(
              previousOrder.concat(
                newChapters.map(newChapter => newChapter.attributes.chapter),
              ),
            ),
          ],
          data: Object.fromEntries([...groupChapters(newChapters)]),
        });
      });
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess(data)) {
      setHasMore(data.total > nextOffset);
    }
  }, [data, nextOffset]);

  return (
    <View style={sharedStyles.flex}>
      {loading ? <ProgressBar indeterminate /> : null}
      <View style={styles.filtersPreview}>
        <ChapterFiltersPreview manga={manga} />
        <IconButton
          icon="filter-variant"
          onPress={() => navigation.push('ChapterFilters', {manga})}
        />
      </View>
      <ChaptersList
        manga={manga}
        hideSearchBar
        groupedChapters={chapters}
        contentContainerStyle={[
          sharedStyles.tightContainer,
          {
            // todo: find another way to remove top padding
            marginTop: spacing(-3),
          },
        ]}
        initialNumToRender={20}
        onEndReachedThreshold={1}
        onEndReached={() => {
          if (!loading && hasMore) {
            nextPage();
          }
        }}
        ListEmptyComponent={
          !loading ? (
            <Banner visible>
              No chapters for{' '}
              <Text style={sharedStyles.bold}>
                {preferredMangaTitle(manga)}
              </Text>{' '}
              were found.
            </Banner>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filtersPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export function sanitizeOptions(
  options: Required<ChapterFiltersParamsState>,
  manga: Manga,
): Required<ChapterFiltersParamsState> {
  const {availableTranslatedLanguages, originalLanguage} = manga.attributes;
  return {
    ...options,
    excludedOriginalLanguage: intersectPrimitives(
      options.excludedOriginalLanguage || [],
      [originalLanguage],
    ),
    originalLanguage: intersectPrimitives(options.originalLanguage || [], [
      originalLanguage,
    ]),
    translatedLanguage: intersectPrimitives(
      options.translatedLanguage || [],
      availableTranslatedLanguages,
    ),
  };
}
