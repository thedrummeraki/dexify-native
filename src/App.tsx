import React from 'react';
import {Root} from './components';
import {PaperProvider} from 'react-native-paper';
import TagsProvider from './providers/TagsProvider';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import LibraryProvider from './providers/LibraryProvider';
import UnleashProvider from './providers/UnleashProvider';

export function App() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UnleashProvider>
        <PaperProvider>
          <TagsProvider>
            <LibraryProvider>
              <Root />
            </LibraryProvider>
          </TagsProvider>
        </PaperProvider>
      </UnleashProvider>
    </NavigationContainer>
  );
}
