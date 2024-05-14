import React from 'react';
import {SceneContainer} from '@app/components';
import {useShowMangaChaptersRoute} from '@app/foundation/navigation';
import {Manga} from '@app/api/mangadex/types';
import ShowMangaChaptersSceneDetails from './ShowMangaChaptersSceneDetails';

export default function ShowMangaChaptersScene() {
  const route = useShowMangaChaptersRoute();
  const manga = route.params as Manga;

  return (
    <SceneContainer title="Browse manga chapters">
      <ShowMangaChaptersSceneDetails manga={manga} />
    </SceneContainer>
  );
}
