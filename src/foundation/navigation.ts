import {Manga} from '@app/api/mangadex/types';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type MangaParams = Partial<Omit<Manga, 'type' | 'id'>> & {id: string};

export type RootStackParamList = {
  Home: undefined;
  Filters: undefined;
  ShowManga: MangaParams & {isAiring?: boolean; jumpToVolume?: string | null};
  ShowMangaDetailsModal: MangaParams;
  // ShowMangaGallery: {manga: Manga; number?: number};
  // ShowChapter: {id: string; jumpToPage?: number};
  // ShowArtist: {id: string; allowHentai?: boolean};
  // ShowScanlationGroup: {id: string; allowHentai?: boolean};
  // ShowMangaList: {
  //   title?: string;
  //   description?: string;
  //   ids?: string[];
  //   params?: MangaRequestParams
  // };
  // ShowAnimeSimulcastMangaList: undefined;
  // ShowReadingStatusLibrary: {readingStatus: ReadingStatus};
  // ShowCustomList: {id: string};
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
