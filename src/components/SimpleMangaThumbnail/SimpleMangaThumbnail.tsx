import React from 'react';
import {ContentRating, Manga, ReadingStatus} from '@app/api/mangadex/types';
import {Image, StyleSheet, View} from 'react-native';
import {Text, TouchableRipple, useTheme} from 'react-native-paper';
import {mangaImage, preferredMangaTitle} from '@app/api/mangadex/utils';
import {sharedStyles, spacing} from '@app/utils/styles';
import {readingStatusName} from '@app/scenes/HomeScene/bottomNavScenes/Library/Library';

export interface SimpleMangaThumbnailProps {
  manga: Manga;
  selected?: boolean;
  hideExplicitBlur?: boolean;
  hideThumbnailInfo?: VisibleThumbnailInfo[];
  info?: ThumbnailInfo;
  onPress?(manga: Manga): void;
  onLongPress?(manga: Manga): void;
}

export type VisibleThumbnailInfo = 'readingStatus';

export interface ThumbnailInfo {
  readingStatus?: ReadingStatus;
}

export function SimpleMangaThumbnail({
  manga,
  selected,
  hideExplicitBlur,
  hideThumbnailInfo,
  info,
  onPress,
  onLongPress,
}: SimpleMangaThumbnailProps) {
  const {
    colors: {primary, surfaceVariant, secondary, onSecondary},
  } = useTheme();

  const blurRadius =
    manga.attributes.contentRating === ContentRating.pornographic &&
    !hideExplicitBlur
      ? 16
      : 0;

  const isInfoVisible = (infoType: VisibleThumbnailInfo) => {
    return !(hideThumbnailInfo || []).includes(infoType);
  };

  const {readingStatus} = info || {};

  return (
    <View style={{gap: spacing(1)}}>
      <TouchableRipple
        borderless
        style={sharedStyles.roundBorders}
        onLongPress={() => onLongPress?.(manga)}
        onPress={() => onPress?.(manga)}>
        <View>
          <View style={styles.info}>
            {readingStatus && isInfoVisible('readingStatus') ? (
              <View style={[styles.infoItem, {backgroundColor: secondary}]}>
                <Text variant="bodySmall" style={{color: onSecondary}}>
                  {readingStatusName(readingStatus)}
                </Text>
              </View>
            ) : null}
          </View>
          <Image
            source={{uri: mangaImage(manga)}}
            style={[
              sharedStyles.flex,
              sharedStyles.roundBorders,
              {
                aspectRatio: 0.7,
                opacity: selected ? 0.8 : 1,
                borderColor: primary,
                borderWidth: spacing(selected ? 1 : 0),
                backgroundColor: surfaceVariant,
              },
            ]}
            blurRadius={blurRadius}
          />
        </View>
      </TouchableRipple>
      <Text variant="bodyMedium" numberOfLines={1}>
        {preferredMangaTitle(manga)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: sharedStyles.flex,
  image: {opacity: 0.5},
  container: {position: 'absolute', bottom: 6, left: 6, right: 6},
  info: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  infoItem: {
    // borderRadius: sharedStyles.roundBorders.borderRadius / 2,
    paddingHorizontal: spacing(0.5),
  },
});
