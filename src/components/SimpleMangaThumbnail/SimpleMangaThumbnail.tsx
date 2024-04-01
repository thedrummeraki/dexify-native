import React from 'react';
import { Manga } from '@app/api/mangadex/types';
import { StyleSheet, View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import Text from '@app/foundation/theme/components/Text';
import { mangaImage, preferredMangaTitle } from '@app/api/mangadex/utils';
import { sharedStyles, spacing } from '@app/utils/styles';

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
    colors: { primary },
  } = useTheme();

  return (
    <View
      style={[
        styles.root,
        {
          borderColor: primary,
          borderWidth: spacing(selected ? 1 : 0),
          borderRadius: spacing(4),
        },
      ]}>
      <Card
        onLongPress={() => onLongPress?.(manga)}
        onPress={() => onPress?.(manga)}>
        <Card.Cover source={{ uri: mangaImage(manga) }} style={styles.image} />
      </Card>
      <View style={styles.container}>
        <Text numberOfLines={1} style={styles.title}>
          {preferredMangaTitle(manga)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: sharedStyles.flex,
  image: { opacity: 0.5 },
  container: { position: 'absolute', bottom: 6, left: 6, right: 6 },
  title: { fontWeight: '500' },
});
