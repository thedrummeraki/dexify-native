import React from 'react';
import {Root} from './components';
import {PaperProvider} from 'react-native-paper';
import TagsProvider from './providers/TagsProvider';
import {
  NavigationContainer,
  // DarkTheme,
  // DefaultTheme,
} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import LibraryProvider from './providers/LibraryProvider';
import UnleashProvider from './providers/UnleashProvider';

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {adaptNavigationTheme} from 'react-native-paper';
import StaterinoProvider from './foundation/state/StaterinoProvider';

export function App() {
  const scheme = useColorScheme();

  const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : LightTheme}>
      <StaterinoProvider>
        <UnleashProvider>
          <PaperProvider>
            <TagsProvider>
              <LibraryProvider>
                <Root />
              </LibraryProvider>
            </TagsProvider>
          </PaperProvider>
        </UnleashProvider>
      </StaterinoProvider>
    </NavigationContainer>
  );
}
