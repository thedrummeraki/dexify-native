import {MangaAttributes} from '@app/api/mangadex/types';

export type SearchableField = keyof Pick<
  MangaAttributes,
  | 'availableTranslatedLanguages'
  | 'contentRating'
  | 'createdAt'
  | 'originalLanguage'
  | 'publicationDemographic'
  | 'status'
  | 'tags'
  | 'title'
  | 'updatedAt'
  | 'year'
>;
