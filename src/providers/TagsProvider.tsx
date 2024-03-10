import {Manga, PagedResultsList, isSuccess} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useGetRequest} from '@app/api/utils';
import React, {PropsWithChildren, useContext, useEffect, useState} from 'react';

interface TagsState {
  tags: Manga.Tag[];
}

const TagsContext = React.createContext<TagsState>({tags: []});

type TagsProviderProps = PropsWithChildren<{}>;

export function useTags(): Manga.Tag[] {
  return useContext(TagsContext).tags;
}

export default function TagsProvider({children}: TagsProviderProps) {
  const {data} = useGetRequest<PagedResultsList<Manga.Tag>>(
    UrlBuilder.tagList(),
  );

  const [tags, setTags] = useState<Manga.Tag[]>([]);

  useEffect(() => {
    if (isSuccess(data)) {
      setTags(data.data);
    } else if (data) {
      console.error('Error while fetching tags:', data);
    }
  }, [data]);

  return <TagsContext.Provider value={{tags}}>{children}</TagsContext.Provider>;
}
