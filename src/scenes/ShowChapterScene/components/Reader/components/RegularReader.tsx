import {preferredChapterTitle} from '@app/api/mangadex/utils';
import React from 'react';
import {Text} from 'react-native-paper';
import {useChapterStore} from '../../state';

export default function RegularReader() {
  const {chapter} = useChapterStore();
  return <Text>Reading {preferredChapterTitle(chapter)}</Text>;
}
