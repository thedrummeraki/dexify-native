import {
  ContentRating,
  Manga,
  MangaRequestParams,
  PublicationDemographic,
  TagMode,
} from '@app/api/mangadex/types';

import staterino from 'staterino';
import merge from 'mergerino';
import React, {useCallback, useLayoutEffect, useReducer} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {sharedStyles} from '@app/utils/styles';
import {useTags} from '@app/providers/TagsProvider';
import TagsFields from './components/TagsField';
import {preferredTagName} from '@app/api/mangadex/utils';
import PublicationDemographicsField from './components/PublicationDemographicsField';
import ContentRatingField from './components/ContentRatingField';
import {Button, Text} from 'react-native-paper';

export interface SearchFormProps {
  visible: boolean;
  onSubmit(params: FormState): void;
}

export type FormState = Required<
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

const defaultState = (): FormState => ({
  availableTranslatedLanguage: [],
  contentRating: [ContentRating.safe, ContentRating.suggestive],
  publicationDemographic: [],
  includedTags: [],
  excludedTags: [],
  includedTagsMode: TagMode.AND,
  excludedTagsMode: TagMode.OR,
  title: '',
  status: [],
});

const useStore = staterino({
  hooks: {useLayoutEffect, useReducer},
  merge,
  state: defaultState(),
});

export default function SearchForm({visible, onSubmit}: SearchFormProps) {
  const allTags = useTags();

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

  // const handleSubmit = useCallback(
  //   (fields: FormState) => {
  //     const entries = Object.entries(fields).filter(([_, value]) => {
  //       if (typeof value === 'string' || Array.isArray(value)) {
  //         return value.length > 0;
  //       } else if (typeof value === 'object') {
  //         return Object.keys(value).length > 0;
  //       } else {
  //         return value !== undefined && value !== null;
  //       }
  //     });

  //     const result = Object.fromEntries(entries) as FormState;
  //     onSubmit(result);
  //   },
  //   [onSubmit],
  // );

  const fields = useStore();

  return (
    <View style={visible ? styles.visibleRoot : styles.hiddenRoot}>
      <ScrollView style={sharedStyles.flex}>
        <View style={{flex: 1, gap: 16, padding: 8}}>
          <Text variant="titleLarge">Filters</Text>
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
      <Button onPress={() => onSubmit(fields)}>Save</Button>
    </View>
  );
}

function tagValueAsKey(value: Manga.Tag) {
  return value.id;
}

const styles = StyleSheet.create({
  visibleRoot: {display: 'flex', flex: 1},
  hiddenRoot: {display: 'none'},
});
