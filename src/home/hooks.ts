import {useLazyGetRequest} from '@app/api/utils';
import {Category, ChapterCategory, MangaCategory} from './types';
import {Chapter, Manga, PagedResultsList} from '@app/api/mangadex/types';
import {urlForCategory} from './utils';

export type ValidHomeResource = Manga | Chapter;

export function useMangaCategory(category: MangaCategory) {
  return useTypedCategory<Manga, typeof category>(category);
}

export function useChapterCategory(category: ChapterCategory) {
  return useTypedCategory<Chapter, typeof category>(category);
}

function useTypedCategory<T extends ValidHomeResource, C extends Category>(
  category: C,
): [
  typeof category,
  () => Promise<PagedResultsList<T | undefined> | undefined>,
] {
  const [get] = useLazyGetRequest<PagedResultsList<T | undefined>>();
  return [category, () => get(urlForCategory(category))];
}
