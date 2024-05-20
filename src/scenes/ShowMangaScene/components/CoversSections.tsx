import React, {useState} from 'react';
import {ItemsSection, TextBadge} from '@app/components';
import {useMangaDetails} from './MangaProvider';
import {Image, View} from 'react-native';
import {sharedStyles, spacing} from '@app/utils/styles';
import {Surface, TouchableRipple, useTheme} from 'react-native-paper';
import {CoverArt} from '@app/api/mangadex/types';
import {CoverSize, coverImage} from '@app/api/mangadex/utils';
import {getDeviceMangadexFriendlyLanguage, notEmpty} from '@app/utils';

const DEFAULT_COVER_ART_URI = 'https://mangadex.org/img/avatar.png';

export interface CoversSectionProps {
  onCoverArtPress?(coverArt: CoverArt): void;
}

function prioritizeDeviceLanguage<T extends CoverArt>(items: T[]): T[] {
  const deviceLanguage = getDeviceMangadexFriendlyLanguage();

  return items.sort((a, b) => {
    const {
      attributes: {locale: localeA},
    } = a;
    const {
      attributes: {locale: localeB},
    } = b;

    if (!localeA) {
      return 1;
    } else if (!localeB) {
      return -1;
    }

    if (localeA.includes(deviceLanguage) && localeB.includes(deviceLanguage)) {
      return 0;
    } else if (localeA.includes(deviceLanguage)) {
      return -1;
    } else if (localeB.includes(deviceLanguage)) {
      return 1;
    }

    return localeA.localeCompare(localeB);
  });
}

export default function CoversSection({onCoverArtPress}: CoversSectionProps) {
  const {coverArts} = useMangaDetails();
  const coverArtsCountText =
    coverArts.length === 1
      ? '1 cover exists'
      : `${coverArts.length} covers exist`;

  const groupedCovers = coverArts.reduce((acc, value) => {
    acc.set(value.attributes.volume, [
      ...(acc.get(value.attributes.volume) || []),
      value,
    ]);
    return acc;
  }, new Map<string | null, CoverArt[]>());

  const groupedCoversEntries = [...groupedCovers.entries()];

  return (
    <ItemsSection
      hideIfEmpty
      title="Art covers"
      subtitle={`${coverArtsCountText} for this title`}
      // data={coverArts}
      // renderItem={({item}) => {
      //   return (
      //     <CoverItem
      //       coverArt={item}
      //       onPress={onCoverArtPress ? () => onCoverArtPress(item) : undefined}
      //     />
      //   );
      // }}
      // keyExtractor={item => item.id}
      data={groupedCoversEntries}
      renderItem={({item}) => {
        return (
          <CoverItem
            coverArts={prioritizeDeviceLanguage(item[1])}
            onPress={
              onCoverArtPress ? () => onCoverArtPress(item[1][0]) : undefined
            }
          />
        );
      }}
    />
  );
}

function CoverItem({
  coverArts,
  onPress,
}: {
  coverArts: CoverArt[];
  onPress?(): void;
}) {
  const {manga} = useMangaDetails();
  const theme = useTheme();

  const mainCoverArt = coverArts[0];

  const [uri, setUri] = useState<string>(() =>
    coverImage(mainCoverArt, manga.id, {size: CoverSize.Small}),
  );

  const volumeText = mainCoverArt.attributes.volume
    ? `Volume ${mainCoverArt.attributes.volume}`
    : 'No volume';

  const locales = coverArts
    .map(coverArt => coverArt.attributes.locale)
    .filter(notEmpty);
  const mainLocaleMarkup = locales.length ? (
    <TextBadge
      icon="translate"
      content={locales[0].toLocaleUpperCase()}
      background="surfaceDisabled"
    />
  ) : null;
  const secondLocaleMarkup =
    locales.length > 1 ? (
      <TextBadge
        icon="translate"
        content={locales[1].toLocaleUpperCase()}
        background="surfaceDisabled"
      />
    ) : null;
  const otherLocalesMarkup =
    locales.length > 2 ? (
      <TextBadge
        icon="plus"
        content={`${locales.length - 2}`}
        background="backdrop"
      />
    ) : null;

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
              sharedStyles.largeFixedSizeThumbnail,
              {backgroundColor: theme.colors.surfaceDisabled},
            ]}
            onError={e => {
              console.log({e});
              setUri(DEFAULT_COVER_ART_URI);
            }}
          />
        </Surface>
        <TextBadge content={volumeText} />
        <View style={[sharedStyles.rowWrap, {gap: spacing(0.5)}]}>
          {mainLocaleMarkup}
          {secondLocaleMarkup}
          {otherLocalesMarkup}
        </View>
      </>
    </TouchableRipple>
  );
}
