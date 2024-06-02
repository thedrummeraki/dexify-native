import {AppThemeAppearance} from '@app/foundation/state/settings';
import {ToggleSetting, BaseSetting, NavigatableSetting} from './types';

export type SettingType = 'navigatable' | 'toggle';

export interface SettingSectionPresenter {
  slug: string;
  title?: string;
  // to do: figure out typing for this
  settings: Array<BaseSetting<any>>;
  disabled?: boolean;
}

export function useAppearanceSettingsSection(): SettingSectionPresenter {
  const themeSetting: ToggleSetting<'appearance', AppThemeAppearance> = {
    type: 'toggle',
    title: 'Dark theme',
    store: 'appearance',
    for: 'scheme',
    onToggle: value => (value === 'dark' ? 'light' : 'dark'),
    truthCondition: value => value === 'dark',
  };

  const itemsPerPageSetting: NavigatableSetting<'appearance'> = {
    type: 'navigatable',
    title: 'Items per page',
    to: 'ItemsPerPage',
    for: 'itemsPerPage',
    store: 'appearance',
    showPreview: true,
    disabled: true,
  };

  return {
    slug: 'appearance',
    title: 'Appearance',
    settings: [themeSetting, itemsPerPageSetting],
  };
}

export function useContentSettingsSection(): SettingSectionPresenter {
  const contentRatingSetting: NavigatableSetting<'content'> = {
    type: 'navigatable',
    title: 'Content filter',
    store: 'content',
    for: 'contentRating',
    to: 'Home',
  };

  const excludedGroupsSetting: NavigatableSetting<'content'> = {
    type: 'navigatable',
    title: 'Blacklist groups...',
    store: 'content',
    for: 'excludedGroups',
    to: 'Home',
  };

  const excludedUploadersSetting: NavigatableSetting<'content'> = {
    type: 'navigatable',
    title: 'Blacklist uploaders...',
    store: 'content',
    for: 'excludedUploaders',
    to: 'Home',
  };

  return {
    slug: 'content',
    title: 'Content',
    settings: [
      contentRatingSetting,
      excludedGroupsSetting,
      excludedUploadersSetting,
    ],
    disabled: true,
  };
}

export function useLanguageSettingsSection(): SettingSectionPresenter {
  const availableTranslatedLanguageSetting: NavigatableSetting<'language'> = {
    type: 'navigatable',
    title: 'Available in language',
    store: 'language',
    for: 'availableTranslatedLanguage',
    to: 'Home',
  };

  const translatedLanguageSetting: NavigatableSetting<'language'> = {
    type: 'navigatable',
    title: 'Chapter languge',
    store: 'language',
    for: 'translatedLanguage',
    to: 'Home',
  };

  const excludedOriginalLanguageSetting: NavigatableSetting<'language'> = {
    type: 'navigatable',
    title: 'Excluded original language',
    store: 'language',
    for: 'excludedOriginalLanguage',
    to: 'Home',
  };

  const originalLanguageSetting: NavigatableSetting<'language'> = {
    type: 'navigatable',
    title: 'Original language',
    store: 'language',
    for: 'originalLanguage',
    to: 'Home',
  };

  return {
    slug: 'language',
    title: 'Language',
    settings: [
      translatedLanguageSetting,
      availableTranslatedLanguageSetting,
      originalLanguageSetting,
      excludedOriginalLanguageSetting,
    ],
    disabled: true,
  };
}

export function useMangaReaderSettingsSection(): SettingSectionPresenter {
  const atHomeSetting: ToggleSetting<'reader', boolean> = {
    type: 'toggle',
    title: 'Images over HTTPS',
    subtitle:
      'Disable if images cannot be downloaded over coorporate or school networks.',
    store: 'reader',
    for: 'atHomeHttps',
    onToggle: value => !value,
  };

  const dataSaverSetting: ToggleSetting<'reader', boolean> = {
    type: 'toggle',
    title: 'Data saver',
    subtitle: 'Saves bandwidth while downloading chapter images when set.',
    store: 'reader',
    for: 'dataSaver',
    onToggle: value => !value,
  };

  return {
    slug: 'reader',
    title: 'Manga reader',
    settings: [atHomeSetting, dataSaverSetting],
  };
}

export function useSettingsPresenters(): Array<SettingSectionPresenter> {
  return [
    useAppearanceSettingsSection(),
    useContentSettingsSection(),
    useLanguageSettingsSection(),
    useMangaReaderSettingsSection(),
  ];
}
