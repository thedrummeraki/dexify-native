import React, {useCallback, useEffect, useMemo} from 'react';
import {useState} from 'react';
import SearchBar from '../SearchBar';
import MangaCollection from '../MangaCollection';
import {useMangadexPagination} from '@app/api/mangadex/hooks';
import {Manga, PagedResultsList, isSuccess} from '@app/api/mangadex/types';
import {useFiltersStore} from '@app/foundation/state/StaterinoProvider';
import {sanitizeFilters} from '@app/foundation/state/filters';
import {useDexifyNavigation} from '@app/foundation/navigation';
import {useLazyGetRequest} from '@app/api/utils';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';

export interface QuickSearchProps {
  useFilters?: boolean;
  searchBarPlaceholder?: string;
}

export function MangaSearchCollection({
  useFilters,
  searchBarPlaceholder,
}: QuickSearchProps) {
  const navigation = useDexifyNavigation();

  const [title, setTitle] = useState('');
  const [mangaList, setMangaList] = useState<Manga[]>([]);

  const [hasMore, setHasMore] = useState(true);
  const {offset, nextOffset, nextPage, resetPage} = useMangadexPagination([]);

  const {params: filters} = useFiltersStore();
  const params = useMemo(() => {
    if (useFilters) {
      return {...sanitizeFilters(filters), title};
    } else {
      return {title};
    }
  }, [title, filters, useFilters]);

  const options = useMemo(
    () => ({...params, limit: 50, offset}),
    [params, offset],
  );

  // console.log({options, params, filters});

  const [get, {loading, data}] = useLazyGetRequest<PagedResultsList<Manga>>();

  const fetchManga = useCallback(() => {
    console.log({options});
    get(UrlBuilder.mangaList(options));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    fetchManga();
  }, [fetchManga]);

  useEffect(() => {
    setMangaList([]);
    setHasMore(true);
    resetPage();
  }, [params, resetPage]);

  useEffect(() => {
    if (isSuccess(data)) {
      let newMangaList = data.data;

      setHasMore(data.total > nextOffset);
      setMangaList(current => {
        const mergedMangas = [...current, ...newMangaList];
        const result: Manga[] = [];
        const addedIds: string[] = [];

        mergedMangas.forEach(manga => {
          if (!addedIds.includes(manga.id)) {
            result.push(manga);
            addedIds.push(manga.id);
          }
        });

        return result;
      });
    }
  }, [data, nextOffset]);

  return (
    <>
      <SearchBar
        loading={loading}
        query={title}
        placeholder={searchBarPlaceholder}
        onQueryChange={setTitle}
        onShowFilters={() => navigation.navigate('Filters')}
      />
      <MangaCollection
        mangaList={mangaList}
        loading={loading}
        onEndReached={() => {
          if (hasMore) {
            nextPage();
          }
        }}
      />
    </>
  );
}
