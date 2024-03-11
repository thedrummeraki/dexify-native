import {
  ContentRating,
  Manga,
  PublicationDemographic,
} from '@app/api/mangadex/types';

import staterino from 'staterino';
import merge from 'mergerino';
import React, {useCallback, useLayoutEffect, useMemo, useReducer} from 'react';
import {ScrollView, View} from 'react-native';
import {sharedStyles, spacing} from '@app/utils/styles';
import {useTags} from '@app/providers/TagsProvider';
import TagsFields from './components/TagsField';
import {preferredTagName} from '@app/api/mangadex/utils';
import PublicationDemographicsField from './components/PublicationDemographicsField';
import ContentRatingField from './components/ContentRatingField';
import {Button, useTheme} from 'react-native-paper';
import {FilterParamsState} from '@app/foundation/state/filters';
import {useFiltersStore} from '@app/foundation/state/StaterinoProvider';

export interface MangaSearchFiltersProps {
  onSubmit(params: FilterParamsState): void;
}

export default function MangaSearchFilters({
  onSubmit,
}: MangaSearchFiltersProps) {
  const {params: state} = useFiltersStore();

  const useStore = useMemo(() => {
    return staterino({
      hooks: {useLayoutEffect, useReducer},
      merge,
      state,
    });
  }, [state]);

  const allTags = useTags();
  const {
    colors: {background: backgroundColor, backdrop},
  } = useTheme();

  const {set} = useStore;

  const onContentFieldChange = useCallback(
    (contentRating: ContentRating[]) => {
      set({contentRating});
    },
    [set],
  );

  const onPublicationDemographicsChange = useCallback(
    (publicationDemographic: PublicationDemographic[]) => {
      set({publicationDemographic});
    },
    [set],
  );

  const onTagsChange = useCallback(
    (includedTags: string[], excludedTags: string[]) =>
      set({includedTags, excludedTags}),
    [set],
  );

  const fields = useStore();

  return (
    <View style={[sharedStyles.flex, {backgroundColor}]}>
      <ScrollView style={sharedStyles.flex}>
        <View
          style={[sharedStyles.flex, {gap: spacing(4), padding: spacing(2)}]}>
          <ContentRatingField
            values={[
              ContentRating.safe,
              ContentRating.suggestive,
              ContentRating.erotica,
              ContentRating.pornographic,
            ]}
            onChange={onContentFieldChange}
            selected={fields.contentRating}
          />
          <PublicationDemographicsField
            values={[
              PublicationDemographic.shonen,
              PublicationDemographic.shoujo,
              PublicationDemographic.seinen,
              PublicationDemographic.josei,
              PublicationDemographic.none,
            ]}
            onChange={onPublicationDemographicsChange}
            selected={fields.publicationDemographic}
          />
          <TagsFields
            values={allTags}
            title="Tags"
            onSelectionChange={onTagsChange}
            included={fields.includedTags}
            excluded={fields.excludedTags}
            humanReadableValue={preferredTagName}
            valueAsKey={tagValueAsKey}
          />
        </View>
      </ScrollView>
      <View style={{padding: spacing(2), backgroundColor: backdrop}}>
        <Button mode="contained" onPress={() => onSubmit(fields)}>
          Save
        </Button>
      </View>
    </View>
  );
}

function tagValueAsKey(value: Manga.Tag) {
  return value.id;
}
