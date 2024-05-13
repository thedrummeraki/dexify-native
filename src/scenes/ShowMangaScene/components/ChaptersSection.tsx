import React, {useEffect, useRef, useState} from 'react';
import {ItemsSection, PaddingHorizontal} from '@app/components';
import {useMangaDetails} from './MangaProvider';
import {Banner, Button, Caption, Text, useTheme} from 'react-native-paper';
import {groupChapters, preferredChapterTitle} from '@app/api/mangadex/utils';
import {AtHomeResponse, isSuccess} from '@app/api/mangadex/types';
import {sharedStyles, spacing} from '@app/utils/styles';
import {Image, View} from 'react-native';
import {useLazyGetRequest} from '@app/api/utils';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import ChaptersListItem from '@app/scenes/ShowMangaVolumeScene/components/ChapterListItem';

const DEFAULT_COVER_ART_URI = 'https://mangadex.org/img/avatar.png';

export interface ChaptersSectionProps {
  showFirst?: number;
}

export default function ChaptersSection({showFirst = 5}: ChaptersSectionProps) {
  const {chaptersData, chaptersLoading, chaptersOrder} = useMangaDetails();

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
              chapters={chapters}
              onPress={() => {}}
            />
          ))}
        </View>
        <View style={[sharedStyles.container, sharedStyles.noTopPadding]}>
          <Button mode="contained-tonal" onPress={() => {}}>
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

// export default function ChaptersSection() {
//   const {chapters, chaptersLoading} = useMangaDetails();
//   // const groupedChapters = groupChapters(chapters);
//   // const chapterEntries = [...groupedChapters.entries()];

//   const fetchedChapterPageUrls = useRef(false);
//   const [fetchChapterPageUrls] = useLazyGetRequest<AtHomeResponse>();
//   const concernedChapter = chapters.length ? chapters[0] : null;
//   const [chapterPageUris, setChapterPageUris] = useState<string[]>([]);

//   useEffect(() => {
//     if (fetchedChapterPageUrls.current || chapters.length === 0) {
//       return;
//     }

//     if (!concernedChapter) {
//       return;
//     }

//     fetchChapterPageUrls(UrlBuilder.getAtHomeServer(concernedChapter.id)).then(
//       response => {
//         if (isSuccess(response)) {
//           const {
//             chapter: {dataSaver, hash},
//             baseUrl,
//           } = response;
//           if (!dataSaver.length) {
//             return;
//           }
//           const constructedFirstPageUrls = dataSaver.map(x =>
//             [baseUrl, 'data-saver', hash, x].join('/'),
//           );
//           setChapterPageUris(constructedFirstPageUrls);
//         }
//       },
//     );
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [chapters]);

//   if (
//     (!concernedChapter && !chaptersLoading) ||
//     (concernedChapter && concernedChapter.attributes.pages === 0)
//   ) {
//     return null;
//   } else if (concernedChapter && !chaptersLoading) {
//     return (
//       <ItemsSection
//         title="Start reading now"
//         subtitle={
//           concernedChapter.attributes.title
//             ? preferredChapterTitle(concernedChapter)
//             : undefined
//         }
//         onViewMorePress={() => {}}
//         data={chapterPageUris}
//         renderItem={({item}) => <ChapterPagePreview pageUrl={item} />}
//       />
//     );
//   }

//   const chapterPages = Array.from({
//     length: 10,
//   }).map(_ => DEFAULT_COVER_ART_URI);

//   return (
//     <ItemsSection
//       data={chapterPages}
//       renderItem={({item}) => (
//         <Image
//           source={{uri: item}}
//           style={sharedStyles.largeFixedSizeThumbnail}
//         />
//       )}
//       title="Start reading now"
//       subtitle="Loading chapter..."
//     />
//   );
// }

function ChapterPagePreview({pageUrl}: {pageUrl: string}) {
  const [uri, setUri] = useState(DEFAULT_COVER_ART_URI);
  const theme = useTheme();

  useEffect(() => {
    Image.getSize(
      pageUrl,
      () => {
        setUri(pageUrl);
      },
      () => {
        setUri(DEFAULT_COVER_ART_URI);
      },
    );
  }, [pageUrl]);

  return (
    <Image
      source={{uri}}
      onLoad={e => {
        console.log(e.nativeEvent.source);
      }}
      style={[
        sharedStyles.largeFixedSizeThumbnail,
        {backgroundColor: theme.colors.surfaceDisabled},
      ]}
    />
  );
}
