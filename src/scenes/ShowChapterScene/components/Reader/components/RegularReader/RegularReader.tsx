import React, {useCallback, useMemo, useState} from 'react';
import {ProgressBar} from 'react-native-paper';
import {ReadingDirection, useChapterStore} from '../../../state';
import {FlatList, ListRenderItem, SafeAreaView, StyleSheet} from 'react-native';
import {Page} from '../../../types';
import RegularReaderPage from './components/RegularReaderPage';
import {useDimensions} from '@app/utils';
import {useStore} from '@app/foundation/state/StaterinoProvider';

export default function RegularReader() {
  const direction = useStore(state => state.settings.reader.direction);

  const {pages: unsortedPages} = useChapterStore();
  const pages = useMemo(
    () => unsortedPages.sort((a, b) => a.position - b.position),
    [unsortedPages],
  );
  const [progress, setProgress] = useState(0);

  const dimensions = useDimensions();

  // Image dimesions are irrelevant, we know the width will be the device's width
  const totalWidth =
    pages.reduce(acc => acc + dimensions.width, 0) - dimensions.width;

  const renderItem: ListRenderItem<Page> = useCallback(
    ({item}) => <RegularReaderPage page={item} />,
    [],
  );

  return (
    <SafeAreaView>
      <ProgressBar
        animatedValue={progress}
        style={regularReaderStyles[direction]}
      />
      <FlatList
        horizontal
        pagingEnabled
        disableIntervalMomentum
        snapToAlignment="center"
        data={pages}
        renderItem={renderItem}
        style={regularReaderStyles[direction]}
        onScroll={event => {
          const {
            nativeEvent: {contentOffset: currentContentOffset},
          } = event;
          // contentOffset.current = currentContentOffset;
          setProgress(currentContentOffset.x / totalWidth);
        }}
      />
    </SafeAreaView>
  );
}

export const regularReaderStyles = StyleSheet.create({
  [ReadingDirection.LeftToRight]: {transform: [{scaleX: 1}]},
  [ReadingDirection.RightToLeft]: {
    transform: [{scaleX: -1}],
  },
});
