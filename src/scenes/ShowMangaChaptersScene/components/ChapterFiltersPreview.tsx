import React, {useMemo} from 'react';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {Chip} from 'react-native-paper';
import {sanitizeFilters} from '@app/foundation/state/filters';
import {ChapterRequestParams, Manga} from '@app/api/mangadex/types';
import {ScrollView} from 'react-native';
import {sharedStyles} from '@app/utils/styles';
import {sanitizeOptions} from '../ShowMangaChaptersSceneDetails';

type PreviewableParams = Pick<
  ChapterRequestParams,
  | 'excludedOriginalLanguage'
  | 'originalLanguage'
  | 'translatedLanguage'
  | 'volume'
>;

type ValueOf<T> = T[keyof T];

type PreviewableParamsKey = keyof PreviewableParams;

const previewableParamsKeys: PreviewableParamsKey[] = [
  'excludedOriginalLanguage',
  'originalLanguage',
  'translatedLanguage',
  'volume',
];

type PreviewableParamsNamesMap = {
  [key in PreviewableParamsKey]: string;
};

const previewableParamsNamesMap: PreviewableParamsNamesMap = {
  excludedOriginalLanguage: 'Not originally in',
  originalLanguage: 'Originally in',
  translatedLanguage: 'Translated in',
  volume: 'Volume',
};

export interface ChapterFiltersPreviewProps {
  manga: Manga;
}

export default function ChapterFiltersPreview({
  manga,
}: ChapterFiltersPreviewProps) {
  const {set} = useStore;
  const [order, params] = useStore(state => [
    state.chapterFilters.sort.order,
    state.chapterFilters.params,
  ]);
  const chapterSortOrder = order.chapter || 'desc';

  const handleToggleOrder = () => {
    set({
      chapterFilters: {
        sort: {
          order: {
            chapter: chapterSortOrder === 'desc' ? 'asc' : 'desc',
          },
        },
      },
    });
  };

  const sanitized = useMemo(() => {
    const relevantParams = sanitizeOptions(params, manga);
    const cleanedParams = sanitizeFilters(relevantParams);

    return cleanedParams;
  }, [params, manga]);

  const validEntries: [PreviewableParamsKey, ValueOf<PreviewableParams>][] = [];
  Object.entries(sanitized).map(([key, value]) => {
    if (previewableParamsKeys.includes(key as PreviewableParamsKey)) {
      validEntries.push([
        key as PreviewableParamsKey,
        value as ValueOf<PreviewableParams>,
      ]);
    }
  });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[sharedStyles.tightContainer]}>
      <Chip
        icon={chapterSortOrder === 'asc' ? 'sort-ascending' : 'sort-descending'}
        onPress={handleToggleOrder}>
        {chapterSortOrder === 'asc' ? 'Ascending' : 'Descending'}
      </Chip>
      {validEntries.map(([key, value]) => (
        <PreviewChip key={key} clef={key} value={value} />
      ))}
    </ScrollView>
  );
}

interface PreviewChipProps {
  // clef = key in french :p (key is a special prop in React)
  clef: PreviewableParamsKey;
  value: ValueOf<PreviewableParams>;
  onClose?(): void;
}

function PreviewChip({clef, value, onClose}: PreviewChipProps) {
  const name = previewableParamsNamesMap[clef];
  const values = useHumanReadableValues(clef, value);

  return (
    <Chip onClose={onClose}>
      {name}: {values}
    </Chip>
  );
}

function useHumanReadableValues(
  key: PreviewableParamsKey,
  value: ValueOf<PreviewableParams>,
): string {
  switch (key) {
    case 'excludedOriginalLanguage':
    case 'originalLanguage':
    case 'translatedLanguage':
      const locales = value as string[];
      return locales.map(locale => locale.toLocaleUpperCase()).join(', ');
    case 'volume':
      return String(value);
    default:
      return String(value);
  }
}
