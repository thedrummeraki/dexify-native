import React, {useEffect, useMemo, useState} from 'react';
import {ContentRating, CustomList} from '@app/api/mangadex/types';
import {findRelationships} from '@app/api/mangadex/utils';
import {MangaSearchCollection, SceneContainer} from '@app/components';
import {useMDTitlesCount} from '../HomeScene/bottomNavScenes/MDLists/MDListPreview';
import {useDexifyNavigation} from '@app/foundation/navigation';
import {useStore} from '@app/foundation/state/StaterinoProvider';

export interface CustomListSceneDetailsProps {
  customList: CustomList;
}

export default function CustomListSceneDetails({
  customList,
}: CustomListSceneDetailsProps) {
  const {raw} = useStore(state => state.mdLists);
  const mangaIds = useMemo(() => {
    const mdList = raw.find(current => current.id === customList.id);
    console.log({mdList});

    return mdList ? findRelationships(mdList, 'manga').map(x => x.id) : [];
  }, [raw, customList.id]);

  const subtitle = useMDTitlesCount(customList);

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
