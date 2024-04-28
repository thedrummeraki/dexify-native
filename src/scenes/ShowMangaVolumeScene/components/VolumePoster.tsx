import {CoverArt, Manga} from '@app/api/mangadex/types';
import {CoverSize, coverImage, findRelationship} from '@app/api/mangadex/utils';
import {VolumeInfo} from '@app/scenes/ShowMangaScene/components/Volumes/VolumesContainer';
import {sharedStyles} from '@app/utils/styles';
import {Image, View} from 'react-native';
import { Surface } from 'react-native-paper';

export interface VolumePosterProps {
  volumeInfo: VolumeInfo;
  manga: Manga;
  aspectRatio?: number;
}

export default function VolumePoster({
  volumeInfo,
  manga,
  aspectRatio = 1,
}: VolumePosterProps) {
  const coverArt =
    volumeInfo.coverArt || findRelationship<CoverArt>(manga, 'cover_art');
  const coverArtMarkup = coverArt ? (
    <Image
      style={[{flex: 1, aspectRatio}, sharedStyles.roundBorders]}
      source={{uri: coverImage(coverArt, manga.id, {size: CoverSize.Original})}}
    />
  ) : null;

  return <Surface style={[sharedStyles.flex]}>{coverArtMarkup}</Surface>;
}
