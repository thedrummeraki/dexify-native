import {
  Chapter,
  ChapterAttributes,
  ScanlationGroup,
} from '@app/api/mangadex/types';
import {
  Caption,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {sharedStyles} from '@app/utils/styles';
import {findRelationship, preferredChapterTitle} from '@app/api/mangadex/utils';
import {spacing} from '@app/utils/styles';
import React, {PropsWithChildren, useState} from 'react';
import TextBadge from '@app/components/TextBadge';
import {notEmpty, timeDifference, unique} from '@app/utils';

interface ChaptersListItemProps {
  chapters: Chapter[];
  chapterIdentifier: string | null;
  onPress(chapter: Chapter): void;
  onMultipleChapterPress?(chapters: Chapter[]): void;
}

interface ChaptersListItemPreviewProps {
  chapters: Chapter[];
  chapterIdentifier: string | null;
  onPress(chapter: Chapter): void;
  // onReadPress(chapter: Chapter): void;
  onExpandPress?(): void;
}

function ChaptersListItem({
  chapters,
  chapterIdentifier,
  onPress,
  onMultipleChapterPress,
}: ChaptersListItemProps) {
  console.log(
    'ChaptersListItem',
    `(${chapters.length} chapters - identifier ${chapterIdentifier})`,
  );
  const hasOtherChapters = chapters.length > 1;
  const [showingOtherChapters, setShowingOtherChapters] = useState(false);

  const handleShowingOtherChapters = () =>
    setShowingOtherChapters(current => !current);

  const handleParentOnPress = (chapter: Chapter) => {
    if (hasOtherChapters) {
      onMultipleChapterPress?.(chapters);
    } else {
      onPress(chapter);
    }
  };

  return (
    <ChaptersListItemPreview
      chapterIdentifier={chapterIdentifier}
      chapters={chapters}
      onPress={handleParentOnPress}
      onExpandPress={hasOtherChapters ? handleShowingOtherChapters : undefined}
    />
  );
}

function ChaptersListItemPreviewWrapper({
  child,
  children,
}: PropsWithChildren<Pick<ChaptersListItemPreviewProps, 'child'>>) {
  const styles = useStyles();
  if (child) {
    return <View style={styles.otherChaptersRoots}>{children}</View>;
  } else {
    return <>{children}</>;
  }
}

function ChaptersListItemPreview({
  chapters,
  chapterIdentifier,
  onPress,
  onExpandPress,
}: ChaptersListItemPreviewProps) {
  const styles = useStyles();

  const rootStyles: ViewStyle[] = [styles.root];

  // There should always be at least one chapter when rendering this component.
  // Get the most recent chapter.
  const chapter = chapters.sort((a, b) =>
    a.attributes.publishAt.localeCompare(b.attributes.publishAt),
  )[0];

  const chapterText =
    chapters.length === 1
      ? preferredChapterTitle(chapter)
      : `Chapter ${chapterIdentifier || 'N/A'}`;

  const volumeText = chapters[0].attributes.volume
    ? `Volume ${chapters[0].attributes.volume}`
    : 'No volume';

  const translatedLanguages = unique(
    chapters.map(current => current.attributes.translatedLanguage),
  );

  const groupIds = unique(
    chapters
      .map(current => findRelationship(current, 'scanlation_group')?.id)
      .filter(notEmpty),
  );

  const chapterWithGroup = chapters.find(current =>
    findRelationship<ScanlationGroup>(current, 'scanlation_group'),
  );
  const onlyGroup = chapterWithGroup
    ? findRelationship<ScanlationGroup>(chapterWithGroup, 'scanlation_group')!
    : null;
  const oneGroupMarkup =
    groupIds.length === 1 && onlyGroup ? (
      <TextBadge
        icon="account"
        background="surfaceDisabled"
        content={onlyGroup.attributes.name}
      />
    ) : null;

  const multipleGroupsMarkup =
    groupIds.length > 1 ? (
      <TextBadge
        icon="account"
        background="surfaceDisabled"
        content={`${groupIds.length} groups`}
      />
    ) : null;

  const groupsMarkup = oneGroupMarkup || multipleGroupsMarkup;

  const publishedDate = new Date(chapter.attributes.publishAt);
  const timeAgoText = timeDifference(new Date(), publishedDate);

  return (
    <TouchableRipple
      borderless
      onPress={() => onPress(chapter)}
      style={sharedStyles.roundBorders}>
      <View style={rootStyles}>
        <View style={styles.titleContainer}>
          <View>
            <Text>{chapterText}</Text>
            <Caption>{volumeText}</Caption>
          </View>
          <View style={styles.tagsContainer}>
            {translatedLanguages.map(translatedLanguage => (
              <TextBadge
                key={translatedLanguage}
                icon="translate"
                content={translatedLanguage.toLocaleUpperCase()}
              />
            ))}
            {groupsMarkup}
            <TextBadge icon="clock-outline" content={timeAgoText} />
          </View>
          <View></View>
        </View>
        {/* <View
          style={[
            styles.actions,
            !child && !hasOtherChapters && {marginRight: spacing(0)},
          ]}>
          <IconButton
            icon={chapter.attributes.externalUrl ? 'open-in-new' : 'eye'}
            style={styles.icon}
            onPress={() => onReadPress(chapter)}
          />
          {onExpandPress && !child && (
            <IconButton
              icon={showingOtherChapters ? 'chevron-left' : 'chevron-down'}
              onPress={onExpandPress}
            />
          )}
        </View> */}
      </View>
    </TouchableRipple>
  );
}

function useStyles() {
  const theme = useTheme();

  return StyleSheet.create({
    root: {
      ...sharedStyles.flex,
      ...sharedStyles.roundBorders,
      padding: spacing(2),
      backgroundColor: theme.colors.surfaceDisabled,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    otherChaptersRoots: {
      marginTop: spacing(1),
      gap: spacing(1),
    },
    childRoot: {
      paddingVertical: spacing(2),
      paddingLeft: spacing(2),
      marginLeft: spacing(2),
      paddingRight: spacing(4),
      backgroundColor: theme.colors.surfaceVariant,
    },
    titleContainer: {
      flexShrink: 1,
      gap: spacing(1),
    },
    tagsContainer: {flexWrap: 'wrap', flexDirection: 'row', gap: spacing(1)},
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing(-2),
    },
    icon: {
      padding: 0,
      margin: 0,
    },
  });
}

const MemoizedChaptersListItem = React.memo(ChaptersListItem, (prev, next) => {
  return prev.chapterIdentifier === next.chapterIdentifier;
});
export default MemoizedChaptersListItem;
