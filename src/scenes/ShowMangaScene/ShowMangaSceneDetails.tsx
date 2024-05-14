import React from 'react';
import {Manga} from '@app/api/mangadex/types';
import {
  preferredMangaTitle,
  secondaryMangaTitle,
} from '@app/api/mangadex/utils';
import {PaddingHorizontal} from '@app/components';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {
  AuthorsArtists,
  MainActions,
  Stats,
  Publication,
  Poster,
  Description,
} from './components';
import MangaProvider from './components/MangaProvider';
import {Text} from 'react-native-paper';
import {spacing} from '@app/utils/styles';
import ChaptersSection from './components/ChaptersSection';
import CoversSection from './components/CoversSections';
import RelatedSections from './components/RelatedSection';
// import FloatingActions from './components/FloatingActions';

export interface ShowMangaSceneDetailsProps {
  manga: Manga;
}

export default function ShowMangaSceneDetails({
  manga,
}: ShowMangaSceneDetailsProps) {
  const secondaryTitle = secondaryMangaTitle(manga);

  return (
    <SafeAreaView>
      <MangaProvider manga={manga}>
        <ScrollView>
          <View style={{gap: spacing(3)}}>
            <Poster />
            <PaddingHorizontal spacing={2} style={{gap: spacing(1)}}>
              <Text variant="titleLarge">{preferredMangaTitle(manga)}</Text>
              {secondaryTitle && (
                <Text variant="titleSmall">{secondaryTitle}</Text>
              )}
              <AuthorsArtists />
            </PaddingHorizontal>
            <PaddingHorizontal spacing={2} style={{gap: spacing(2)}}>
              <Publication />
              <Stats />
              <MainActions />
              <Description />
            </PaddingHorizontal>
            <View style={{marginBottom: spacing(8)}}>
              <ChaptersSection showFirst={3} />
              <CoversSection />
              <RelatedSections />
            </View>
          </View>
        </ScrollView>
        {/* <View style={sharedStyles.flex}>
          <FloatingActions />
        </View> */}
      </MangaProvider>
    </SafeAreaView>
  );
}
