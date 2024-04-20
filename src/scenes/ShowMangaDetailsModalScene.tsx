import {Text} from 'react-native-paper';
import {preferredMangaTitle} from '@app/api/mangadex/utils';
import {useShowMangaDetailsModalRoute} from '@app/foundation/navigation';
import {Manga} from '@app/api/mangadex/types';
import {SceneContainer} from '@app/components';

export default function ShowMangaDetailsModalScene() {
  const route = useShowMangaDetailsModalRoute();
  const manga = route.params as Manga;

  return (
    <SceneContainer title={preferredMangaTitle(manga)}>
      <Text>Showing details for {preferredMangaTitle(manga)}</Text>
    </SceneContainer>
  );
}
