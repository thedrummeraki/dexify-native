import { CoverSize, coverImage } from '@app/api/mangadex/utils';
import { spacing } from '@app/utils/styles';
import { Text, useTheme } from 'react-native-paper';
import { Image, StyleSheet, View } from 'react-native';
import { VolumeInfo } from '.';
import { useManga } from '../../MangaProvider';
import { useState } from 'react';

export interface VolumeGridItemProps {
  volumeInfo: VolumeInfo;
}

const DEFAULT_COVER_ART_URI = 'https://mangadex.org/img/avatar.png';

export default function VolumeGridItem({ volumeInfo }: VolumeGridItemProps) {
  const manga = useManga();
  const theme = useTheme();

  const { volume, coverArt } = volumeInfo;
  const coverArtUri = coverArt
    ? coverImage(coverArt, manga.id, { size: CoverSize.Small })
    : DEFAULT_COVER_ART_URI;

  const [uri, setUri] = useState(coverArtUri);

  const volumeName = volume ? `Vol. ${volume}` : '- No volume -';

  return (
    <View style={styles.gridItemRoot}>
      <Image
        source={{ uri }}
        style={[styles.gridItemImage, { backgroundColor: theme.colors.surface }]}
        onError={() => {
          setUri(DEFAULT_COVER_ART_URI);
        }}
      />
      <Text
        variant="bodySmall"
        numberOfLines={1}
        style={{ color: theme.colors.outline }}>
        {volumeName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gridItemRoot: {
    marginBottom: spacing(2),
    gap: spacing(1),
  },
  gridItemImage: {
    flex: 1,
    aspectRatio: 0.95,
    borderRadius: spacing(2),
  },
});
