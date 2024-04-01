import {CoverSize, coverImage, findRelationship} from '@app/api/mangadex/utils';
import {useManga} from './MangaProvider';
import {CoverArt} from '@app/api/mangadex/types';
import {Image} from 'react-native';
import {useDimensions} from '@app/utils';

export default function Poster() {
  const manga = useManga();
  const coverArt = findRelationship<CoverArt>(manga, 'cover_art');
  const {width} = useDimensions();

  if (!coverArt) {
    return null;
  }

  const imageUri = coverImage(coverArt, manga.id, {size: CoverSize.Original});
  return <Image source={{uri: imageUri}} style={{width, aspectRatio: 0.85}} />;
}
