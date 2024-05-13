import {
  Chapter,
  ChapterRequestParams,
  CoverArt,
  Manga,
  PagedResultsList,
  isSuccess,
} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useLazyGetRequest} from '@app/api/utils';
import {getDeviceMangadexFriendlyLanguage} from '@app/utils';
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
  if (!context) {
    throw new Error('Missing <MangaProvider> provider');
  }

  return context;
};

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
  const chaptersOrder = 'desc';

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

  const [getChapters, {data: chaptersData, loading: chaptersLoading}] =
    useLazyGetRequest<PagedResultsList<Chapter>>(undefined);

  useEffect(() => {
    getCovers().then(data => {
      if (isSuccess(data)) {
        setCoverArts(data.data);
      }
    });
    getChapters(
      UrlBuilder.chaptersFeed(manga, {
        contentRating: [manga.attributes.contentRating],
        translatedLanguage: [
          getDeviceMangadexFriendlyLanguage(),
          // manga.attributes.originalLanguage,
        ],
        order: {chapter: chaptersOrder},
      }),
    ).then(data => {
      if (isSuccess(data)) {
        if (data.data.length === 0) {
          // then try to fetch for all other languages
          console.log('fetching more chapters in all languages...');
          getChapters(
            UrlBuilder.chaptersFeed(manga, {
              contentRating: [manga.attributes.contentRating],
              order: {chapter: chaptersOrder},
            }),
          ).then(newData => {
            if (isSuccess(newData)) {
              setChapters(newData.data);
            }
          });
        } else {
          setChapters(data.data);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
