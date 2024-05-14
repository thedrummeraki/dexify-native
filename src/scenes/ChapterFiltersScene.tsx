import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {ChapterSearchFilters, SceneContainer} from '@app/components';
import {useChapterFiltersRoute} from '@app/foundation/navigation';
import {useStore} from '@app/foundation/state/StaterinoProvider';

export default function ChapterFiltersScene() {
  const navigation = useNavigation();
  const {
    params: {manga},
  } = useChapterFiltersRoute();
  const {set} = useStore;

  return (
    <SceneContainer canScroll title="Filters">
      <ChapterSearchFilters
        manga={manga}
        onSubmit={params => {
          set({chapterFilters: {params}});
          navigation.goBack();
        }}
        onClose={navigation.goBack}
      />
    </SceneContainer>
  );
}
