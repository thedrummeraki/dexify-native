import React from 'react';
import {useChapterStore} from '../state';
import {isLongStrip} from '@app/api/mangadex/utils';
import {LongStripReader, RegularReader} from './components';

export default function Reader() {
  const {manga} = useChapterStore();
  if (isLongStrip(manga)) {
    return <LongStripReader />;
  }

  return <RegularReader />;
}
