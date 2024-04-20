import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AuthorArtistScene,
  CustomListScene,
  FiltersScene,
  HomeScene,
  ShowMangaDetailsModalScene,
  ShowMangaLibraryModalScene,
  ShowMangaScene,
  ShowMangaVolumeScene,
} from '@app/scenes';
import {RootStackParamList} from '@app/foundation/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Root() {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScene} />
        <Stack.Screen name="ShowManga" component={ShowMangaScene} />
        <Stack.Screen name="ShowArtist" component={AuthorArtistScene} />
        <Stack.Screen name="ShowCustomList" component={CustomListScene} />
        <Stack.Screen name="ShowMangaVolume" component={ShowMangaVolumeScene} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{presentation: 'fullScreenModal', headerShown: false}}>
        <Stack.Screen name="Filters" component={FiltersScene} />
        <Stack.Screen
          name="ShowMangaDetailsModal"
          component={ShowMangaDetailsModalScene}
        />
        <Stack.Screen
          name="ShowMangaLibraryModal"
          component={ShowMangaLibraryModalScene}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
