import {
  CoverArt,
  CustomList,
  PagedResultsList,
  isSuccess,
} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useLazyGetRequest} from '@app/api/utils';
import React, {useEffect, useMemo, useState} from 'react';
import MDListsDetails from './MDListsDetails';
import {findRelationship} from '@app/api/mangadex/utils';
import {useUserStore} from '@app/foundation/state/StaterinoProvider';

export default function MDLists() {
  const [getCustomLists, {loading, data}] = useLazyGetRequest<
    PagedResultsList<CustomList>
  >(UrlBuilder.currentUserCustomLists({limit: 100}), {requireSession: true});

  const [mdLists, setMDLists] = useState<CustomList[]>([]);
  const [coverArts, setCoverArts] = useState<CoverArt[]>([]);

  const [getCovers, {loading: coversLoading}] =
    useLazyGetRequest<PagedResultsList<CoverArt>>();

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

        getCovers(UrlBuilder.covers({manga: relevantMangaIdsList})).then(
          data => {
            if (isSuccess(data)) {
              setCoverArts(data.data);
            }
          },
        );
      }
    });
  }, []);

  return (
    <MDListsDetails
      loading={loading || coversLoading}
      mdLists={mdLists}
      coverArts={coverArts}
    />
  );
}
