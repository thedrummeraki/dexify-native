import {CoverSize, coverImage, findRelationship} from '@app/api/mangadex/utils';
import {useManga} from './MangaProvider';
import {CoverArt} from '@app/api/mangadex/types';
import {Image} from 'react-native';
import {useReducer} from 'react';
import {TouchableRipple} from 'react-native-paper';

enum AspectRatio {
  Small = 1.5,
  Medium = 0.95,
  Large = 0.7,
}

export interface PosterProps {
  defaultSizeIndex?: number;
}

export default function Poster({defaultSizeIndex = 1}: PosterProps) {
  const manga = useManga();
  const coverArt = findRelationship<CoverArt>(manga, 'cover_art');

  const validAspectRatios = [
    AspectRatio.Medium,
    AspectRatio.Large,
    AspectRatio.Small,
  ];
  const [index, dispatch] = useReducer(current => {
    return (current + 1) % 3;
  }, defaultSizeIndex);

  console.log({index});

  const aspectRatio = validAspectRatios[index];

  if (!coverArt) {
    return null;
  }

  const imageUri = coverImage(coverArt, manga.id, {size: CoverSize.Original});
  return (
    <TouchableRipple
      onLongPress={() => dispatch()}
      rippleColor="rgba(0, 0, 0, 0.32)">
      <Image source={{uri: imageUri}} style={{flex: 1, aspectRatio}} />
    </TouchableRipple>
  );
}
