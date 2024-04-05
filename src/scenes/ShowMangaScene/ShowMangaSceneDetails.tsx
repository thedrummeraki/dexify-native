import {Manga} from '@app/api/mangadex/types';
import {
  preferredMangaTitle,
  secondaryMangaTitle,
} from '@app/api/mangadex/utils';
import {PaddingHorizontal} from '@app/components';
import {SafeAreaView, View} from 'react-native';
import {
  AuthorsArtists,
  MainActions,
  Stats,
  Publication,
  Poster,
  Volumes,
  Description,
} from './components';
import MangaProvider from './components/MangaProvider';
import {Text} from 'react-native-paper';
import {spacing} from '@app/utils/styles';

export interface ShowMangaSceneDetailsProps {
  manga: Manga;
}

export default function ShowMangaSceneDetails({
  manga,
}: ShowMangaSceneDetailsProps) {
  const secondaryTitle = secondaryMangaTitle(manga);

  const VolumesListHeaderComponent = (
    <View style={{marginHorizontal: spacing(-1), gap: spacing(3)}}>
      <Poster />
      <PaddingHorizontal style={{gap: spacing(1)}}>
        <Text variant="titleLarge">{preferredMangaTitle(manga)}</Text>
        {secondaryTitle && <Text variant="titleSmall">{secondaryTitle}</Text>}
        <AuthorsArtists />
      </PaddingHorizontal>
      <PaddingHorizontal style={{gap: spacing(2)}}>
        <Publication />
        <Stats />
        <MainActions />
        <Description />
      </PaddingHorizontal>
    </View>
  );

  return (
    <SafeAreaView>
      <MangaProvider manga={manga}>
        <Volumes ListHeaderComponent={VolumesListHeaderComponent} />
      </MangaProvider>
    </SafeAreaView>
  );
}
