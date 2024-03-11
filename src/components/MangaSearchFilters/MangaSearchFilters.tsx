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
import {
  FilterParamsState,
  PartialFilterParamsState,
  sanitizeFilters,
} from '@app/foundation/state/filters';
import {useFiltersStore} from '@app/foundation/state/StaterinoProvider';

export interface MangaSearchFiltersProps {
  onSubmit?(params: FilterParamsState): void;
  onClose?(): void;
}

export default function MangaSearchFilters({
  onSubmit,
  onClose,
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
  const dirty = useMemo(() => {
    const currentState: PartialFilterParamsState = sanitizeFilters(state);
    const newState: PartialFilterParamsState = sanitizeFilters(fields);

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
        const newValue = newState[key as keyof PartialFilterParamsState];

        if (Array.isArray(newValue) && Array.isArray(value)) {
          const strValues = value.map(String);
          const strNewValues = newValue.map(String);

          return !(
            strValues.every(strkey => strNewValues.includes(strkey)) &&
            strNewValues.every(strkey => strValues.includes(strkey))
          );
        } else {
          console.log({newValue, value});
          return newValue !== value;
        }
      },
    );

    return someValuesMismatch;
  }, [state, fields]);

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
        {dirty ? (
          <Button mode="contained" onPress={() => onSubmit?.(fields)}>
            Save
          </Button>
        ) : (
          <Button mode="outlined" onPress={onClose}>
            Close
          </Button>
        )}
      </View>
    </View>
  );
}

function tagValueAsKey(value: Manga.Tag) {
  return value.id;
}
