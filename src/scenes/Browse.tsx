import React from 'react';
import {sharedStyles} from '@app/utils/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MangaSearchCollection} from '@app/components';

export default function Browse() {
  return (
    <SafeAreaView style={sharedStyles.flex}>
      <MangaSearchCollection
        useFilters
        searchBarPlaceholder="Browse manga..."
      />
    </SafeAreaView>
  );
}
