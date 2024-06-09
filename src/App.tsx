import React, {PropsWithChildren} from 'react';
import {Root} from './components';
import TagsProvider from './providers/TagsProvider';
import {
  NavigationContainer,
  // DarkTheme,
  // DefaultTheme,
} from '@react-navigation/native';
import {
  PaperProvider,
  MD3DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import LibraryProvider from './providers/LibraryProvider';
// import UnleashProvider from './providers/UnleashProvider';

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {adaptNavigationTheme} from 'react-native-paper';
import StaterinoProvider, {
  useStore,
} from './foundation/state/StaterinoProvider';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import merge from 'mergerino';
import {StatusBar} from 'react-native';

export function App() {
  return (
    <GestureHandlerRootView>
      <StaterinoProvider>
        <AppearanceProvider>
          {/* <UnleashProvider> */}
          <TagsProvider>
            <LibraryProvider>
              <Root />
            </LibraryProvider>
          </TagsProvider>
          {/* </UnleashProvider> */}
        </AppearanceProvider>
      </StaterinoProvider>
    </GestureHandlerRootView>
  );
}

function AppearanceProvider({children}: PropsWithChildren<unknown>) {
  const scheme = useStore(store => store.settings.appearance.scheme);

  const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
  const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

  return (
    <>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : LightTheme}>
        <PaperProvider
          theme={scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
          {children}
        </PaperProvider>
      </NavigationContainer>
    </>
  );
}
