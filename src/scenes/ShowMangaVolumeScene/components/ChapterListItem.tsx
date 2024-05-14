import {Chapter, ScanlationGroup} from '@app/api/mangadex/types';
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
import {timeDifference} from '@app/utils';

interface ChaptersListItemProps {
  chapters: Chapter[];
  onPress(chapter: Chapter): void;
}

interface ChaptersListItemPreviewProps {
  child: boolean;
  showingOtherChapters?: boolean;
  hasOtherChapters?: boolean;
  chapter: Chapter;
  onPress(chapter: Chapter): void;
  onReadPress(chapter: Chapter): void;
  onExpandPress?(): void;
}

export default function ChaptersListItem({
  chapters,
  onPress,
}: ChaptersListItemProps) {
  const hasOtherChapters = chapters.length > 1;
  const [showingOtherChapters, setShowingOtherChapters] = useState(false);

  const handleShowingOtherChapters = () =>
    setShowingOtherChapters(current => !current);

  const handleParentOnPress = (chapter: Chapter) => {
    if (hasOtherChapters) {
      handleShowingOtherChapters();
    } else {
      onPress(chapter);
    }
  };

  return (
    <>
      {chapters.map((chapter, index) => (
        <ChaptersListItemPreview
          key={chapter.id}
          chapter={chapter}
          child={index > 0 && hasOtherChapters}
          showingOtherChapters={showingOtherChapters}
          hasOtherChapters={hasOtherChapters}
          onPress={handleParentOnPress}
          onReadPress={onPress}
          onExpandPress={
            hasOtherChapters ? handleShowingOtherChapters : undefined
          }
        />
      ))}
    </>
  );
}

function ChaptersListItemPreview({
  child,
  showingOtherChapters,
  hasOtherChapters,
  chapter,
  onPress,
  onReadPress,
  onExpandPress,
}: ChaptersListItemPreviewProps) {
  const styles = useStyles();
  const Wrapper = ({child, children}: PropsWithChildren<{child: boolean}>) =>
    child ? (
      <View style={styles.otherChaptersRoots}>{children}</View>
    ) : (
      <>{children}</>
    );

  const group = findRelationship<ScanlationGroup>(chapter, 'scanlation_group');

  const rootStyles: ViewStyle[] = [styles.root];
  if (child) {
    rootStyles.push(styles.childRoot);
  }

  if (child && !showingOtherChapters) {
    return null;
  }

  const publishedDate = new Date(chapter.attributes.publishAt);
  const timeAgo = timeDifference(new Date(), publishedDate);

  const volumeText = chapter.attributes.volume
    ? `Volume ${chapter.attributes.volume}`
    : 'No volume';

  return (
    <Wrapper child={child}>
      <TouchableRipple
        borderless
        onPress={() => (child ? onReadPress(chapter) : onPress(chapter))}
        style={sharedStyles.roundBorders}>
        <View style={rootStyles}>
          <View style={styles.titleContainer}>
            <View>
              <Text>{preferredChapterTitle(chapter)}</Text>
              {!child ? <Caption>{volumeText}</Caption> : null}
            </View>
            <View style={styles.tagsContainer}>
              <TextBadge
                icon="translate"
                content={chapter.attributes.translatedLanguage.toLocaleUpperCase()}
              />
              <TextBadge icon="clock-outline" content={timeAgo} />
              {group ? (
                <TextBadge
                  icon="account"
                  background="surfaceDisabled"
                  content={group.attributes.name}
                />
              ) : null}
            </View>
          </View>
          <View
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
          </View>
        </View>
      </TouchableRipple>
    </Wrapper>
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
