import {
  Chapter,
  EntityResponse,
  Manga,
  PagedResultsList,
  isSuccess,
} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useLazyGetRequest} from '@app/api/utils';
import {ValidHomeResource} from '@app/home/hooks';
import {CategoryResponse, Provider} from '@app/home/types';
import {useCallback, useEffect, useRef, useState} from 'react';

export interface HomePresenter {
  featuredManga: Manga | undefined;
  forYou: Manga[];
  popularNow: Manga[];
  continueReading: Manga[];
  newArrivals: Manga[];
  startReadingNow: Manga[];
  newlyAddedChapters: Chapter[];
  pickupAgain: Manga[];
  randomManga: Manga | null;
  mostPopular: Manga[];
  familyFriendly: Manga[];
  longStrips: Manga[];
  topRomantic: Manga[];
}

export interface FetchedHomeData {
  data?: HomePresenter;
  loading: boolean;
  refresh(): void;
}

export function useFetchCategoryProvider(
  provider: Provider<
    PagedResultsList<ValidHomeResource | undefined> | undefined
  >,
) {
  const [responses, setResponses] = useState<
    CategoryResponse<
      PagedResultsList<ValidHomeResource | undefined> | undefined
    >[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const promises = provider.map(([_, promise]) => promise());
    Promise.all(promises)
      .then(res => {
        setResponses(
          res.map((response, index) => {
            const category = provider.at(index)![0];
            return {category, response};
          }),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return {loading, responses};
}

export default function useFetchHome(): FetchedHomeData {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HomePresenter>();
  const loadedOnce = useRef(false);

  const [fetchMangas] = useLazyGetRequest<PagedResultsList<Manga>>();
  const [fetchChapters] = useLazyGetRequest<PagedResultsList<Chapter>>();
  const [fetchManga] = useLazyGetRequest<EntityResponse<Manga>>();

  const today = new Date();
  const oneMonthAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate(),
  );
  const createdAtSince = oneMonthAgo.toISOString().split('.')[0];

  const load = useCallback(() => {
    const newArrivalsUrl = UrlBuilder.mangaList({order: {createdAt: 'desc'}});
    const popularNowUrl = UrlBuilder.mangaList({createdAtSince, limit: 11});
    const newlyAddedChaptersUrl = UrlBuilder.chaptersList();
    const randomMangaUrl = UrlBuilder.randomManga();

    Promise.all([
      fetchMangas(newArrivalsUrl),
      fetchMangas(popularNowUrl),
      fetchManga(randomMangaUrl),
      fetchChapters(newlyAddedChaptersUrl),
    ])
      .then(
        ([
          newArrivalsRes,
          popularNowRes,
          randomMangaRes,
          newlyAddedChaptersRes,
        ]) => {
          const newArrivals = isSuccess(newArrivalsRes)
            ? newArrivalsRes.data
            : [];
          const popularNow = isSuccess(popularNowRes) ? popularNowRes.data : [];
          const featuredManga = popularNow.shift();
          const randomManga = isSuccess(randomMangaRes)
            ? randomMangaRes.data
            : null;
          const newlyAddedChapters = isSuccess(newlyAddedChaptersRes)
            ? newlyAddedChaptersRes.data
            : [];

          setData({
            featuredManga,
            newArrivals,
            popularNow,
            newlyAddedChapters,
            randomManga,
            continueReading: [],
            familyFriendly: [],
            forYou: [],
            longStrips: [],
            mostPopular: [],
            pickupAgain: [],
            startReadingNow: [],
            topRomantic: [],
          });
        },
      )
      .finally(() => {
        setLoading(false);
        loadedOnce.current = true;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(() => {
    // memoized function since it might be passed it to useEffects
    loadedOnce.current = false;
    load();
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  return {loading, data, refresh};
}
