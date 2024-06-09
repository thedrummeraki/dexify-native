import {
  AppThemeAppearance,
  RegularReadingDirection,
} from '@app/foundation/state/settings';
import {
  ToggleSetting,
  BaseSetting,
  NavigatableSetting,
  PressableSetting,
  SettingWithValue,
  SettingsKey,
  SettingValueType,
  isNavigatable,
} from './types';
import {Linking} from 'react-native';
import {ContentRating} from '@app/api/mangadex/types';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {contentRatingHumanReadable} from '@app/components/MangaSearchFilters/components/ContentRatingField';
import {useCallback} from 'react';
import {intersectPrimitives} from '@app/utils';

export interface SettingSectionPresenter {
  slug: string;
  title?: string;
  settings: Array<BaseSetting>;
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

  const itemsPerPageSetting: NavigatableSetting<'appearance', number> = {
    type: 'navigatable',
    title: 'Items per page',
    to: 'ItemsPerPage',
    for: 'itemsPerPage',
    store: 'appearance',
    showPreview: true,
    disabled: true,
    values: [25, 50, 100],
  };

  return {
    slug: 'appearance',
    title: 'Appearance',
    settings: [themeSetting, itemsPerPageSetting],
  };
}

export function useContentSettingsSection(): SettingSectionPresenter {
  const contentRatingSetting: NavigatableSetting<'content', ContentRating> = {
    type: 'navigatable',
    title: 'Content filter',
    store: 'content',
    for: 'contentRating',
    to: 'SettingView',
    showPreview: true,
    multiple: true,
    humanFriendlyPreview: (value: ContentRating | ContentRating[]) => {
      if (Array.isArray(value)) {
        return value.map(contentRatingHumanReadable).join(', ');
      }
      return contentRatingHumanReadable(value);
    },
    values: [
      ContentRating.safe,
      ContentRating.suggestive,
      ContentRating.erotica,
    ],
  };

  const excludedGroupsSetting: NavigatableSetting<'content', string> = {
    type: 'navigatable',
    title: 'Blacklist groups...',
    store: 'content',
    for: 'excludedGroups',
    to: 'Home',
    values: [],
    disabled: true,
  };

  const excludedUploadersSetting: NavigatableSetting<'content', string> = {
    type: 'navigatable',
    title: 'Blacklist uploaders...',
    store: 'content',
    for: 'excludedUploaders',
    to: 'Home',
    values: [],
    disabled: true,
  };

  return {
    slug: 'content',
    title: 'Content',
    disabled: true,
    settings: [
      contentRatingSetting,
      excludedGroupsSetting,
      excludedUploadersSetting,
    ],
  };
}

export function useLanguageSettingsSection(): SettingSectionPresenter {
  const availableTranslatedLanguageSetting: NavigatableSetting<
    'language',
    string
  > = {
    type: 'navigatable',
    title: 'Available in language',
    store: 'language',
    for: 'availableTranslatedLanguage',
    to: 'Home',
    values: ['en'],
  };

  const translatedLanguageSetting: NavigatableSetting<'language', string> = {
    type: 'navigatable',
    title: 'Chapter languge',
    store: 'language',
    for: 'translatedLanguage',
    to: 'Home',
    values: ['en'],
  };

  const excludedOriginalLanguageSetting: NavigatableSetting<
    'language',
    string
  > = {
    type: 'navigatable',
    title: 'Excluded original language',
    store: 'language',
    for: 'excludedOriginalLanguage',
    to: 'Home',
    values: ['en'],
  };

  const originalLanguageSetting: NavigatableSetting<'language', string> = {
    type: 'navigatable',
    title: 'Original language',
    store: 'language',
    for: 'originalLanguage',
    to: 'Home',
    values: ['en'],
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

  const regularDirectionSetting: NavigatableSetting<
    'reader',
    RegularReadingDirection
  > = {
    type: 'navigatable',
    title: 'Reading direction',
    subtitle:
      'Set the reading direction for regular (NOT long-strip) manga chapters.',
    store: 'reader',
    for: 'direction',
    to: 'SettingView',
    showPreview: true,
    values: [
      RegularReadingDirection.LeftToRight,
      RegularReadingDirection.RightToLeft,
    ],
    humanFriendlyPreview: (value: RegularReadingDirection) => {
      switch (value) {
        case RegularReadingDirection.LeftToRight:
          return 'Left-to-right';
        case RegularReadingDirection.RightToLeft:
          return 'Right-to-left';
      }
    },
    // onToggle: value =>
    //   value === RegularReadingDirection.LeftToRight
    //     ? RegularReadingDirection.RightToLeft
    //     : RegularReadingDirection.LeftToRight,
    // truthCondition: value => value === RegularReadingDirection.LeftToRight,
  };

  return {
    slug: 'reader',
    title: 'Manga reader',
    settings: [regularDirectionSetting, atHomeSetting, dataSaverSetting],
  };
}

export function useAboutSettingsSection(): SettingSectionPresenter {
  const setting: PressableSetting = {
    type: 'pressable',
    title: 'About Dexify...',
    icon: 'open-in-new',
    onPress: async () => {
      await Linking.openURL(
        'https://www.akinyele.ca/projects/dexify-mobile?utm_source=dexify-native',
      );
    },
  };

  return {
    title: 'Other',
    slug: 'about',
    settings: [setting],
  };
}

export function useSettingsPresenters(): Array<SettingSectionPresenter> {
  return [
    useAppearanceSettingsSection(),
    useContentSettingsSection(),
    useLanguageSettingsSection(),
    useMangaReaderSettingsSection(),
    useAboutSettingsSection(),
  ];
}

export function useSettingValue(
  setting: SettingWithValue<SettingsKey>,
): readonly [SettingValueType, (value: SettingValueType) => boolean] {
  const {
    [setting.store]: {[setting.for]: currentValue},
  } = useStore(state => state.settings);

  const isEnabled = useCallback(
    (value: SettingValueType) => {
      console.log('actual', currentValue);
      if (isNavigatable(setting) && setting.multiple) {
        // TODO: check typing here
        return intersectPrimitives(
          setting.values as any,
          currentValue,
        ).includes(value as any);
      }
      return currentValue === value;
    },
    [setting, currentValue],
  );

  return [currentValue, isEnabled];
}
