import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AuthorArtistScene,
  ChapterFiltersScene,
  CustomListScene,
  FiltersScene,
  HomeScene,
  SettingView,
  ShowChapterScene,
  ShowMangaChaptersScene,
  ShowMangaDetailsModalScene,
  ShowMangaLibraryModalScene,
  ShowMangaMDListsModalScene,
  ShowMangaScene,
  ShowMangaVolumeScene,
} from '@app/scenes';
import {RootStackParamList} from '@app/foundation/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Root() {
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{headerShown: false, orientation: 'portrait'}}>
        <Stack.Screen name="Home" component={HomeScene} />
        <Stack.Screen name="ShowManga" component={ShowMangaScene} />
        <Stack.Screen name="ShowArtist" component={AuthorArtistScene} />
        <Stack.Screen name="ShowCustomList" component={CustomListScene} />
        <Stack.Screen name="ShowMangaVolume" component={ShowMangaVolumeScene} />
        <Stack.Screen
          name="ShowMangaChapters"
          component={ShowMangaChaptersScene}
        />
        <Stack.Screen name="ShowChapter" component={ShowChapterScene} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{presentation: 'fullScreenModal', headerShown: false}}>
        <Stack.Screen name="Filters" component={FiltersScene} />
        <Stack.Screen name="ChapterFilters" component={ChapterFiltersScene} />
        <Stack.Screen
          name="ShowMangaDetailsModal"
          component={ShowMangaDetailsModalScene}
        />
        <Stack.Screen
          name="ShowMangaLibraryModal"
          component={ShowMangaLibraryModalScene}
        />
        <Stack.Screen
          name="ShowMangaMDListsModal"
          component={ShowMangaMDListsModalScene}
        />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen
          name="SettingView"
          component={SettingView}
          options={({route}) => ({title: route.params.setting.title})}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
