import React from 'react';
import {Root} from './components';
import {PaperProvider} from 'react-native-paper';
import StaterinoProvider from './foundation/state/StaterinoProvider';

export function App() {
  return (
    <PaperProvider>
      <StaterinoProvider>
        <Root />
      </StaterinoProvider>
    </PaperProvider>
  );
}
