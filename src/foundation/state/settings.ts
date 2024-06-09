import {ContentRating} from '@app/api/mangadex/types';

export type AppThemeAppearance = 'dark' | 'light';

export enum RegularReadingDirection {
  LeftToRight = 'ltr',
  RightToLeft = 'rtl',
}

export enum LongStripReadingDirection {
  TopToBottom = 'ttb',
  BottomToTop = 'btt',
}

export interface AppearanceSettingsStore {
  scheme: AppThemeAppearance;
  itemsPerPage: number;
}

export interface ContentSettingsStore {
  contentRating: ContentRating[];
  excludedUploaders: string[];
  excludedGroups: string[];
}

export interface LanguageSettingsStore {
  originalLanguage: string[];
  excludedOriginalLanguage: string[];
  translatedLanguage: string[];
  availableTranslatedLanguage: string[];
}

export interface ReaderSettingsStore {
  atHomeHttps: boolean;
  dataSaver: boolean;
  direction: RegularReadingDirection;
}

export interface SettingsStore {
  appearance: AppearanceSettingsStore;
  content: ContentSettingsStore;
  language: LanguageSettingsStore;
  reader: ReaderSettingsStore;
}

export const defaultSettingsStore: SettingsStore = {
  appearance: {
    scheme: 'dark',
    itemsPerPage: 25,
  },
  content: {
    contentRating: [
      ContentRating.safe,
      ContentRating.suggestive,
      ContentRating.erotica,
    ],
    excludedGroups: [],
    excludedUploaders: [],
  },
  language: {
    availableTranslatedLanguage: [],
    excludedOriginalLanguage: [],
    originalLanguage: [],
    translatedLanguage: [],
  },
  reader: {
    atHomeHttps: true,
    dataSaver: false,
    direction: RegularReadingDirection.LeftToRight,
  },
};
