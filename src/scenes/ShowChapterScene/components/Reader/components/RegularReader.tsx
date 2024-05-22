import {preferredChapterTitle} from '@app/api/mangadex/utils';
import React, {useCallback, useMemo} from 'react';
import {ProgressBar, Text} from 'react-native-paper';
import {useChapterStore} from '../../state';
import {FlatList, Image, ListRenderItem} from 'react-native';
import {Page} from '../../types';
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
        <Image source={{uri}} style={{aspectRatio, width: dimensions.width}} />
      );
    },
    [dimensions.width],
  );

  return (
    <>
      <ProgressBar animatedValue={0} />
      <FlatList
        horizontal
        pagingEnabled
        disableIntervalMomentum
        removeClippedSubviews
        snapToAlignment="center"
        // snapToInterval={dimensions.height}
        data={pages}
        renderItem={renderItem}
      />
    </>
  );
}
