import {
  ContentRating,
  CustomList,
  Manga,
  PagedResultsList,
  isSuccess,
} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useLazyGetRequest} from '@app/api/utils';
import React, {useEffect, useRef, useState} from 'react';
import MDListsDetails from './MDListsDetails';
import {findRelationship} from '@app/api/mangadex/utils';
import {useStore} from '@app/foundation/state/StaterinoProvider';

export default function MDLists() {
  const canFetchMangas = useRef(true);
  const [mdLists, loading] = useStore([
    state => state.mdLists.raw,
    state => state.mdLists.loading,
  ]);

  const [mangaList, setMangaList] = useState<Manga[]>([]);

  const [getMangas, {loading: mangasLoading}] =
    useLazyGetRequest<PagedResultsList<Manga>>();

  useEffect(() => {
    if (!canFetchMangas.current) {
      return;
    }

    if (mdLists.length === 0) {
      return;
    }

    const relevantMangaIdsList = mdLists.reduce((ids, mdList) => {
      const manga = findRelationship(mdList, 'manga');
      if (manga) {
        ids.push(manga.id);
      }
      return ids;
    }, [] as string[]);

    getMangas(
      UrlBuilder.mangaList({
        ids: relevantMangaIdsList,
        contentRating: Object.values(ContentRating),
        limit: relevantMangaIdsList.length,
        order: {},
      }),
    )
      .then(res => {
        if (isSuccess(res)) {
          setMangaList(res.data);
        }
      })
      .finally(() => {
        canFetchMangas.current = false;
      });
  }, [mdLists]);

  return (
    <MDListsDetails
      loading={loading || mangasLoading}
      mdLists={mdLists}
      mangas={mangaList}
    />
  );
}
