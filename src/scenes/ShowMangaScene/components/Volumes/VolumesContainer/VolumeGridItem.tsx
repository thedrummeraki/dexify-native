import {CoverSize, coverImage} from '@app/api/mangadex/utils';
import {spacing} from '@app/utils/styles';
import {Text, useTheme} from 'react-native-paper';
import {Image, StyleSheet, View} from 'react-native';
import {VolumeInfo} from '.';
import {useManga} from '../../MangaProvider';

export interface VolumeGridItemProps {
  volumeInfo: VolumeInfo;
}

export default function VolumeGridItem({volumeInfo}: VolumeGridItemProps) {
  const manga = useManga();
  const theme = useTheme();

  const {volume, coverArt} = volumeInfo;
  const coverArtUri = coverArt
    ? coverImage(coverArt, manga.id, {size: CoverSize.Small})
    : 'https://mangadex.org/img/avatar.png';

  const volumeName = volume ? `Vol. ${volume}` : '- No volume -';

  return (
    <View style={styles.gridItemRoot}>
      <Image source={{uri: coverArtUri}} style={styles.gridItemImage} />
      <Text
        variant="bodySmall"
        numberOfLines={1}
        style={{color: theme.colors.outline}}>
        {volumeName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gridItemRoot: {
    marginBottom: spacing(2),
  },
  gridItemImage: {
    flex: 1,
    aspectRatio: 0.8,
    borderRadius: spacing(2),
  },
});
