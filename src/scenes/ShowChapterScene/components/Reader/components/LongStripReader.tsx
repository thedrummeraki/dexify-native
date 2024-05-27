import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useChapterStore} from '../../state';
import {FlatList, Image, ListRenderItem} from 'react-native';
import {useDimensions} from '@app/utils';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {ProgressBar} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {Page} from '../../types';
import {ReadingStatus} from '@app/api/mangadex/types';

export default function LongStripReader() {
  const {set: globalSet} = useStore;
  const {savedPositions} = useStore(state => state.reader);
  const [progress, setProgress] = useState(0);
  const {pages, chapter, manga} = useChapterStore();
  const contentOffset = useRef(savedPositions[chapter.id] || {x: 0, y: 0});

  const dimensions = useDimensions();

  const totalHeight =
    pages
      .map(page => {
        const {
          image: {height, width},
        } = page;
        const aspectRatio = width / height;
        return dimensions.width / aspectRatio;
      })
      .reduce((acc, value) => acc + value) - dimensions.height;

  const flatListRef = useRef<FlatList | null>(null);
  const jumpedToSavedPosition = useRef(false);

  useEffect(() => {
    if (!flatListRef.current || jumpedToSavedPosition.current) {
      return;
    }

    const savedPosition = savedPositions[chapter.id];
    if (savedPosition) {
      console.log({savedPosition});
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          animated: true,
          offset: savedPosition.y,
        });
      }, 100);

      jumpedToSavedPosition.current = true;
    }
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log(
          '[LongStripReader] Saving reading position for',
          chapter.id,
          'to',
          contentOffset.current,
        );

        globalSet({
          reader: {savedPositions: {[chapter.id]: contentOffset.current}},
          library: {data: {statuses: {[manga.id]: ReadingStatus.Reading}}},
        });
      };
    }, [chapter.id, manga.id, globalSet]),
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
      <ProgressBar animatedValue={progress} />
      <FlatList
        ref={ref => {
          flatListRef.current = ref;
        }}
        data={pages.sort((a, b) => a.position - b.position)}
        scrollEventThrottle={16}
        onScroll={event => {
          const {
            nativeEvent: {contentOffset: currentContentOffset},
          } = event;
          contentOffset.current = currentContentOffset;
          setProgress(currentContentOffset.y / totalHeight);
        }}
        renderItem={renderItem}
      />
    </>
  );
}
