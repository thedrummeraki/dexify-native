import React from 'react';
import {Manga} from '@app/api/mangadex/types';
import {
  findRelationships,
  preferredMangaTitle,
  secondaryMangaTitle,
  useContentRating,
} from '@app/api/mangadex/utils';
import {MangaSearchCollection, PaddingHorizontal} from '@app/components';
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
// import FloatingActions from './components/FloatingActions';

export interface ShowMangaSceneDetailsProps {
  manga: Manga;
}

export default function ShowMangaSceneDetails({
  manga,
}: ShowMangaSceneDetailsProps) {
  const secondaryTitle = secondaryMangaTitle(manga);
  const relatedMangaIds = findRelationships(manga, 'manga').map(
    relationship => relationship.id,
  );
  const contentRating = useContentRating();

  const VolumesListHeaderComponent = (
    <View style={{marginHorizontal: spacing(-2), gap: spacing(3)}}>
      <Poster />
      <PaddingHorizontal spacing={2} style={{gap: spacing(1)}}>
        <Text variant="titleLarge">{preferredMangaTitle(manga)}</Text>
        {secondaryTitle && <Text variant="titleSmall">{secondaryTitle}</Text>}
        <AuthorsArtists />
      </PaddingHorizontal>
      <PaddingHorizontal spacing={2} style={{gap: spacing(2)}}>
        <Publication />
        <Stats />
        <MainActions />
        <Description />
      </PaddingHorizontal>
    </View>
  );

  // const VolumesListFooterComponent = (
  //   <View style={{marginTop: spacing(4), gap: spacing(3)}}>
  //     {relatedMangaIds.length ? (
  //       <>
  //         <Text variant="titleLarge">Related manga</Text>
  //         <MangaSearchCollection
  //           hidePreview
  //           hideSearchbar
  //           override={{ids: relatedMangaIds, contentRating, limit: 6}}
  //         />
  //       </>
  //     ) : null}
  //   </View>
  // );

  return (
    <SafeAreaView>
      <MangaProvider manga={manga}>
        <Volumes
          ListHeaderComponent={VolumesListHeaderComponent}
          // ListFooterComponent={VolumesListFooterComponent}
        />
        {/* <View style={sharedStyles.flex}>
          <FloatingActions />
        </View> */}
      </MangaProvider>
    </SafeAreaView>
  );
}
