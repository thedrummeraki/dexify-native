import {Artist, Author, CustomList, Manga} from '@app/api/mangadex/types';
import {VolumeInfo} from '@app/scenes/ShowMangaScene/components/ShowMangaContentsContainer/VolumesContainer';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type MangaParams = Partial<Omit<Manga, 'type' | 'id'>> & {id: string};
type AuthorArtistParams = Partial<Omit<Author | Artist, 'id'>> & {id: string};

export type RootStackParamList = {
  Home: undefined;
  Filters: undefined;
  ShowManga: MangaParams & {isAiring?: boolean; jumpToVolume?: string | null};
  ShowMangaDetailsModal: MangaParams;
  ShowMangaVolume: {
    manga: Manga;
    volumeInfo: VolumeInfo;
  };
  // ShowMangaGallery: {manga: Manga; number?: number};
  // ShowChapter: {id: string; jumpToPage?: number};
  ShowArtist: AuthorArtistParams & {allowHentai?: boolean};
  ShowMangaLibraryModal: MangaParams;
  ShowMangaMDListsModal: MangaParams;
  // ShowScanlationGroup: {id: string; allowHentai?: boolean};
  // ShowMangaList: {
  //   title?: string;
  //   description?: string;
  //   ids?: string[];
  //   params?: MangaRequestParams
  // };
  // ShowAnimeSimulcastMangaList: undefined;
  // ShowReadingStatusLibrary: {readingStatus: ReadingStatus};
  ShowCustomList: Partial<Omit<CustomList, 'id'>> & {id: string};
  // ShowMangaByTags: {tags: Manga.Tag[]};
  // ShowSettings: undefined;
};

export type DexifyNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export function useDexifyNavigation() {
  return useNavigation<DexifyNavigationProp>();
}

export function useShowMangaRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowManga'>>();
}

export function useShowMangaDetailsModalRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowMangaDetailsModal'>>();
}

export function useShowMangaVolumeRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowMangaVolume'>>();
}

export function useShowArtistRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowArtist'>>();
}

export function useShowCustomListRoute() {
  return useRoute<RouteProp<RootStackParamList, 'ShowCustomList'>>();
}
