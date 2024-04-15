import {Chapter, CoverArt} from '@app/api/mangadex/types';
import {Banner, Text, TouchableRipple} from 'react-native-paper';
import {FlatList, FlatListProps, Image, StyleSheet, View} from 'react-native';
import {useDimensions} from '@app/utils';
import {ComponentProps} from 'react';
import {CoverSize, coverImage, findRelationship} from '@app/api/mangadex/utils';
import {useManga} from '../../MangaProvider';
import {spacing} from '@app/utils/styles';
import VolumeGridItem from './VolumeGridItem';

export interface VolumeInfo {
  volume: string | null;
  chapterIds: string[];
  coverArt: CoverArt | null;
}

export enum VolumeView {
  List = 'list',
  Grid = 'grid',
}

export type VolumesContainerFlatListProps = Pick<
  ComponentProps<typeof FlatList>,
  | 'ListHeaderComponent'
  | 'ListHeaderComponentStyle'
  | 'ListFooterComponent'
  | 'ListFooterComponentStyle'
  | 'ListEmptyComponent'
  | 'contentContainerStyle'
  | 'refreshControl'
>;

export type VolumesContainerProps = {
  volumeInfoList: VolumeInfo[];
  volumeView: VolumeView;
  onVolumePress(volumeInfo: VolumeInfo): void;
} & VolumesContainerFlatListProps;

type InternalVolumeContainerProps = Omit<VolumesContainerProps, 'volumeView'>;

export default function VolumesContainer({
  volumeView,
  ...internalProps
}: VolumesContainerProps) {
  switch (volumeView) {
    case VolumeView.List:
      return <VolumesList {...internalProps} />;
    case VolumeView.Grid:
      return <VolumesGrid {...internalProps} />;
  }
}

function VolumesList({
  volumeInfoList,
  onVolumePress,
  ...flatListProps
}: InternalVolumeContainerProps) {
  return (
    <FlatList
      data={volumeInfoList}
      renderItem={({item}) => <Text>Vol. {item.volume}</Text>}
      {...flatListProps}
    />
  );
}

function VolumesGrid({
  volumeInfoList,
  onVolumePress,
  ...flatListProps
}: InternalVolumeContainerProps) {
  const {width} = useDimensions();
  const numColums = width < 400 ? 3 : 4;
  const manga = useManga();

  return (
    <FlatList
      data={volumeInfoList}
      numColumns={numColums}
      columnWrapperStyle={{gap: spacing(2)}}
      contentContainerStyle={{padding: spacing(2)}}
      renderItem={({item}) => (
        <View style={{flex: 1 / numColums}}>
          <VolumeGridItem
            onPress={() => onVolumePress(item)}
            volumeInfo={item}
          />
        </View>
      )}
      keyExtractor={item => `${manga.id}-${item.volume}`}
      {...flatListProps}
    />
  );
}
