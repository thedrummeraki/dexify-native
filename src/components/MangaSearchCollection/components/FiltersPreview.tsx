import React, {useMemo} from 'react';
import {useFiltersStore} from '@app/foundation/state/StaterinoProvider';
import {Chip} from 'react-native-paper';
import {sanitizeFilters} from '@app/foundation/state/filters';
import {
  ContentRating,
  MangaRequestParams,
  MangaStatus,
  PublicationDemographic,
} from '@app/api/mangadex/types';
import {ScrollView, StyleSheet} from 'react-native';
import {spacing} from '@app/utils/styles';
import {useTags} from '@app/providers/TagsProvider';
import {preferredTagName} from '@app/api/mangadex/utils';
import {contentRatingHumanReadable} from '@app/components/MangaSearchFilters/components/ContentRatingField';
import {publicationDemographicsHumanReadableValue} from '@app/components/MangaSearchFilters/components/PublicationDemographicsField';
import {mangaStatusHumanReadable} from '@app/components/MangaSearchFilters/components/MangaStatusField';

type PreviewableParams = Pick<
  MangaRequestParams,
  | 'includedTags'
  | 'excludedTags'
  | 'contentRating'
  | 'publicationDemographic'
  | 'artists'
  | 'authors'
  | 'status'
>;

type ValueOf<T> = T[keyof T];

type PreviewableParamsKey = keyof PreviewableParams;

const previewableParamsKeys: PreviewableParamsKey[] = [
  'includedTags',
  'excludedTags',
  'contentRating',
  'publicationDemographic',
  'artists',
  'artists',
  'status',
];

type PreviewableParamsNamesMap = {
  [key in PreviewableParamsKey]: string;
};

const previewableParamsNamesMap: PreviewableParamsNamesMap = {
  contentRating: 'Rating',
  excludedTags: 'Without tags',
  includedTags: 'Tags',
  publicationDemographic: 'Demographics',
  artists: 'Artists',
  authors: 'Authors',
  status: 'Publication status',
};

export default function FiltersPreview() {
  const {params} = useFiltersStore();
  const sanitized = useMemo(() => sanitizeFilters(params), [params]);

  const validEntries: [PreviewableParamsKey, ValueOf<PreviewableParams>][] = [];
  Object.entries(sanitized).map(([key, value]) => {
    if (previewableParamsKeys.includes(key as PreviewableParamsKey)) {
      validEntries.push([
        key as PreviewableParamsKey,
        value as ValueOf<PreviewableParams>,
      ]);
    }
  });

  if (validEntries.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContentContainer}
      style={styles.root}>
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
) {
  const allTags = useTags();

  switch (key) {
    case 'excludedTags':
    case 'includedTags':
      const tagIds = value as string[];
      const tags = allTags.filter(tag => tagIds.includes(tag.id));
      return tags.map(preferredTagName).join(', ');
    case 'artists':
    case 'authors':
      const count = (value as string[]).length;
      const singularKey = key.substring(0, key.length - 1);
      return count === 1 ? `1 ${singularKey}` : `${count} ${key}`;
    case 'contentRating':
      const contentRatings = value as ContentRating[];
      return contentRatings.map(contentRatingHumanReadable).join(', ');
    case 'publicationDemographic':
      const publicationDemographics = value as PublicationDemographic[];
      return publicationDemographics
        .map(publicationDemographicsHumanReadableValue)
        .join(', ');
    case 'status':
      const status = value as MangaStatus[];
      return status.map(mangaStatusHumanReadable).join(', ');
    default:
      return String(value);
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: spacing(1),
    marginBottom: spacing(2),
  },
  scrollViewContentContainer: {
    gap: spacing(2),
    marginLeft: spacing(2),
    paddingRight: spacing(4),
  },
});
