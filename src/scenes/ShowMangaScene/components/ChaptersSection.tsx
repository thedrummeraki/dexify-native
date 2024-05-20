import React from 'react';
import {PaddingHorizontal} from '@app/components';
import {useMangaDetails} from './MangaProvider';
import {Banner, Button, Caption, Text} from 'react-native-paper';
import {groupChapters} from '@app/api/mangadex/utils';
import {Chapter, isSuccess} from '@app/api/mangadex/types';
import {sharedStyles} from '@app/utils/styles';
import {Linking, View} from 'react-native';
import ChaptersListItem from '@app/scenes/ShowMangaVolumeScene/components/ChapterListItem';
import {useDexifyNavigation} from '@app/foundation/navigation';

export interface ChaptersSectionProps {
  showFirst?: number;
}

export default function ChaptersSection({showFirst = 5}: ChaptersSectionProps) {
  const navigation = useDexifyNavigation();
  const {chaptersData, chaptersLoading, chaptersOrder, manga} =
    useMangaDetails();

  if (!chaptersData) {
    return (
      <PaddingHorizontal spacing={2}>
        <Text variant="titleMedium">Relevant chapters</Text>
        {chaptersLoading ? (
          <Text>Loading...</Text>
        ) : (
          <Text>No chapters {':('}</Text>
        )}
      </PaddingHorizontal>
    );
  }

  const onChapterPress = (chapter: Chapter) => {
    if (chapter.attributes.externalUrl) {
      Linking.openURL(chapter.attributes.externalUrl).catch(console.warn);
    } else {
      // temporary open on mangadex directly until manga reader is open
      const mangadexChapterUrl = `https://mangadex.org/chapter/${chapter.id}`;
      Linking.openURL(mangadexChapterUrl).catch(console.warn);
    }
  };

  const count = isSuccess(chaptersData) ? chaptersData.total : 0;
  if (isSuccess(chaptersData)) {
    const groupedChapters = groupChapters(chaptersData.data);
    const entities = [...groupedChapters.entries()];

    const relevantCount = Math.min(showFirst, count);
    const chaptersShowingCountText =
      relevantCount === 1
        ? '1 chapter'
        : relevantCount === 0
        ? 'no chapters'
        : `${relevantCount} chapters`;

    const orderText = chaptersOrder === 'asc' ? 'first' : 'last';

    const captionMarkup =
      count === 0 ? (
        <Caption>This title may not have any available chapters</Caption>
      ) : showFirst >= count ? (
        <Caption>Displaying {chaptersShowingCountText}</Caption>
      ) : (
        <Caption>
          Displaying the{' '}
          <Caption style={sharedStyles.bold}>{orderText}</Caption>{' '}
          {chaptersShowingCountText}
        </Caption>
      );

    const browseAllText =
      count === 0 ? 'Browse all other chapters' : 'Browse all';

    return (
      <View>
        <PaddingHorizontal
          spacing={2}
          style={sharedStyles.titleCaptionContainer}>
          <Text variant="titleMedium">Relevant chapters</Text>
          {captionMarkup}
        </PaddingHorizontal>

        <View style={[sharedStyles.tightContainer]}>
          {entities.slice(0, showFirst).map(([chapterIdentifier, chapters]) => (
            <ChaptersListItem
              key={`chapter-${chapterIdentifier}`}
              chapterIdentifier={chapterIdentifier}
              chapters={chapters}
              onPress={onChapterPress}
            />
          ))}
        </View>
        <View style={[sharedStyles.container, sharedStyles.noTopPadding]}>
          <Button
            mode="contained-tonal"
            onPress={() => navigation.push('ShowMangaChapters', manga)}>
            {browseAllText}
          </Button>
        </View>
      </View>
    );
  }

  return (
    <PaddingHorizontal spacing={2}>
      <Text variant="titleMedium">Relevant chapters</Text>
      <Banner visible>
        <Text>
          Could not fetch chapters for this title. Please try again later.
        </Text>
      </Banner>
    </PaddingHorizontal>
  );
}
