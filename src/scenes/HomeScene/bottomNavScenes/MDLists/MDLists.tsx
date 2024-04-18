import {
  ContentRating,
  CustomList,
  Manga,
  PagedResultsList,
  isSuccess,
} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useLazyGetRequest} from '@app/api/utils';
import React, {useEffect, useState} from 'react';
import MDListsDetails from './MDListsDetails';
import {findRelationship} from '@app/api/mangadex/utils';

export default function MDLists() {
  const [getCustomLists, {loading}] = useLazyGetRequest<
    PagedResultsList<CustomList>
  >(UrlBuilder.currentUserCustomLists({limit: 100}), {requireSession: true});

  const [mdLists, setMDLists] = useState<CustomList[]>([]);
  const [mangaList, setMangaList] = useState<Manga[]>([]);

  const [getMangas, {loading: mangasLoading}] =
    useLazyGetRequest<PagedResultsList<Manga>>();

  useEffect(() => {
    getCustomLists().then(data => {
      if (isSuccess(data)) {
        const mdLists = data.data;
        setMDLists(mdLists);

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
        ).then(res => {
          if (isSuccess(res)) {
            setMangaList(res.data);
          }
        });
      }
    });
  }, []);

  return (
    <MDListsDetails
      loading={loading || mangasLoading}
      mdLists={mdLists}
      mangas={mangaList}
    />
  );
}
