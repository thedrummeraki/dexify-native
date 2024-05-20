import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {Category} from './types';

export function urlForCategory(category: Category) {
  const path = category.url || `/${category.resource}`;
  const query =
    typeof category.query === 'function' ? category.query() : category.query;
  return UrlBuilder.buildUrl(path, query);
}
