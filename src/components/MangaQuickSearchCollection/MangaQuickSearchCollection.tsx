import React, {useCallback, useEffect, useMemo} from 'react';
import {useState} from 'react';
import SearchBar from '../SearchBar';
import MangaCollection from '../MangaCollection';
import {
  useLazyGetMangaList,
  useMangadexPagination,
} from '@app/api/mangadex/hooks';
import {Manga, isSuccess} from '@app/api/mangadex/types';

export interface QuickSearchProps {
  showEverything?: boolean;
}

export function QuickSearch({showEverything}: QuickSearchProps) {
  const [title, setTitle] = useState('');
  const [mangaList, setMangaList] = useState<Manga[]>([]);

  const [hasMore, setHasMore] = useState(true);
  const {offset, nextOffset, nextPage} = useMangadexPagination([title]);

  const options = useMemo(() => ({title, limit: 50, offset}), [title, offset]);

  const [get, {loading, data}] = useLazyGetMangaList(options, showEverything);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchManga = useCallback(get, [options]);

  useEffect(() => {
    fetchManga();
  }, [fetchManga]);

  useEffect(() => {
    setMangaList([]);
    setHasMore(true);
  }, [title]);

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
        placeholder="Quick search..."
        onQueryChange={setTitle}
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
