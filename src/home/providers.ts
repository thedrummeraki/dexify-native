import {PagedResultsList} from '@app/api/mangadex/types';
import {
  familyFriendly,
  featuredManga,
  longStrips,
  newArrivals,
  topRomantic,
  trendingNow,
} from './categories';
import {ValidHomeResource, useMangaCategory} from './hooks';
import {Category, Provider} from './types';

export function baseProvider(): Category[] {
  return [trendingNow, newArrivals];
}

export function useBaseProvider(): Provider<
  PagedResultsList<ValidHomeResource | undefined> | undefined
> {
  return [
    useMangaCategory(featuredManga),
    useMangaCategory(newArrivals),
    useMangaCategory(trendingNow),
    useMangaCategory(familyFriendly),
    useMangaCategory(longStrips),
    useMangaCategory(topRomantic),
  ];
}
