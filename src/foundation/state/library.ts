import {AllReadingStatusResponse, CustomList} from '@app/api/mangadex/types';

export interface TransformedMdLists {
  [key: string]: string[] | undefined;
}

export interface LibraryStore {
  loading: boolean;
  data: AllReadingStatusResponse;
}

export interface MDListsStore {
  loading: boolean;
  data: TransformedMdLists;
  raw: CustomList[];
}

export const defaultLibraryStore: LibraryStore = {
  loading: false,
  data: {
    statuses: {},
  },
};

export const defaultMDListsStore: MDListsStore = {
  loading: false,
  data: {},
  raw: [],
};
