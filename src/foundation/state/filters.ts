import {
  Artist,
  ChapterRequestParams,
  MangaRequestParams,
  TagMode,
} from '@app/api/mangadex/types';
import {getDeviceMangadexFriendlyLanguage} from '@app/utils';

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

export type PartialChapterFilterParamsState = Pick<
  ChapterRequestParams,
  | 'volume'
  | 'originalLanguage'
  | 'translatedLanguage'
  | 'excludedOriginalLanguage'
>;

export type FilterParamsState = Required<PartialFilterParamsState>;
export type ChapterFiltersParamsState =
  Required<PartialChapterFilterParamsState>;

export type FilterSortState = Required<Pick<MangaRequestParams, 'order'>>;

export interface FiltersMiscObjects {
  artists: Artist[];
}

export interface FiltersStore {
  params: FilterParamsState;
  sort: FilterSortState;
  objects: FiltersMiscObjects;
}

export interface ChapterFiltersStore {
  params: ChapterFiltersParamsState;
  sort: Required<Pick<ChapterRequestParams, 'order'>>;
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

export const defaultChapterFiltersStore: ChapterFiltersStore = {
  params: {
    excludedOriginalLanguage: [],
    originalLanguage: [],
    translatedLanguage: [getDeviceMangadexFriendlyLanguage()],
    volume: [],
  },
  sort: {
    order: {
      chapter: 'desc',
    },
  },
};

export function sanitizeFilters<
  T extends FilterParamsState | ChapterFiltersParamsState,
>(params: T): Partial<T> {
  const entries = Object.entries(params).filter(([_, value]) => {
    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length > 0;
    } else if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    } else {
      return value !== undefined && value !== null;
    }
  });

  return Object.fromEntries(entries) as Partial<T>;
}

export function useIsDirty<
  T extends ChapterFiltersParamsState | FilterParamsState,
>(before: T, after: T): boolean {
  const currentState = sanitizeFilters(before);
  const newState = sanitizeFilters(after);

  const currentKeys = Object.keys(currentState);
  const newKeys = Object.keys(newState);

  const currentInNew = currentKeys.every(key => newKeys.includes(key));
  const newInCurrent = newKeys.every(key => currentKeys.includes(key));

  if (!currentInNew || !newInCurrent) {
    return true;
  }

  // At this point, we know that current and new have the same keys.
  // Now, ensure all values actually match.
  const someValuesMismatch = Object.entries(currentState).some(
    ([key, value]) => {
      const newValue = newState[key as keyof Partial<T>];

      if (Array.isArray(newValue) && Array.isArray(value)) {
        const strValues = value.map(String);
        const strNewValues = newValue.map(String);

        return !(
          strValues.every(strkey => strNewValues.includes(strkey)) &&
          strNewValues.every(strkey => strValues.includes(strkey))
        );
      } else {
        return newValue !== value;
      }
    },
  );

  return someValuesMismatch;
}
