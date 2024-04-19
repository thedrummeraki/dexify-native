import {ContentRating, CustomList} from '@app/api/mangadex/types';
import {findRelationships} from '@app/api/mangadex/utils';
import {MangaSearchCollection, SceneContainer} from '@app/components';

export interface CustomListSceneDetailsProps {
  customList: CustomList;
}

export default function CustomListSceneDetails({
  customList,
}: CustomListSceneDetailsProps) {
  const mangaRelationships = findRelationships(customList, 'manga');
  const mangaIds = mangaRelationships.map(relationship => relationship.id);

  const subtitle =
    mangaIds.length === 1 ? '1 title' : `${mangaIds.length} titles`;

  return (
    <SceneContainer title={customList.attributes.name} subtitle={subtitle}>
      <MangaSearchCollection
        hideSearchbar
        override={{ids: mangaIds, contentRating: Object.values(ContentRating)}}
        requireIds
      />
    </SceneContainer>
  );
}
