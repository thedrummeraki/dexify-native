import React from 'react';
import MangaQuickSearchCollection from '@app/components/MangaQuickSearchCollection';
import {sharedStyles} from '@app/utils/styles';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView style={sharedStyles.flex}>
      <MangaQuickSearchCollection />
    </SafeAreaView>
  );
}
