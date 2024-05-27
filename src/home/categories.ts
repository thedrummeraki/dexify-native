import {
  ContentRating,
  MangaRequestParams,
  TagMode,
} from '@app/api/mangadex/types';
import {CategoryDisplay, ChapterCategory, MangaCategory} from './types';

const defaultMangaQueryParams: MangaRequestParams = {
  contentRating: [ContentRating.safe, ContentRating.suggestive],
  includes: ['cover_art', 'artist', 'author', 'tag'],
  limit: 30,
  hasAvailableChapters: 'true',
};

export const trendingNow: MangaCategory = {
  slug: 'trending-now',
  title: 'Trending now',
  resource: 'manga',
  display: CategoryDisplay.Collection,
  query: () => {
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate(),
    );
    const createdAtSince = oneMonthAgo.toISOString().split('.')[0];
    return {
      ...defaultMangaQueryParams,
      createdAtSince,
      order: {followedCount: 'desc'},
    };
  },
};

export const featuredManga: MangaCategory = {
  slug: 'featured',
  resource: 'manga',
  display: CategoryDisplay.Featured,
  query: () => {
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate(),
    );
    const createdAtSince = oneMonthAgo.toISOString().split('.')[0];

    // grab random top 10 manga
    const offset = Math.floor(Math.random() * 10);
    return {
      ...defaultMangaQueryParams,
      createdAtSince,
      limit: 1,
      offset,
      order: {followedCount: 'desc'},
    };
  },
};

export const newArrivals: MangaCategory = {
  slug: 'new-arrivals',
  title: 'Recently added',
  resource: 'manga',
  display: CategoryDisplay.Collection,
  query: {...defaultMangaQueryParams, order: {createdAt: 'desc'}},
};

export const newChapters: ChapterCategory = {
  slug: 'new-chapters',
  title: 'Latest updates',
  resource: 'chapter',
  display: CategoryDisplay.Collection,
  query: {includes: ['manga', 'scanlation_group']},
};

export const mostPopular: MangaCategory = {
  slug: 'most-popular',
  title: 'Most popular',
  subtitle: 'Top rated manga of all time',
  resource: 'manga',
  display: CategoryDisplay.Collection,
  query: {...defaultMangaQueryParams, order: {followedCount: 'desc'}},
};

export const familyFriendly: MangaCategory = {
  slug: 'family-friendly',
  title: 'Family friendly',
  resource: 'manga',
  display: CategoryDisplay.Collection,
  query: {
    ...defaultMangaQueryParams,
    contentRating: [ContentRating.safe],
    includedTagsMode: TagMode.OR,
    includedTags: [
      // action
      '391b0423-d847-456f-aff0-8b0cfc03066b',
      // magic
      'a1f53773-c69a-4ce5-8cab-fffcd90b1565',
      // thriller
      '07251805-a27e-4d59-b488-f0bfbec15168',
      // sci-fi
      '256c8bd9-4904-4360-bf4f-508a76d67183',
      // romance
      '423e2eae-a7a2-4a8b-ac03-a8351462d71d',
    ],
    excludedTags: [
      // loli
      '2d1f5d56-a1e5-4d0d-a961-2193588b08ec',
      // demons
      '39730448-9a5f-48a2-85b0-a70db87b1233',
      // monsters
      '36fd93ea-e8b8-445e-b836-358f02b3d33d',
      // monster girls
      'dd1f77c5-dea9-4e2b-97ae-224af09caf99',
      // psychological
      '3b60b75c-a2d7-4860-ab56-05f391bb889c',
      // incest
      '5bd0e105-4481-44ca-b6e7-7544da56b1a3',
      // sexual violence
      '97893a4c-12af-4dac-b6be-0dffb353568e',
      // harem
      'aafb99c1-7f60-43fa-b75f-fc9502ce29c7',
      // gore
      'b29d6a3d-1569-4e7a-8caf-7557bc92cd5d',
      // horror
      'cdad7e68-1419-41dd-bdce-27753074a640',
    ],
    order: {followedCount: 'desc'},
  },
};

export const topRomantic: MangaCategory = {
  slug: 'top-romantic',
  title: 'All about love',
  resource: 'manga',
  display: CategoryDisplay.Collection,
  query: {
    ...defaultMangaQueryParams,
    contentRating: [ContentRating.safe, ContentRating.suggestive],
    includedTagsMode: TagMode.OR,
    includedTags: [
      // romance
      '423e2eae-a7a2-4a8b-ac03-a8351462d71d',
      // yuri
      'a3c67850-4684-404e-9b7f-c69850ee5da6',
      // yaoi
      '5920b825-4181-4a17-beeb-9918b0ff7a30',
    ],
  },
};

export const longStrips: MangaCategory = {
  slug: 'long-strips',
  title: 'Long Strip',
  resource: 'manga',
  display: CategoryDisplay.Collection,
  query: {
    ...defaultMangaQueryParams,
    includedTags: [
      // long strip
      '3e2b8dae-350e-4ab8-a8ce-016e844b9f0d',
    ],
  },
};
