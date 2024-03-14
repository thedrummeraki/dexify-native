import {Artist, MangaRequestParams, TagMode} from '@app/api/mangadex/types';

export type PartialFilterParamsState = Pick<
  MangaRequestParams,
  | 'availableTranslatedLanguage'
  | 'contentRating'
  | 'publicationDemographic'
  | 'includedTags'
  | 'excludedTags'
  | 'includedTagsMode'
  | 'excludedTagsMode'
  | 'title'
  | 'status'
  | 'artists'
  | 'authors'
>;
export type FilterParamsState = Required<PartialFilterParamsState>;

export type FilterSortState = Required<Pick<MangaRequestParams, 'order'>>;

export interface FiltersMiscObjects {
  artists: Artist[];
}

export interface FiltersStore {
  params: FilterParamsState;
  sort: FilterSortState;
  objects: FiltersMiscObjects;
}

export const defaultFiltersStore: FiltersStore = {
  params: {
    availableTranslatedLanguage: [],
    contentRating: [],
    publicationDemographic: [],
    includedTags: [],
    excludedTags: [],
    includedTagsMode: TagMode.AND,
    excludedTagsMode: TagMode.OR,
    title: '',
    status: [],
    artists: [],
    authors: [],
  },
  sort: {
    order: {
      followedCount: 'desc',
    },
  },
  objects: {
    artists: [],
  },
};

export function sanitizeFilters(
  params: FilterParamsState,
): Partial<FilterParamsState> {
  const entries = Object.entries(params).filter(([_, value]) => {
    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length > 0;
    } else if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    } else {
      return value !== undefined && value !== null;
    }
  });

  return Object.fromEntries(entries) as Partial<FilterParamsState>;
}
