import {BasicResultsResponse, CustomList, Manga} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useDeleteRequest, usePostRequest} from '@app/api/utils';
import {SceneContainer} from '@app/components';
import {useShowMangaDetailsModalRoute} from '@app/foundation/navigation';
import React, {useState} from 'react';
import MDListsDetails from './HomeScene/bottomNavScenes/MDLists/MDListsDetails';
import {sharedStyles} from '@app/utils/styles';
import {View} from 'react-native';
import {useStore} from '@app/foundation/state/StaterinoProvider';

export default function ShowMangaMDListsModalScene() {
  const {set} = useStore;
  const route = useShowMangaDetailsModalRoute();
  const manga = route.params as Manga;

  const [customLists, loading] = useStore([
    state => state.mdLists.raw,
    state => state.mdLists.loading,
  ]);
  const [submitting, setSubmitting] = useState(false);

  const [post] = usePostRequest<BasicResultsResponse>(undefined, {
    requireSession: true,
  });
  const [destroy] = useDeleteRequest<BasicResultsResponse>(undefined, {
    requireSession: true,
  });

  const selectedMDLists = useStore(state => state.mdLists.data);
  const selectedIds = selectedMDLists[manga.id] || [];

  const handleMDListOnPress = (mdList: CustomList) => {
    setSubmitting(true);
    if (selectedIds.includes(mdList.id)) {
      // remove item
      destroy(UrlBuilder.addMangaToCustomList(manga.id, mdList.id))
        .then(res => {
          if (res?.result === 'ok') {
            set({
              mdLists: {
                data: {[manga.id]: selectedIds.filter(x => x !== mdList.id)},
              },
            });
          }
        })
        .finally(() => setSubmitting(false));
    } else {
      // add item
      post(UrlBuilder.addMangaToCustomList(manga.id, mdList.id))
        .then(res => {
          if (res?.result === 'ok') {
            set({mdLists: {data: {[manga.id]: [...selectedIds, mdList.id]}}});
          }
        })
        .then(() => setSubmitting(false));
    }
  };

  return (
    <SceneContainer title="Add to MDLists...">
      <View style={sharedStyles.flex}>
        <MDListsDetails
          hideTitle
          loading={loading || submitting}
          mdLists={customLists}
          selectedIds={selectedIds}
          mangas={[manga]}
          onPress={handleMDListOnPress}
        />
      </View>
    </SceneContainer>
  );
}
