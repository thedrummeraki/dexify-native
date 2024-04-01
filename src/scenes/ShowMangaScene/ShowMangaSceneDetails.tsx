import {Manga} from '@app/api/mangadex/types';
import {
  preferredMangaTitle,
  secondaryMangaTitle,
} from '@app/api/mangadex/utils';
import {PaddingHorizontal, SceneContainer} from '@app/components';
import {FlatList, SafeAreaView, ScrollView, View} from 'react-native';
import {
  AuthorsArtists,
  MainActions,
  Stats,
  Publication,
  Poster,
  Volumes,
} from './components';
import MangaProvider from './components/MangaProvider';
import {Text} from 'react-native-paper';
import {spacing} from '@app/utils/styles';
import {useDexifyNavigation} from '@app/foundation/navigation';

export interface ShowMangaSceneDetailsProps {
  manga: Manga;
}

export default function ShowMangaSceneDetails({
  manga,
}: ShowMangaSceneDetailsProps) {
  const navigation = useDexifyNavigation();

  const VolumesListHeaderComponent = (
    <>
      <Poster />
      <View>
        <Text variant="titleLarge">{preferredMangaTitle(manga)}</Text>
        <Text variant="titleSmall">{secondaryMangaTitle(manga)}</Text>
        <AuthorsArtists />
      </View>
      <View>
        <Publication />
        <Stats />
        <MainActions />
      </View>
    </>
  );

  return (
    <SafeAreaView>
      <MangaProvider manga={manga}>
        <Volumes ListHeaderComponent={VolumesListHeaderComponent} />
      </MangaProvider>
    </SafeAreaView>
  );
}
