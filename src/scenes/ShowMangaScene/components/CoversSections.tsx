import React, {useEffect, useState} from 'react';
import {ItemsSection, TextBadge} from '@app/components';
import {useMangaDetails} from './MangaProvider';
import {Image} from 'react-native';
import {sharedStyles} from '@app/utils/styles';
import {Surface, TouchableRipple, useTheme} from 'react-native-paper';
import {CoverArt} from '@app/api/mangadex/types';
import {CoverSize, coverImage} from '@app/api/mangadex/utils';

const DEFAULT_COVER_ART_URI = 'https://mangadex.org/img/avatar.png';

export interface CoversSectionProps {
  onCoverArtPress?(coverArt: CoverArt): void;
}

export default function CoversSection({onCoverArtPress}: CoversSectionProps) {
  const {coverArts} = useMangaDetails();

  return (
    <ItemsSection
      hideIfEmpty
      title={`Art covers (${coverArts.length})`}
      data={coverArts.slice(0, 10)}
      onViewMorePress={() => {}}
      renderItem={({item}) => {
        return (
          <CoverItem
            coverArt={item}
            onPress={onCoverArtPress ? () => onCoverArtPress(item) : undefined}
          />
        );
      }}
      keyExtractor={item => item.id}
    />
  );
}

function CoverItem({
  coverArt,
  onPress,
}: {
  coverArt: CoverArt;
  onPress?(): void;
}) {
  const {manga} = useMangaDetails();
  const theme = useTheme();

  const [uri, setUri] = useState<string>();

  useEffect(() => {
    if (coverArt) {
      setUri(coverImage(coverArt, manga.id, {size: CoverSize.Small}));
    }
  }, [coverArt, manga.id]);

  return (
    <TouchableRipple
      borderless
      style={sharedStyles.roundBorders}
      onPress={onPress}>
      <>
        <Surface style={sharedStyles.roundBorders}>
          <Image
            source={{uri}}
            style={[
              sharedStyles.fixedSizeThumbnail,
              sharedStyles.squareAspectRatio,
              {backgroundColor: theme.colors.surfaceDisabled},
            ]}
            onError={e => {
              console.log({e});
              setUri(DEFAULT_COVER_ART_URI);
            }}
          />
        </Surface>
        <TextBadge content={coverArt.attributes.locale?.toLocaleUpperCase()} />
      </>
    </TouchableRipple>
  );
}
