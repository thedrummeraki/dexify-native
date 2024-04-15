import {Chapter} from '@app/api/mangadex/types';
import {IconButton, Text, TouchableRipple, useTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {sharedStyles} from '@app/utils/styles';
import {preferredChapterTitle} from '@app/api/mangadex/utils';
import {spacing} from '@app/utils/styles';

interface ChaptersListItemProps {
  chapter: Chapter;
  onPress(): void;
}

export default function ChaptersListItem({
  chapter,
  onPress,
}: ChaptersListItemProps) {
  const styles = useStyles();

  return (
    <TouchableRipple
      borderless
      onPress={onPress}
      style={sharedStyles.roundBorders}>
      <View style={styles.root}>
        <Text>{preferredChapterTitle(chapter)}</Text>
        <View style={styles.actions}>
          <IconButton icon="eye" style={styles.icon} onPress={onPress} />
        </View>
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
    actions: {
      flexDirection: 'row',
    },
    icon: {
      padding: 0,
      margin: 0,
    },
  });
}
