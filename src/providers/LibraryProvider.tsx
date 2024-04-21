import {
  AllReadingStatusResponse,
  CustomList,
  PagedResultsList,
  isSuccess,
} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {findRelationships} from '@app/api/mangadex/utils';
import {useLazyGetRequest} from '@app/api/utils';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {
  TransformedMdLists,
  defaultLibraryStore,
  defaultMDListsStore,
} from '@app/foundation/state/library';
import {PropsWithChildren, useEffect, useState} from 'react';

export type LibraryProviderProps = PropsWithChildren<{}>;

export default function LibraryProvider({children}: LibraryProviderProps) {
  const {set} = useStore;
  const {
    user: {token},
  } = useStore(state => state);

  const [fetchLibrary, {loading: libraryLoading}] =
    useLazyGetRequest<AllReadingStatusResponse>(
      UrlBuilder.readingStatusMangaIds(),
      {requireSession: true},
    );

  const [fetchMdLists, {loading: mdListsLoading}] = useLazyGetRequest<
    PagedResultsList<CustomList>
  >(UrlBuilder.currentUserCustomLists({limit: 100}), {requireSession: true});

  useEffect(() => {
    if (token) {
      Promise.all([fetchMdLists(), fetchLibrary()]).then(
        ([mdListsData, libraryData]) => {
          const mdLists = isSuccess(mdListsData) ? mdListsData.data : [];
          const transformedMdLists = transformMdLists(mdLists);
          const library = libraryData || {statuses: {}};

          set({
            library: {data: library},
            mdLists: {data: transformedMdLists, raw: mdLists},
          });
        },
      );
    } else {
      set({library: defaultLibraryStore, mdLists: defaultMDListsStore});
    }
  }, [token]);

  useEffect(() => {
    set({
      library: {
        loading: libraryLoading,
      },
      mdLists: {
        loading: mdListsLoading,
      },
    });
  }, [libraryLoading, mdListsLoading]);

  return <>{children}</>;
}

function transformMdLists(mdLists: CustomList[]): TransformedMdLists {
  const transformedResult: TransformedMdLists = {};
  mdLists.forEach(mdList => {
    const mangaIds = findRelationships(mdList, 'manga').map(manga => manga.id);
    mangaIds.forEach(mangaId => {
      if (transformedResult[mangaId]) {
        transformedResult[mangaId].push(mdList.id);
      } else {
        transformedResult[mangaId] = [mdList.id];
      }
    });
  });

  return transformedResult;
}

export function useSubscribedLibrary() {
  const [library, setLibrary] = useState(defaultLibraryStore);
  const {subscribe} = useStore;

  useEffect(() => {
    return subscribe(state => state.library, setLibrary);
  }, []);

  return library;
}
