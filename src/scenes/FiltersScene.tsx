import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useFiltersStore} from '@app/foundation/state/StaterinoProvider';
import {MangaSearchFilters, SceneContainer} from '@app/components';

export default function FiltersScene() {
  const navigation = useNavigation();
  const {setParams} = useFiltersStore();

  return (
    <SceneContainer title="Filters">
      <MangaSearchFilters
        onSubmit={params => {
          setParams(params);
          navigation.goBack();
        }}
        onClose={navigation.goBack}
      />
    </SceneContainer>
  );
}
