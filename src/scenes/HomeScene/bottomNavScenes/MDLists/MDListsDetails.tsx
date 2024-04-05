import {
  CoverArt,
  CustomList,
  Manga,
  PagedResultsList,
  isSuccess,
} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {findRelationship, findRelationships} from '@app/api/mangadex/utils';
import {useLazyGetRequest} from '@app/api/utils';
import {Padding} from '@app/components';
import {sharedStyles, spacing} from '@app/utils/styles';
import React, {useEffect, useMemo} from 'react';
import {FlatList, Image, SafeAreaView, View} from 'react-native';
import {
  Caption,
  Card,
  List,
  ProgressBar,
  Text,
  useTheme,
} from 'react-native-paper';
import {MDListPreview} from './MDListPreview';

export interface MDListsDetailsProps {
  loading: boolean;
  mdLists: CustomList[];
  coverArts: CoverArt[];
}

export default function MDListsDetails({
  loading,
  mdLists,
  coverArts,
}: MDListsDetailsProps) {
  return (
    <SafeAreaView style={sharedStyles.flex}>
      <View style={sharedStyles.container}>
        <Text variant="titleLarge">MD Lists</Text>
        {loading && <ProgressBar indeterminate />}
      </View>
      <FlatList
        data={mdLists}
        contentContainerStyle={{gap: spacing(1), paddingHorizontal: spacing(2)}}
        renderItem={({item}) => {
          const mangaId = findRelationship(item, 'manga')?.id;
          const coverArt = mangaId
            ? coverArts.find(coverArt => {
                const coverArtMangaId = findRelationship(coverArt, 'manga')!.id;
                return coverArtMangaId === mangaId;
              }) || null
            : null;
          return <MDListPreview mdList={item} coverArt={coverArt} />;
        }}
      />
    </SafeAreaView>
  );
}
