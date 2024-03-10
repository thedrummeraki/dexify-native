import React from 'react';
import {Root} from './components';
import {PaperProvider} from 'react-native-paper';
import StaterinoProvider from './foundation/state/StaterinoProvider';
import TagsProvider from './providers/TagsProvider';

export function App() {
  return (
    <PaperProvider>
      <TagsProvider>
        <StaterinoProvider>
          <Root />
        </StaterinoProvider>
      </TagsProvider>
    </PaperProvider>
  );
}
