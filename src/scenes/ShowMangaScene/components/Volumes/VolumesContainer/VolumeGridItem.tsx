import { CoverSize, coverImage } from '@app/api/mangadex/utils';
import { spacing } from '@app/utils/styles';
import { Surface, Text, useTheme } from 'react-native-paper';
import { Image, StyleSheet, View } from 'react-native';
import { VolumeInfo } from '.';
import { useManga } from '../../MangaProvider';
import { useEffect, useState } from 'react';

export interface VolumeGridItemProps {
  volumeInfo: VolumeInfo;
}

const DEFAULT_COVER_ART_URI = 'https://mangadex.org/img/avatar.png';

export default function VolumeGridItem({ volumeInfo }: VolumeGridItemProps) {
  const manga = useManga();
  const theme = useTheme();

  const { volume, coverArt } = volumeInfo;

  const [uri, setUri] = useState(DEFAULT_COVER_ART_URI);

  useEffect(() => {
    if (coverArt) {
      setUri(coverImage(coverArt, manga.id, { size: CoverSize.Small }));
    }
  }, [coverArt, manga.id])

  const volumeName = volume ? `Vol. ${volume}` : '- No volume -';

  return (
    <View style={styles.gridItemRoot}>
      <Surface style={{ borderRadius: spacing(2) }}>
        <Image
          source={{ uri }}
          style={[styles.gridItemImage, { backgroundColor: theme.colors.surface }]}
          onError={(e) => {
            console.log({ e })
            setUri(DEFAULT_COVER_ART_URI);
          }}
        />
      </Surface>
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
