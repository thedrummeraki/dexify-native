import {
  ContentRating,
  Manga,
  MangaStatus,
  PublicationDemographic,
} from '@app/api/mangadex/types';

import React, {useCallback, useMemo} from 'react';
import {ScrollView, View} from 'react-native';
import {sharedStyles, spacing} from '@app/utils/styles';
import {useTags} from '@app/providers/TagsProvider';
import TagsFields from './components/TagsField';
import {preferredTagName} from '@app/api/mangadex/utils';
import PublicationDemographicsField from './components/PublicationDemographicsField';
import ContentRatingField from './components/ContentRatingField';
import {Button, useTheme} from 'react-native-paper';
import {FilterParamsState, useIsDirty} from '@app/foundation/state/filters';
import {
  useFiltersStore,
  useUserStore,
} from '@app/foundation/state/StaterinoProvider';
import MangaStatusField from './components/MangaStatusField';
import {useMergerinoState} from '@app/utils';

export interface MangaSearchFiltersProps {
  onSubmit?(params: FilterParamsState): void;
  onClose?(): void;
}

export default function MangaSearchFilters({
  onSubmit,
  onClose,
}: MangaSearchFiltersProps) {
  const {params: state} = useFiltersStore();
  const {user} = useUserStore();

  const contentRatings = useMemo(() => {
    const values = [
      ContentRating.safe,
      ContentRating.suggestive,
      ContentRating.erotica,
    ];
    if (user) {
      values.push(ContentRating.pornographic);
    }

    return values;
  }, [user]);

  const [fields, set] = useMergerinoState(state);

  const allTags = useTags();
  const {
    colors: {background: backgroundColor},
  } = useTheme();

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

  const onMangaStatusChange = useCallback(
    (status: MangaStatus[]) => {
      set({status});
    },
    [set],
  );

  const onTagsChange = useCallback(
    (includedTags: string[], excludedTags: string[]) =>
      set({includedTags, excludedTags}),
    [set],
  );

  // const fields = useStore();
  const dirty = useIsDirty(state, fields);

  return (
    <View style={[sharedStyles.flex, {backgroundColor}]}>
      <ScrollView style={sharedStyles.flex}>
        <View
          style={[sharedStyles.flex, {gap: spacing(4), padding: spacing(2)}]}>
          <ContentRatingField
            values={contentRatings}
            onChange={onContentFieldChange}
            selected={fields.contentRating}
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
          <MangaStatusField
            values={Object.values(MangaStatus)}
            onChange={onMangaStatusChange}
            selected={fields.status}
          />
        </View>
      </ScrollView>
      <View style={{padding: spacing(2)}}>
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
