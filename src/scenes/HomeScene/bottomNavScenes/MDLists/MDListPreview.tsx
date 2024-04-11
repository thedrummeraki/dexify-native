import {CoverArt, CustomList} from '@app/api/mangadex/types';
import {
  CoverSize,
  coverImage,
  findRelationship,
  findRelationships,
} from '@app/api/mangadex/utils';
import {spacing} from '@app/utils/styles';
import {Caption, Text, useTheme} from 'react-native-paper';
import {Image, StyleSheet, View} from 'react-native';

export interface MDListPreviewProps {
  mdList: CustomList;
  coverArt: CoverArt | null;
}

export function MDListPreview({mdList, coverArt}: MDListPreviewProps) {
  const titlesCount = findRelationships(mdList, 'manga').length;
  const titlesCountText =
    titlesCount === 0
      ? 'No titles'
      : titlesCount === 1
      ? '1 title'
      : `${titlesCount} titles`;

  const theme = useTheme();

  const coverUri = coverArt
    ? coverImage(coverArt, findRelationship(coverArt, 'manga')!.id, {
        size: CoverSize.Small,
      })
    : 'https://mangadex.org/img/avatar.png';

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.surfaceDisabled,
        },
      ]}>
      <Image source={{uri: coverUri}} style={styles.image} />
      <View style={styles.contentsRoot}>
        <View style={styles.contentsContainer}>
          <Text>{mdList.attributes.name}</Text>
          <Caption>{titlesCountText}</Caption>
        </View>
      </View>
    </View>
  );
}

const borderRadiusMultiplier = 3;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: spacing(2),
    borderRadius: spacing(borderRadiusMultiplier),
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    borderTopLeftRadius: spacing(borderRadiusMultiplier),
    borderBottomLeftRadius: spacing(borderRadiusMultiplier),
  },
  contentsRoot: {
    flex: 5,
  },
  contentsContainer: {
    flex: 1,

    justifyContent: 'center',
  },
});
