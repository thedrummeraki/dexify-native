import {
  Chapter,
  CoverArt,
  Manga,
  PagedResultsList,
  isSuccess,
} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useContentRating} from '@app/api/mangadex/utils';
import {useLazyGetRequest} from '@app/api/utils';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {ChapterFiltersParamsState} from '@app/foundation/state/filters';
import {sanitizeOptions} from '@app/scenes/ShowMangaChaptersScene/ShowMangaChaptersSceneDetails';
import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';

export type MangaProviderProps = PropsWithChildren<{
  manga: Manga;
}>;

interface MangaProviderState {
  manga: Manga;
  coverArts: CoverArt[];
  chapters: Chapter[];
  chaptersData: PagedResultsList<Chapter> | undefined;
  stats: Manga.StatisticsResponse;
  statsLoading: boolean;
  chaptersLoading: boolean;
  chaptersOrder: 'asc' | 'desc';
  aggregate: Manga.Aggregate;
  aggregateLoading: boolean;
}

const MangaContext = React.createContext<MangaProviderState>(
  {} as MangaProviderState,
);

export const useManga = (): Manga => {
  return useMangaDetails().manga;
};

export const useMangaDetails = (): MangaProviderState => {
  const context = useContext(MangaContext);
  if (!context || Object.keys(context).length < 1) {
    throw new Error(
      'Missing <MangaProvider> or <SimpleMangaProvider> provider',
    );
  }

  return context;
};

export function SimpleMangaProvider({manga, children}: MangaProviderProps) {
  return (
    <MangaContext.Provider
      value={{
        manga,
        aggregate: {result: 'error'},
        aggregateLoading: false,
        chapters: [],
        chaptersData: {result: 'error', errors: []},
        chaptersLoading: false,
        chaptersOrder: 'asc',
        coverArts: [],
        stats: {result: 'error'},
        statsLoading: false,
      }}>
      {children}
    </MangaContext.Provider>
  );
}

export default function MangaProvider({manga, children}: MangaProviderProps) {
  const [coverArts, setCoverArts] = useState<CoverArt[]>([]);
  const [aggregate, setAggregate] = useState<Manga.Aggregate>({
    result: 'ok',
    volumes: {},
  });
  const [stats, setStats] = useState<Manga.StatisticsResponse>({
    result: 'ok',
    statistics: {},
  });
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const contentRating = useContentRating();

  const [getStats, {loading: statsLoading}] =
    useLazyGetRequest<Manga.StatisticsResponse>(
      UrlBuilder.mangaStatistics(manga.id),
    );

  useEffect(() => {
    getStats().then(res => {
      if (res) {
        setStats(res);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manga.id]);

  const [getCovers] = useLazyGetRequest<PagedResultsList<CoverArt>>(
    UrlBuilder.covers({
      manga: [manga.id],
      limit: 100,
      order: {volume: 'asc'},
    }),
  );

  const [chapterParams, chaptersOrder] = useStore(state => [
    state.chapterFilters.params,
    state.chapterFilters.sort.order.chapter || 'desc',
  ]);
  const [getChapters, {data: chaptersData, loading: chaptersLoading}] =
    useLazyGetRequest<PagedResultsList<Chapter>>();

  useEffect(() => {
    getCovers().then(data => {
      if (isSuccess(data)) {
        setCoverArts(data.data);
      }
    });
    getChapters(
      UrlBuilder.chaptersFeed(
        manga,
        sanitizeOptions(
          {
            contentRating,
            order: {chapter: chaptersOrder},
            ...chapterParams,
          } as Required<ChapterFiltersParamsState>,
          manga,
        ),
      ),
    ).then(data => {
      if (isSuccess(data)) {
        setChapters(data.data);
        // if (data.data.length === 0) {
        //   // then try to fetch for all other languages
        //   console.log('fetching more chapters in all languages...');
        //   getChapters(
        //     UrlBuilder.chaptersFeed(manga, {
        //       contentRating: [manga.attributes.contentRating],
        //       order: {chapter: chaptersOrder},
        //     }),
        //   ).then(newData => {
        //     if (isSuccess(newData)) {
        //       setChapters(newData.data);
        //     }
        //   });
        // } else {
        //   setChapters(data.data);
        // }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterParams, chaptersOrder]);

  const [getVolumesAndChapters, {loading: aggregateLoading}] =
    useLazyGetRequest<Manga.Aggregate>(
      UrlBuilder.mangaVolumesAndChapters(manga.id),
    );

  useEffect(() => {
    getVolumesAndChapters().then(res => {
      if (res) {
        setAggregate(res);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manga.id]);

  return (
    <MangaContext.Provider
      value={{
        manga,
        coverArts,
        aggregate,
        aggregateLoading,
        chapters,
        chaptersData,
        chaptersOrder,
        chaptersLoading,
        stats,
        statsLoading,
      }}>
      {children}
    </MangaContext.Provider>
  );
}
