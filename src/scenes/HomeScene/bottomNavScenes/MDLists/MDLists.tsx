import {CustomList, PagedResultsList, isSuccess} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useLazyGetRequest} from '@app/api/utils';
import React, {useEffect, useMemo} from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import {Card, Text} from 'react-native-paper';

export default function MDLists() {
  const [getCustomLists, {loading, data}] = useLazyGetRequest<
    PagedResultsList<CustomList>
  >(UrlBuilder.currentUserCustomLists({limit: 100}));

  const customLists: CustomList[] = useMemo(() => {
    if (isSuccess(data)) {
      return data.data;
    } else {
      return [];
    }
  }, [data]);

  useEffect(() => {
    getCustomLists();
  }, []);

  return (
    <SafeAreaView>
      <Text>MD Lists</Text>
      <FlatList
        data={customLists}
        renderItem={({item}) => (
          <Card>
            <Card.Title title={item.attributes.name} />
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
