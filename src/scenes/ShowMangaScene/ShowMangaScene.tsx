import React from 'react';
import {useShowMangaRoute} from '@app/foundation/navigation';
import ShowMangaSceneDetails from './ShowMangaSceneDetails';
import {Text} from 'react-native';

export default function ShowMangaScene() {
  const route = useShowMangaRoute();
  const manga = route.params;

  if (manga.attributes && manga.relationships) {
    return (
      <ShowMangaSceneDetails
        manga={{
          type: 'manga',
          attributes: manga.attributes,
          relationships: manga.relationships,
          ...manga,
        }}
      />
    );
  }

  return <Text>Please wait...</Text>;
}
