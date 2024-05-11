import {CustomList, Manga} from '@app/api/mangadex/types';
import {findRelationship} from '@app/api/mangadex/utils';
import {sharedStyles, spacing} from '@app/utils/styles';
import React from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import {ProgressBar, Text} from 'react-native-paper';
import {MDListPreview} from './MDListPreview';

export interface MDListsDetailsProps {
  hideTitle?: boolean;
  loading: boolean;
  mdLists: CustomList[];
  mangas: Manga[];
  selectedIds?: string[];
  onPress?(mdList: CustomList): void;
}

export default function MDListsDetails({
  hideTitle,
  loading,
  mdLists,
  mangas,
  selectedIds,
  onPress,
}: MDListsDetailsProps) {
  return (
    <SafeAreaView style={sharedStyles.flex}>
      <View style={sharedStyles.container}>
        {!hideTitle && <Text variant="titleLarge">MD Lists</Text>}
        {loading && <ProgressBar indeterminate />}
      </View>
      <FlatList
        data={mdLists}
        contentContainerStyle={{
          gap: spacing(2),
          paddingHorizontal: spacing(2),
        }}
        renderItem={({item}) => {
          const mangaId = findRelationship(item, 'manga')?.id;
          const manga = mangaId
            ? mangas.find(currentManga => {
                return currentManga.id === mangaId;
              }) || null
            : null;
          return (
            <MDListPreview
              selected={selectedIds?.includes(item.id)}
              mdList={item}
              manga={manga}
              onPress={onPress}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}
