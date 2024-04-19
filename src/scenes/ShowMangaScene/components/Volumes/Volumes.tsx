import {Banner, ProgressBar, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {useEffect, useMemo, useState} from 'react';
import {PaddingHorizontal, ViewSelector} from '@app/components';
import {useMangaDetails} from '../MangaProvider';
import {Manga} from '@app/api/mangadex/types';
import {useLazyGetRequest} from '@app/api/utils';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import VolumesContainer, {
  VolumeInfo,
  VolumeView,
  VolumesContainerFlatListProps,
} from './VolumesContainer';
import {spacing} from '@app/utils/styles';
import {useDexifyNavigation} from '@app/foundation/navigation';
import {useMangadexPagination} from '@app/api/mangadex/hooks';

export type VolumesProps = VolumesContainerFlatListProps;

export default function Volumes(props: VolumesProps) {
  const navigation = useDexifyNavigation();
  const {
    manga,
    coverArts,
    aggregate: data,
    aggregateLoading: loading,
  } = useMangaDetails();
  const [volumeView] = useState(VolumeView.Grid);

  const aggregateEntries =
    data?.result === 'ok' ? Object.entries(data.volumes) : [];

  const volumeInfos: VolumeInfo[] = useMemo(
    () =>
      aggregateEntries.map(([volume, details]) => {
        const chapterIds = Object.entries(details.chapters).map(
          ([_, detail]) => detail.id,
        );

        const otherChpaterIds = Object.entries(details.chapters).flatMap(
          ([_, detail]) => detail.others,
        );

        const coverArt =
          coverArts.find(coverArt => coverArt.attributes.volume === volume) ||
          null;

        return {
          volume: volume === 'none' ? null : volume,
          chapterIds: [...chapterIds, ...otherChpaterIds],
          coverArt,
        };
      }),
    [aggregateEntries, coverArts],
  );

  const ListHeaderComponent = (
    <>
      {props.ListHeaderComponent}
      <PaddingHorizontal>
        <View style={styles.header}>
          <View style={styles.headerPrimary}>
            <Text variant="titleMedium" style={styles.temporaryHeaderText}>
              Volumes
            </Text>
          </View>
          {/* <ViewSelector */}
          {/*   options={[ */}
          {/*     { icon: 'format-list-bulleted', value: VolumeView.List }, */}
          {/*     { icon: 'grid-large', value: VolumeView.Grid }, */}
          {/*   ]} */}
          {/*   value={volumeView} */}
          {/*   onValueChange={setVolumeView} */}
          {/* /> */}
        </View>
      </PaddingHorizontal>
      {loading && <ProgressBar indeterminate />}
    </>
  );

  return (
    <View>
      <View style={styles.container}>
        <VolumesContainer
          volumeInfoList={volumeInfos}
          volumeView={volumeView}
          onVolumePress={volumeInfo =>
            navigation.push('ShowMangaVolume', {volumeInfo, manga})
          }
          {...props}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={
            loading ? null : (
              <Banner visible>No volumes can be read from Mangadex.</Banner>
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerPrimary: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  temporaryHeaderText: {
    paddingVertical: spacing(2),
  },
  container: {},
});
