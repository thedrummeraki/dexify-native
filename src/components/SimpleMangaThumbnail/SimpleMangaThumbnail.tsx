import React from 'react';
import {Manga} from '@app/api/mangadex/types';
import {Image, StyleSheet, View} from 'react-native';
import {Card, TouchableRipple, useTheme} from 'react-native-paper';
import Text from '@app/foundation/theme/components/Text';
import {mangaImage, preferredMangaTitle} from '@app/api/mangadex/utils';
import {sharedStyles, spacing} from '@app/utils/styles';

export interface SimpleMangaThumbnailProps {
  manga: Manga;
  selected?: boolean;
  onPress?(manga: Manga): void;
  onLongPress?(manga: Manga): void;
}

export function SimpleMangaThumbnail({
  manga,
  selected,
  onPress,
  onLongPress,
}: SimpleMangaThumbnailProps) {
  const {
    colors: {primary},
  } = useTheme();

  return (
    <TouchableRipple
      onLongPress={() => onLongPress?.(manga)}
      onPress={() => onPress?.(manga)}>
      <>
        <Image
          source={{uri: mangaImage(manga)}}
          style={[
            sharedStyles.flex,
            {
              aspectRatio: 0.7,
              borderRadius: spacing(3),
              opacity: selected ? 0.4 : 1,
              borderColor: primary,
              borderWidth: spacing(selected ? 1 : 0),
            },
          ]}
        />
        <Text numberOfLines={1} style={styles.title}>
          {preferredMangaTitle(manga)}
        </Text>
      </>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  root: sharedStyles.flex,
  image: {opacity: 0.5},
  container: {position: 'absolute', bottom: 6, left: 6, right: 6},
  title: {fontWeight: '500'},
});
