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

export type VolumesProps = VolumesContainerFlatListProps;

export default function Volumes(props: VolumesProps) {
  const {manga, coverArts} = useMangaDetails();
  const [volumeView, setVolumeView] = useState(VolumeView.Grid);

  const [getVolumesAndChapters, {data, loading}] =
    useLazyGetRequest<Manga.Aggregate>(
      UrlBuilder.mangaVolumesAndChapters(manga.id),
    );

  useEffect(() => {
    getVolumesAndChapters();
  }, []);

  const aggregateEntries =
    data?.result === 'ok' ? Object.entries(data.volumes) : [];

  const volumeInfos: VolumeInfo[] = useMemo(
    () =>
      aggregateEntries.map(([volume, details]) => {
        const chapterIds = Object.entries(details.chapters).map(
          ([_, detail]) => detail.id,
        );

        const coverArt =
          coverArts.find(coverArt => coverArt.attributes.volume === volume) ||
          null;

        return {
          volume: volume === 'none' ? null : volume,
          chapterIds,
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
            <Text variant="titleMedium">Volumes</Text>
          </View>
          <ViewSelector
            options={[
              // {icon: 'format-list-bulleted', value: VolumeView.List},
              {icon: 'grid-large', value: VolumeView.Grid},
            ]}
            value={volumeView}
            onValueChange={setVolumeView}
          />
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
          {...props}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={
            <Banner visible>No volumes can be read from Mangadex.</Banner>
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
  container: {},
});
