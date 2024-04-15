import {Chapter} from '@app/api/mangadex/types';
import {ComponentProps} from 'react';
import {FlatList} from 'react-native';
import ChaptersListItem from './ChapterListItem';
import {spacing} from '@app/utils/styles';

export type ChaptersListProps = {
  chapters: Chapter[];
  onChapterPress(chapter: Chapter): void;
} & Omit<ComponentProps<typeof FlatList<Chapter>>, 'data' | 'renderItem'>;

export default function ChaptersList({
  chapters,
  onChapterPress,
  ...flatListProps
}: ChaptersListProps) {
  return (
    <FlatList
      data={chapters}
      renderItem={({item}) => (
        <ChaptersListItem chapter={item} onPress={() => onChapterPress(item)} />
      )}
      contentContainerStyle={{
        gap: spacing(1),
        padding: spacing(2),
      }}
      {...flatListProps}
    />
  );
}
