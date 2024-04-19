import {AllReadingStatusResponse} from '@app/api/mangadex/types';

export interface LibraryStore {
  loading: boolean;
  data: AllReadingStatusResponse;
}

export const defaultLibraryStore: LibraryStore = {
  loading: false,
  data: {
    statuses: {},
  },
};
