import {CoverArt, CustomList, Manga} from '@app/api/mangadex/types';
import {findRelationship} from '@app/api/mangadex/utils';
import {sharedStyles, spacing} from '@app/utils/styles';
import React from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import {ProgressBar, Text} from 'react-native-paper';
import {MDListPreview} from './MDListPreview';

export interface MDListsDetailsProps {
  loading: boolean;
  mdLists: CustomList[];
  mangas: Manga[];
}

export default function MDListsDetails({
  loading,
  mdLists,
  mangas,
}: MDListsDetailsProps) {
  return (
    <SafeAreaView style={sharedStyles.flex}>
      <View style={sharedStyles.container}>
        <Text variant="titleLarge">MD Lists</Text>
        {loading && <ProgressBar indeterminate />}
      </View>
      <FlatList
        data={mdLists}
        contentContainerStyle={{
          gap: spacing(2),
          paddingHorizontal: spacing(2),
        }}
        style={{paddingBottom: spacing(2)}}
        renderItem={({item}) => {
          const mangaId = findRelationship(item, 'manga')?.id;
          const manga = mangaId
            ? mangas.find(manga => {
                return manga.id === mangaId;
              }) || null
            : null;
          return <MDListPreview mdList={item} manga={manga} />;
        }}
      />
    </SafeAreaView>
  );
}
