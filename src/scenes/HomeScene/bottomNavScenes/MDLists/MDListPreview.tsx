import {
  ContentRating,
  CoverArt,
  CustomList,
  Manga,
} from '@app/api/mangadex/types';
import {
  CoverSize,
  coverImage,
  findRelationship,
  findRelationships,
} from '@app/api/mangadex/utils';
import {sharedStyles, spacing} from '@app/utils/styles';
import {Caption, Text, TouchableRipple, useTheme} from 'react-native-paper';
import {Image, StyleSheet, View} from 'react-native';
import {useDexifyNavigation} from '@app/foundation/navigation';
import {useStore} from '@app/foundation/state/StaterinoProvider';

export interface MDListPreviewProps {
  selected?: boolean;
  mdList: CustomList;
  manga: Manga | null;
  onPress?(mdList: CustomList): void;
}

export function MDListPreview({
  selected,
  mdList,
  manga,
  onPress,
}: MDListPreviewProps) {
  const styles = useStyles();
  const navigation = useDexifyNavigation();

  const titlesCountText = useMDTitlesCount(mdList);

  const theme = useTheme();
  const mangaCoverArt = manga
    ? findRelationship<CoverArt>(manga, 'cover_art')
    : null;

  const coverUri =
    mangaCoverArt && manga
      ? coverImage(mangaCoverArt, manga.id, {
          size: CoverSize.Small,
        })
      : 'https://mangadex.org/img/avatar.png';

  const blurRadius =
    manga?.attributes.contentRating === ContentRating.pornographic ? 8 : 0;

  const handleOnPress = () => {
    if (onPress) {
      onPress(mdList);
    } else {
      navigation.push('ShowCustomList', mdList);
    }
  };

  return (
    <TouchableRipple
      borderless
      style={sharedStyles.roundBorders}
      onPress={handleOnPress}>
      <View
        style={[
          styles.root,
          {
            backgroundColor: theme.colors.surfaceDisabled,
          },
          [selected && styles.selected],
        ]}>
        <Image
          source={{uri: coverUri}}
          style={styles.image}
          blurRadius={blurRadius}
        />
        <View style={styles.contentsRoot}>
          <View style={styles.contentsContainer}>
            <Text style={[selected && styles.selectedText]}>
              {mdList.attributes.name}
            </Text>
            <Caption style={[selected && styles.selectedText]}>
              {titlesCountText}
            </Caption>
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
}

export function useMDTitlesCount(mdList: CustomList) {
  const mdListMappings = useStore(state => state.mdLists.data);
  const mdListIds = Object.values(mdListMappings).flat();
  const titlesCount = mdListIds.filter(id => id === mdList.id).length;
  const titlesCountText =
    titlesCount === 0
      ? 'No titles'
      : titlesCount === 1
      ? '1 title'
      : `${titlesCount} titles`;

  return titlesCountText;
}

function useStyles() {
  const theme = useTheme();
  const styles = StyleSheet.create({
    root: {
      ...sharedStyles.roundBorders,
      flexDirection: 'row',
      gap: spacing(2),
    },
    image: {
      flex: 1,
      aspectRatio: 1,
      borderTopLeftRadius: sharedStyles.roundBorders.borderRadius,
      borderBottomLeftRadius: sharedStyles.roundBorders.borderRadius,
    },
    selected: {
      backgroundColor: theme.colors.primary,
    },
    selectedText: {
      color: theme.colors.onPrimary,
    },
    contentsRoot: {
      flex: 5,
    },
    contentsContainer: {
      flex: 1,

      justifyContent: 'center',
    },
  });
  return styles;
}
