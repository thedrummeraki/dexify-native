import {
  ChapterRequestParams,
  MangaRequestParams,
} from '@app/api/mangadex/types';
import {ParamsLike} from '@app/api/mangadex/types/api/urlBuilder';

export enum CategoryDisplay {
  Featured = 'featured',
  Collection = 'collection',
  Entity = 'entity',
}

export type MangaCategoryResource = 'manga';
export type ChapterCategoryResource = 'chapter';
export type CategoryResource = MangaCategoryResource | ChapterCategoryResource;

export interface BaseCategory<Q = ParamsLike> {
  slug: string;
  title?: string;
  resource: CategoryResource;
  url?: string;
  display: CategoryDisplay;
  subtitle?: string;
  query: Q | (() => Q);
}

export interface MangaCategory extends BaseCategory<MangaRequestParams> {
  resource: 'manga';
}

export interface ChapterCategory extends BaseCategory<ChapterRequestParams> {
  resource: 'chapter';
}

export type Category = MangaCategory | ChapterCategory;

export type Provider<T, C = Category> = Array<[C, () => Promise<T>]>;

export interface CategoryResponse<T> {
  category: Category;
  response: T;
}
