import {CoverSize, coverImage, volumeInfoTitle} from '@app/api/mangadex/utils';
import {sharedStyles, spacing} from '@app/utils/styles';
import {Surface, Text, TouchableRipple, useTheme} from 'react-native-paper';
import {Image, StyleSheet, View} from 'react-native';
import {VolumeInfo} from '.';
import {useManga} from '../../MangaProvider';
import {useEffect, useState} from 'react';

export interface VolumeGridItemProps {
  volumeInfo: VolumeInfo;
  onPress(): void;
}

const DEFAULT_COVER_ART_URI = 'https://mangadex.org/img/avatar.png';

export default function VolumeGridItem({
  volumeInfo,
  onPress,
}: VolumeGridItemProps) {
  const manga = useManga();
  const theme = useTheme();

  const {coverArt} = volumeInfo;

  const [uri, setUri] = useState(DEFAULT_COVER_ART_URI);

  useEffect(() => {
    if (coverArt) {
      setUri(coverImage(coverArt, manga.id, {size: CoverSize.Small}));
    }
  }, [coverArt, manga.id]);

  return (
    <View style={styles.gridItemRoot}>
      <TouchableRipple
        borderless
        style={sharedStyles.roundBorders}
        onPress={onPress}>
        <Surface style={sharedStyles.roundBorders}>
          <Image
            source={{uri}}
            style={[
              styles.gridItemImage,
              sharedStyles.roundBorders,
              {backgroundColor: theme.colors.surface},
            ]}
            onError={e => {
              console.log({e});
              setUri(DEFAULT_COVER_ART_URI);
            }}
          />
        </Surface>
      </TouchableRipple>
      <Text
        variant="bodySmall"
        numberOfLines={1}
        style={{color: theme.colors.outline}}>
        {volumeInfoTitle(volumeInfo)}
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
  },
});
