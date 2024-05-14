import {Manga} from '@app/api/mangadex/types';

import merge, {MultipleTopLevelPatch} from 'mergerino';
import React, {useCallback, useReducer} from 'react';
import {ScrollView, View} from 'react-native';
import {sharedStyles, spacing} from '@app/utils/styles';
import {Button, useTheme} from 'react-native-paper';
import {
  ChapterFiltersParamsState,
  useIsDirty,
} from '@app/foundation/state/filters';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import MultiSelectSimpleField from '../MangaSearchFilters/components/MultiSelectSimpleField';

export interface MangaSearchFiltersProps {
  manga: Manga;
  onSubmit?(params: ChapterFiltersParamsState): void;
  onClose?(): void;
}

export default function ChapterSearchFilters({
  manga,
  onSubmit,
  onClose,
}: MangaSearchFiltersProps) {
  const state = useStore(currentState => currentState.chapterFilters.params);

  const [fields, set] = useReducer(
    (a: typeof state, p: MultipleTopLevelPatch<typeof state>) => merge(a, p),
    state,
  );

  const {
    colors: {background: backgroundColor},
  } = useTheme();

  const handleTranslatedLanguage = useCallback(
    (translatedLanguage: string[]) => set({translatedLanguage}),
    [set],
  );

  // const fields = useStore();
  const dirty = useIsDirty(state, fields);

  return (
    <View style={[sharedStyles.flex, {backgroundColor}]}>
      <ScrollView style={sharedStyles.flex}>
        <View
          style={[sharedStyles.flex, {gap: spacing(4), padding: spacing(2)}]}>
          <MultiSelectSimpleField
            title="Read chapters in"
            values={manga.attributes.availableTranslatedLanguages}
            onChange={handleTranslatedLanguage}
            selected={fields.translatedLanguage}
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
        {/* <Button mode="outlined" onPress={onClose}>
          Close
        </Button> */}
      </View>
    </View>
  );
}
