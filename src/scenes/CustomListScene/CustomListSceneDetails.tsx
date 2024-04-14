import {CustomList} from '@app/api/mangadex/types';
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

  return (
    <SceneContainer title={customList.attributes.name}>
      <MangaSearchCollection useFilters override={{ids: mangaIds}} requireIds />
    </SceneContainer>
  );
}
