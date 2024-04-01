import {
  CoverArt,
  Manga,
  PagedResultsList,
  isSuccess,
} from '@app/api/mangadex/types';
import {findRelationship, mangaImage} from '@app/api/mangadex/utils';
import {Text} from 'react-native-paper';
import {useManga} from './MangaProvider';
import {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, View} from 'react-native';
import {coverImage} from '@app/api/mangadex/utils';
import {useLazyGetRequest} from '@app/api/utils';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useDimensions} from '@app/utils';

export interface MangaGalleryProps {}

function useThumbnailStyles() {
  const {} = useDimensions();

  const styles = StyleSheet.create({
    thumbnailRoot: {
      flex: 1,
      maxWidth: 100,
    },
    thumbnailImage: {
      flex: 1,
    },
  });

  return styles;
}

function renderCoverArtItem(
  coverArt: CoverArt,
  mangaId: string,
  dimensions: {height?: number; width?: number; aspectRatio?: number},
): JSX.Element {
  const {height, width} = dimensions;
  const uri = coverImage(coverArt, mangaId);
  return <Image source={{uri}} style={{height, width}} />;
}

export default function MangaGallery() {
  const manga = useManga();
  const thumbnailStyles = useThumbnailStyles();

  // Any manga must have at least one cover
  const coverArt = findRelationship<CoverArt>(manga, 'cover_art')!;

  const [covers, setCovers] = useState<CoverArt[]>([coverArt]);
  const dimensions = useDimensions();

  const width = dimensions.width * 0.9;
  const height = dimensions.height * 0.7;

  const [fetchCovers] = useLazyGetRequest<PagedResultsList<CoverArt>>(
    UrlBuilder.covers({manga: [manga.id], limit: 100}),
  );

  useEffect(() => {
    fetchCovers().then(result => {
      if (isSuccess(result)) {
        setCovers(current => [...current, ...result.data]);
      }
    });
  }, []);

  return (
    <View style={thumbnailStyles.thumbnailRoot}>
      <Image
        source={{uri: coverImage(coverArt, manga.id)}}
        style={thumbnailStyles.thumbnailImage}
      />
    </View>
  );

  // return (
  //   <FlatList
  //     horizontal
  //     data={covers}
  //     renderItem={({item}) =>
  //       renderCoverArtItem(item, manga.id, {width, height, aspectRatio: 1})
  //     }
  //     snapToAlignment="center"
  //     pagingEnabled
  //   />
  // );
}
