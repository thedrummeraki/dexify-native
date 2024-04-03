import React from 'react';
import {Manga} from '@app/api/mangadex/types';
import {Image, StyleSheet, View} from 'react-native';
import {Card, Text, TouchableRipple, useTheme} from 'react-native-paper';
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
      <View style={{gap: spacing(1)}}>
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
        <Text variant="bodyMedium" numberOfLines={1}>
          {preferredMangaTitle(manga)}
        </Text>
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  root: sharedStyles.flex,
  image: {opacity: 0.5},
  container: {position: 'absolute', bottom: 6, left: 6, right: 6},
});
