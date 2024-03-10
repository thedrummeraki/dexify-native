import React, {useEffect} from 'react';
import {
  Manga,
  MangaRequestParams,
  PagedResultsList,
  isSuccess,
} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useGetRequest} from '@app/api/utils';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import SimpleMangaThumbnail from '../SimpleMangaThumbnail';

export interface Props {
  params: MangaRequestParams;
  onLoading(loading: boolean): void;
}

export function MangaCollection({params, onLoading}: Props) {
  const url = UrlBuilder.mangaList(params);
  const {data, loading} = useGetRequest<PagedResultsList<Manga>>(url);
  const manga = isSuccess(data) ? data.data : [];

  useEffect(() => onLoading(loading), [onLoading, loading]);

  return (
    <FlatList
      data={manga}
      numColumns={2}
      contentContainerStyle={styles.flatListContentContainer}
      columnWrapperStyle={styles.flatListColumnWrapper}
      style={styles.flatList}
      ListEmptyComponent={
        <View style={styles.flatListEmptyStateRoot}>
          <Text>No manga was found.</Text>
        </View>
      }
      renderItem={({item}) => <SimpleMangaThumbnail manga={item} />}
      keyExtractor={item => item.id}
    />
  );
}

const styles = StyleSheet.create({
  flatListContentContainer: {padding: 8, gap: 8},
  flatListColumnWrapper: {gap: 8},
  flatList: {flex: 1},
  flatListEmptyStateRoot: {flex: 1, alignItems: 'center'},
});
