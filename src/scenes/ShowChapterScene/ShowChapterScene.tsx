import React, {useEffect} from 'react';
import {useShowChapterRoute} from '@app/foundation/navigation';
import {StatusBar} from 'react-native';
import {ChapterGuard, useChapterStore} from './components/state';
import ShowChapterSceneDetails from './ShowChapterSceneDetails';

export default function ShowChapterScene() {
  const {
    params: {chapter, manga, jumpToPage},
  } = useShowChapterRoute();

  const {set, subscribe} = useChapterStore;
  const {headerShown} = useChapterStore(state => state);

  useEffect(() => {
    set({chapter, manga, page: jumpToPage || 1});
  }, [set, chapter, manga, jumpToPage]);

  useEffect(() => {
    return subscribe(
      state => state.chapter.id,
      () => {
        set({loading: true, pages: [], page: 1});
      },
    );
  }, [set, subscribe]);

  return (
    <ChapterGuard>
      <StatusBar hidden={!headerShown} showHideTransition="slide" />
      <ShowChapterSceneDetails />
    </ChapterGuard>
  );
}
