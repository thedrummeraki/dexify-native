import {AllReadingStatusResponse} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useLazyGetRequest} from '@app/api/utils';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {defaultLibraryStore} from '@app/foundation/state/library';
import {PropsWithChildren, useEffect, useState} from 'react';

export type LibraryProviderProps = PropsWithChildren<{}>;

export default function LibraryProvider({children}: LibraryProviderProps) {
  const {set} = useStore;
  const {
    user: {token},
  } = useStore(state => state);

  const [fetchLibrary, {loading}] = useLazyGetRequest<AllReadingStatusResponse>(
    UrlBuilder.readingStatusMangaIds(),
    {requireSession: true},
  );

  useEffect(() => {
    if (token) {
      fetchLibrary()
        .then(data => {
          if (data) {
            set({library: {data}});
          } else {
            console.log('WARN: No library info');
          }
        })
        .catch(e => {
          console.warn('Could not fetch library:', e);
        });
    } else {
      set({library: defaultLibraryStore});
    }
  }, [token]);

  useEffect(() => {
    set({library: {loading}});
  }, [loading]);

  return <>{children}</>;
}

export function useSubscribedLibrary() {
  const [library, setLibrary] = useState(defaultLibraryStore);
  const {subscribe} = useStore;

  useEffect(() => {
    return subscribe(state => state.library, setLibrary);
  }, []);

  return library;
}
