import React from 'react';
import {sharedStyles} from '@app/utils/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MangaSearchCollection} from '@app/components';
import SessionProvider from '@app/providers/SessionProvider';

export default function Browse() {
  return (
    <SessionProvider>
      <SafeAreaView style={sharedStyles.flex}>
        <MangaSearchCollection
          useFilters
          searchBarPlaceholder="Browse manga..."
        />
      </SafeAreaView>
    </SessionProvider>
  );
}
