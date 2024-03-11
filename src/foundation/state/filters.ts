import {
  ContentRating,
  MangaRequestParams,
  TagMode,
} from '@app/api/mangadex/types';

export type FilterParamsState = Required<
  Pick<
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
  >
>;

export type FilterSortState = Required<Pick<MangaRequestParams, 'order'>>;

export interface FiltersStore {
  params: FilterParamsState;
  sort: FilterSortState;
}

export const defaultFiltersStore: FiltersStore = {
  params: {
    availableTranslatedLanguage: [],
    contentRating: [ContentRating.safe, ContentRating.suggestive],
    publicationDemographic: [],
    includedTags: [],
    excludedTags: [],
    includedTagsMode: TagMode.AND,
    excludedTagsMode: TagMode.OR,
    title: '',
    status: [],
  },
  sort: {
    order: {
      followedCount: 'desc',
    },
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
