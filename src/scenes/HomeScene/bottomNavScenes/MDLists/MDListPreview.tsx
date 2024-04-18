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

export interface MDListPreviewProps {
  mdList: CustomList;
  manga: Manga | null;
}

export function MDListPreview({mdList, manga}: MDListPreviewProps) {
  const navigation = useDexifyNavigation();
  const titlesCount = findRelationships(mdList, 'manga').length;
  const titlesCountText =
    titlesCount === 0
      ? 'No titles'
      : titlesCount === 1
      ? '1 title'
      : `${titlesCount} titles`;

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

  return (
    <TouchableRipple
      borderless
      style={sharedStyles.roundBorders}
      onPress={() => navigation.push('ShowCustomList', mdList)}>
      <View
        style={[
          styles.root,
          {
            backgroundColor: theme.colors.surfaceDisabled,
          },
        ]}>
        <Image
          source={{uri: coverUri}}
          style={styles.image}
          blurRadius={blurRadius}
        />
        <View style={styles.contentsRoot}>
          <View style={styles.contentsContainer}>
            <Text>{mdList.attributes.name}</Text>
            <Caption>{titlesCountText}</Caption>
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
}

const borderRadiusMultiplier = 3;

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
  contentsRoot: {
    flex: 5,
  },
  contentsContainer: {
    flex: 1,

    justifyContent: 'center',
  },
});
