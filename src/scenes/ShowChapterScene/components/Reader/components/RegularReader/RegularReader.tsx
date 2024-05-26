import React, {useCallback, useMemo} from 'react';
import {ProgressBar} from 'react-native-paper';
import {useChapterStore} from '../../../state';
import {FlatList, Image, ListRenderItem, SafeAreaView} from 'react-native';
import {Page} from '../../../types';
import {useDimensions} from '@app/utils';

export default function RegularReader() {
  const dimensions = useDimensions();
  const {pages: unsortedPages} = useChapterStore();
  const pages = useMemo(
    () => unsortedPages.sort((a, b) => a.position - b.position),
    [unsortedPages],
  );

  const renderItem: ListRenderItem<Page> = useCallback(
    ({item}) => {
      const {
        image: {height, width, uri},
      } = item;
      const aspectRatio = width / height;

      return (
        <Image
          source={{uri}}
          style={{aspectRatio, height: dimensions.height}}
        />
      );
    },
    [dimensions.height],
  );

  return (
    <SafeAreaView>
      <ProgressBar animatedValue={0} />
      <FlatList
        horizontal
        pagingEnabled
        disableIntervalMomentum
        removeClippedSubviews
        snapToAlignment="center"
        // snapToInterval={dimensions.width}
        data={pages}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}
