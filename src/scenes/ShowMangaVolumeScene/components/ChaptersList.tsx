import {Chapter} from '@app/api/mangadex/types';
import {ComponentProps} from 'react';
import {FlatList} from 'react-native';
import ChaptersListItem from './ChapterListItem';
import {spacing} from '@app/utils/styles';
import {GroupedChapters} from '../ShowMangaVolumeScene';

export type ChaptersListProps = {
  chapters: Chapter[];
  groupedChapters: GroupedChapters;
  onChapterPress(chapter: Chapter): void;
} & Omit<
  ComponentProps<typeof FlatList<[string | null, Chapter[]]>>,
  'data' | 'renderItem'
>;

export default function ChaptersList({
  chapters,
  groupedChapters,
  onChapterPress,
  ...flatListProps
}: ChaptersListProps) {
  const chapterEntries = [...groupedChapters.entries()];
  console.log({
    chapterEntries,
  });

  return (
    <FlatList
      data={chapterEntries}
      renderItem={({item}) => (
        <ChaptersListItem
          chapters={item[1]}
          onPress={chapter => onChapterPress(chapter)}
        />
      )}
      contentContainerStyle={{
        gap: spacing(1),
        padding: spacing(2),
      }}
      {...flatListProps}
    />
  );
}
