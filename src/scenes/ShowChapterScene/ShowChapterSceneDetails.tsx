import React from 'react';
import Loading from './components/Loading';
import {useChapterStore} from './components/state';
import Reader from './components/Reader/Reader';

export default function ShowChapterSceneDetails() {
  const state = useChapterStore();
  if (state.loading) {
    return <Loading />;
  }

  return <Reader />;
}
