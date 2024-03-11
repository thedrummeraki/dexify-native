import {useCallback, useEffect, useMemo, useState} from 'react';
// import {useContentRatingFitlers, useMangadexSettings} from 'src/prodivers';
import {useLazyGetRequest} from '../utils';
import {
  ContentRating,
  EntityResponse,
  Manga,
  MangaRequestParams,
  PagedResultsList,
  SingleMangaRequestParams,
} from './types';
import {RequestResult} from '../types';
import UrlBuilder from './types/api/urlBuilder';

type ManyManga = PagedResultsList<Manga>;
type OneManga = EntityResponse<Manga>;

export function useMangadexPagination(resetsWhenChanged: readonly any[]) {
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  // const {
  //   userPreferences: {paginationCount: limit},
  // } = useMangadexSettings();
  const limit = 50;

  const previousPage = useCallback(() => setPage(current => current - 1), []);
  const nextPage = useCallback(() => {
    console.log('going to next page from', page, 'to', page + 1);
    setPage(current => current + 1);
  }, [page]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  const nextOffset = useMemo(() => page * limit, [page, limit]);

  useEffect(() => {
    if (page < 1) {
      setPage(1);
    } else {
      setOffset((page - 1) * limit);
    }
  }, [page, limit]);

  // useEffect(() => {});

  useEffect(() => {
    resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetsWhenChanged);

  return {
    page,
    offset,
    limit,
    nextOffset,
    previousPage,
    nextPage,
    resetPage,
  };
}

export function useLazyGetMangaList(
  options?: MangaRequestParams,
  showEverything?: boolean,
): readonly [
  (
    params?: MangaRequestParams,
    overrideParams?: boolean,
  ) => Promise<ManyManga | undefined>,
  RequestResult<ManyManga>,
] {
  const allContentRatings = [
    'safe',
    'erotica',
    'suggestive',
    'pornographic',
  ] as ContentRating[];
  const allowedContentRatings = [
    ContentRating.safe,
    ContentRating.suggestive,
    ContentRating.erotica,
  ];
  const contentRating = showEverything
    ? allContentRatings
    : allowedContentRatings;
  const [get, response] = useLazyGetRequest<ManyManga>();

  const getManga = useCallback(
    (otherOptions?: MangaRequestParams, overrideParams?: boolean) => {
      const defaultOptions = {contentRating};
      const params = overrideParams
        ? otherOptions
        : Object.assign(defaultOptions, {...options, ...otherOptions});
      const url = UrlBuilder.mangaList(params);
      return get(url);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contentRating, options],
  );

  return [getManga, response];
}

export function useGetMangaList(
  options?: MangaRequestParams,
  showEverything?: boolean,
) {
  const [getManga, response] = useLazyGetMangaList(options, showEverything);

  useEffect(() => {
    getManga(options);
  }, [getManga, options]);

  return response;
}

export function useLazyManga(
  id: string,
  options?: SingleMangaRequestParams,
): [() => Promise<OneManga | undefined>, RequestResult<OneManga>] {
  const [get, response] = useLazyGetRequest<OneManga>();

  const getManga = useCallback(() => {
    const url = UrlBuilder.mangaById(id, options);
    return get(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [getManga, response];
}

export function useManga(id: string, options?: SingleMangaRequestParams) {
  const [getManga, response] = useLazyManga(id, options);

  useEffect(() => {
    getManga();
  }, [getManga]);

  return response;
}
