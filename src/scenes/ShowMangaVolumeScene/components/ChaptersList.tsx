import {Chapter, GroupedChapters} from '@app/api/mangadex/types';
import React, {ComponentProps, useState} from 'react';
import {FlatList, Linking, View} from 'react-native';
import ChaptersListItem from './ChapterListItem';
import {spacing} from '@app/utils/styles';
import {SearchBar} from '@app/components';

export type ChaptersListProps = {
  groupedChapters: GroupedChapters;
  hideSearchBar?: boolean;
  // onChapterPress(chapter: Chapter): void;
} & Omit<
  ComponentProps<typeof FlatList<[string | null, Chapter[]]>>,
  'data' | 'renderItem'
>;

export default function ChaptersList({
  groupedChapters,
  hideSearchBar,
  // onChapterPress,
  ...flatListProps
}: ChaptersListProps) {
  const [query, setQuery] = useState('');

  const chapterEntries = [...groupedChapters.entries()];
  const onChapterPress = (chapter: Chapter) => {
    if (chapter.attributes.externalUrl) {
      Linking.openURL(chapter.attributes.externalUrl).catch(console.warn);
    } else {
      // temporary open on mangadex directly until manga reader is open
      const mangadexChapterUrl = `https://mangadex.org/chapter/${chapter.id}`;
      Linking.openURL(mangadexChapterUrl).catch(console.warn);
    }
  };

  const ListHeaderComponent = (
    <>
      {flatListProps.ListHeaderComponent}
      {!hideSearchBar ? (
        <View style={{marginHorizontal: spacing(-2)}}>
          <SearchBar
            onQueryChange={setQuery}
            query={query}
            // onShowFilters={() => {}}
            placeholder="Filter chapters by title..."
          />
        </View>
      ) : null}
    </>
  );

  return (
    <FlatList
      data={chapterEntries}
      renderItem={({item}) => (
        <ChaptersListItem
          chapters={sortChapters(item[1])}
          onPress={chapter => onChapterPress(chapter)}
        />
      )}
      // contentContainerStyle={{
      //   gap: spacing(1),
      //   padding: spacing(2),
      // }}
      {...flatListProps}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}

function sortChapters(chapters: Chapter[]): Chapter[] {
  return chapters.sort((left, right) => {
    const {
      attributes: {
        translatedLanguage: translatedLanguageLeft,
        externalUrl: externalUrlLeft,
      },
    } = left;
    const {
      attributes: {
        translatedLanguage: translatedLanguageRight,
        externalUrl: externalUrlRight,
      },
    } = right;

    if (externalUrlLeft && externalUrlRight) {
      return 0;
    } else if (externalUrlLeft) {
      return -1;
    } else if (externalUrlRight) {
      return 1;
    }

    if (
      translatedLanguageLeft.includes('en') &&
      translatedLanguageRight.includes('en')
    ) {
      return 0;
    } else if (translatedLanguageLeft.includes('en')) {
      return -1;
    } else if (translatedLanguageRight.includes('en')) {
      return 1;
    }

    return 0;
  });
}
