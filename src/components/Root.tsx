import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AuthorArtistScene,
  FiltersScene,
  HomeScene,
  ShowMangaDetailsModalScene,
  ShowMangaScene,
} from '@app/scenes';
import {RootStackParamList} from '@app/foundation/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Root() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={HomeScene}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ShowManga"
          component={ShowMangaScene}
          options={{headerShown: false}}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{presentation: 'fullScreenModal', headerShown: false}}>
        <Stack.Screen name="Filters" component={FiltersScene} />
        <Stack.Screen
          name="ShowMangaDetailsModal"
          component={ShowMangaDetailsModalScene}
        />
        <Stack.Screen name="ShowArtist" component={AuthorArtistScene} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
