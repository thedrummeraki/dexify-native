import {Banner, Chip, ProgressBar, Text} from 'react-native-paper';
import {FlatList, StyleSheet, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {PaddingHorizontal, ViewSelector} from '@app/components';
import {useMangaDetails} from '../MangaProvider';
import VolumesContainer, {
  VolumeInfo,
  VolumeView,
  VolumesContainerFlatListProps,
} from './VolumesContainer';
import {spacing} from '@app/utils/styles';
import {useDexifyNavigation} from '@app/foundation/navigation';
import ChaptersList from '@app/scenes/ShowMangaVolumeScene/components/ChaptersList';
import {groupChapters} from '@app/api/mangadex/utils';
import {useFlag} from '@unleash/proxy-client-react';

export type VolumesProps = VolumesContainerFlatListProps;

enum VisibleContent {
  Chapters = 'chapters',
  Volumes = 'volumes',
  Art = 'art',
  Related = 'related',
}

export default function ShowMangaContentsContainer(props: VolumesProps) {
  const navigation = useDexifyNavigation();
  const {
    manga,
    coverArts,
    aggregate: data,
    aggregateLoading: loading,
    chapters,
    chaptersLoading,
  } = useMangaDetails();
  const [volumeView] = useState(VolumeView.Grid);
  // const [currentVisibleContent, setVisibleContent] = useState(
  //   VisibleContent.Chapters,
  // );

  // const {enabled, name} = useVariant('showVolumes');
  const enabled = useFlag('showVolumes');
  const currentVisibleContent = useMemo(
    () =>
      // enabled && name === 'volumes'
      enabled ? VisibleContent.Volumes : VisibleContent.Chapters,
    [enabled],
  );

  // const handleSetCurrentVisibleContent = (visibleContent: VisibleContent) => {
  //   setVisibleContent(visibleContent);
  // };

  const aggregateEntries = useMemo(
    () => (data?.result === 'ok' ? Object.entries(data.volumes) : []),
    [data],
  );

  // const OriginalListHeaderComponent = useMemo(() => props.ListHeaderComponent);

  const groupedChapters = useMemo(() => {
    return groupChapters(chapters);
  }, [chapters]);

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
          coverArts.find(
            currentCoverArt => currentCoverArt.attributes.volume === volume,
          ) || null;

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

      {/* <FlatList
        horizontal
        data={Object.values(VisibleContent)}
        showsHorizontalScrollIndicator={false}
        // contentContainerStyle={styles.chipsContainer}
        contentContainerStyle={styles.header}
        renderItem={({item}) => {
          const {icon, name} = visibleContentInfo(item);
          const selected = currentVisibleContent === item;
          return (
            <Chip
              showSelectedCheck
              showSelectedOverlay
              selected={selected}
              icon={selected ? undefined : icon}
              onPress={() => handleSetCurrentVisibleContent(item)}>
              {name}
            </Chip>
          );
        }}
      /> */}
      {/* <PaddingHorizontal>
        <View style={styles.header}>
          <View style={styles.headerPrimary}>
            <Text variant="titleMedium" style={styles.temporaryHeaderText}>
              {visibleContentInfo(currentVisibleContent).name}
            </Text>
          </View>
          <ViewSelector
            options={[
              {icon: 'format-list-bulleted', value: VolumeView.List},
              {icon: 'grid-large', value: VolumeView.Grid},
            ]}
            value={volumeView}
            onValueChange={() => {}}
          />
        </View>
      </PaddingHorizontal> */}
      {loading && <ProgressBar indeterminate />}
    </>
  );

  switch (currentVisibleContent) {
    case VisibleContent.Chapters:
      return (
        <ChaptersList
          groupedChapters={groupedChapters}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={
            chaptersLoading ? null : (
              <Banner visible>No volumes can be read from Mangadex.</Banner>
            )
          }
        />
      );

    case VisibleContent.Volumes:
      return (
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
      );

    case VisibleContent.Art:
      return null;
    case VisibleContent.Related:
      return null;
  }
}

// function visibleContentInfo(visibleContent: VisibleContent) {
//   switch (visibleContent) {
//     case VisibleContent.Chapters:
//       return {icon: 'format-list-bulleted', name: 'Chapters'};
//     case VisibleContent.Volumes:
//       return {icon: 'view-list', name: 'Volumes'};
//     case VisibleContent.Art:
//       return {icon: 'palette', name: 'Art'};
//     case VisibleContent.Related:
//       return {icon: 'information-variant', name: 'Related'};
//   }
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing(1),
//   },
//   headerPrimary: {
//     flexDirection: 'row',
//     flexGrow: 1,
//   },
//   temporaryHeaderText: {
//     paddingVertical: spacing(2),
//   },
//   container: {flex: 1},
// });
