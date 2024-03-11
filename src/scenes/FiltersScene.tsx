import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useFiltersStore} from '@app/foundation/state/StaterinoProvider';
import {MangaSearchFilters} from '@app/components';

export default function FiltersScene() {
  const navigation = useNavigation();
  const {setParams} = useFiltersStore();

  return (
    <MangaSearchFilters
      onSubmit={params => {
        setParams(params);
        navigation.goBack();
      }}
      onClose={navigation.goBack}
    />
  );
}
