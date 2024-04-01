import {
  CoverArt,
  Manga,
  PagedResultsList,
  isSuccess,
} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useLazyGetRequest} from '@app/api/utils';
import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';

export type MangaProviderProps = PropsWithChildren<{
  manga: Manga;
}>;

interface MangaProviderState {
  manga: Manga;
  coverArts: CoverArt[];
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
  const [getCovers] = useLazyGetRequest<PagedResultsList<CoverArt>>(
    UrlBuilder.covers({manga: [manga.id], limit: 100}),
  );

  useEffect(() => {
    getCovers().then(data => {
      if (isSuccess(data)) {
        setCoverArts(data.data);
      }
    });
  }, []);

  return (
    <MangaContext.Provider value={{manga, coverArts}}>
      {children}
    </MangaContext.Provider>
  );
}
