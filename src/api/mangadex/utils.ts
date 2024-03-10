import {
  Artist,
  Author,
  Chapter,
  CoverArt,
  Manga,
  MangaRelationshipType,
  PossibleRelationship,
  PossibleRelationshipTypes,
  Relationship,
  Title,
} from './types';

export enum CoverSize {
  Original = '',
  Medium = '.512.jpg',
  Small = '.256.jpg',
}

export function preferredMangaTitle(manga: Manga) {
  return (
    manga.attributes.title[manga.attributes.originalLanguage] ||
    preferredTitle(manga.attributes.title)
  );
}

export function preferredTagName(tag: Manga.Tag) {
  return preferredTitle(tag.attributes.name);
}

export function preferredMangaAuthor(manga: Manga) {
  return (
    findRelationship<Author>(manga, 'author') ||
    findRelationship<Artist>(manga, 'artist')
  );
}

export function preferredTitle(title: Title) {
  return title.en || Object.entries(title).map(([_, value]) => value)[0];
}

export function preferredMangaDescription(manga: Manga) {
  if (Object.entries(manga.attributes.description).length === 0) {
    return null;
  }

  return (
    manga.attributes.description.en ||
    manga.attributes.description[manga.attributes.originalLanguage]
  );
}

export function preferredChapterTitle(chapter: Chapter) {
  const {title, chapter: number} = chapter.attributes;

  if (!number && !title) {
    return 'N/A';
  }

  if (number && !title) {
    return `${number}) Chapter ${number}`;
  }

  if (number && title) {
    return `${number}) ${title}`;
  }

  return title;
}

export function anyValidRelationship(
  resource: {relationships: Relationship[]},
  type: unknown,
): type is PossibleRelationshipTypes {
  return Boolean(resource.relationships.find(r => r.type === type));
}

export function findRelationship<T extends PossibleRelationship>(
  resource: {
    relationships: Relationship[];
  },
  type: PossibleRelationshipTypes,
) {
  if (anyValidRelationship(resource, type)) {
    return resource.relationships.find(r => r.type === type) as T;
  }
  return null;
}

export function findRelationships<T extends PossibleRelationship>(
  resource: {
    relationships: Relationship[];
  },
  type: PossibleRelationshipTypes,
) {
  if (anyValidRelationship(resource, type)) {
    return resource.relationships.filter(r => r.type === type) as T[];
  }
  return [];
}

export function mangaImage(manga: Manga, options?: {size?: CoverSize}): string {
  const cover = findRelationship<CoverArt>(manga, 'cover_art');

  if (!cover?.attributes) {
    return 'https://mangadex.org/img/avatar.png';
  }
  return coverImage(cover, manga.id, options);
}

export function coverImage(
  cover: CoverArt,
  mangaId: string,
  options?: {size?: CoverSize},
): string {
  const {fileName} = cover.attributes;

  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}${
    options?.size || CoverSize.Medium
  }`;
}

export function mangaRelationshipTypeInfo(type: MangaRelationshipType) {
  switch (type) {
    case MangaRelationshipType.AdaptedFrom:
      return {
        content: 'Adapted from',
      };
    case MangaRelationshipType.AlternateStory:
      return {
        content: 'Alt. story',
      };
    case MangaRelationshipType.AlternateVersion:
      return {
        content: 'Alt. version',
      };
    case MangaRelationshipType.BasedOn:
      return {
        content: 'Based on',
      };
    case MangaRelationshipType.Colored:
      return {
        content: 'In color',
      };
    case MangaRelationshipType.Doujinshi:
      return {
        content: 'Doujinshi',
      };
    case MangaRelationshipType.MainStory:
      return {
        content: 'Main story',
      };
    case MangaRelationshipType.Monochrome:
      return {
        content: 'Monochrome',
      };
    case MangaRelationshipType.Prequel:
      return {
        content: 'Prequel',
      };
    case MangaRelationshipType.Preserialization:
      return {
        content: 'Pre-serialization',
      };
    case MangaRelationshipType.SameFranchise:
      return {
        content: 'Same franchize',
      };
    case MangaRelationshipType.Sequel:
      return {
        content: 'Sequel',
      };
    case MangaRelationshipType.Serialization:
      return {
        content: 'Serialization',
      };
    case MangaRelationshipType.SharedUniverse:
      return {
        content: 'Shared universe',
      };
    case MangaRelationshipType.SideStory:
      return {
        content: 'Side story',
      };
    case MangaRelationshipType.SpinOff:
      return {
        content: 'Spin-off',
      };
    default:
      return {content: undefined};
  }
}

export function mangaRelationships(manga: Manga) {
  const {relationships} = manga;

  return relationships.filter(isMangaRelation);
}

function isMangaRelation(value: Relationship): value is Relationship<Manga> {
  return value.type === 'manga';
}
