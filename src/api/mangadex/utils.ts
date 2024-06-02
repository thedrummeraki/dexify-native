import {getDeviceMangadexFriendlyLanguage} from '@app/utils';
import {
  Artist,
  Author,
  Chapter,
  ContentRating,
  CoverArt,
  GroupedChapters,
  Manga,
  MangaRelationshipType,
  PossibleRelationship,
  PossibleRelationshipTypes,
  Relationship,
  Title,
} from './types';
import {useStore} from '@app/foundation/state/StaterinoProvider';

export enum CoverSize {
  Original = '',
  Medium = '.512.jpg',
  Small = '.256.jpg',
}

export function preferredMangaTitle(manga: Manga) {
  const deviceLangInTitle = Object.keys(manga.attributes.title).find(locale =>
    locale.startsWith(getDeviceMangadexFriendlyLanguage()),
  );

  if (deviceLangInTitle) {
    return manga.attributes.title[deviceLangInTitle];
  }

  return (
    manga.attributes.title[manga.attributes.originalLanguage] ||
    preferredTitle(manga.attributes.title)
  );
}

export function volumeInfoTitle({volume}: {volume: string | null}) {
  return volume ? `Vol. ${volume}` : '- no volume -';
}

export function secondaryMangaTitle(manga: Manga) {
  const deviceLangTitle = manga.attributes.altTitles.find(title => {
    const lang = Object.keys(title)[0];
    return lang.startsWith(getDeviceMangadexFriendlyLanguage());
  });
  if (deviceLangTitle) {
    return preferredTitle(deviceLangTitle);
  }

  const originalTitle =
    manga.attributes.altTitles.find(title => {
      const lang = Object.keys(title)[0];
      return lang.startsWith(manga.attributes.originalLanguage);
    }) || manga.attributes.altTitles[0];

  if (!originalTitle) {
    return null;
  }
  return preferredTitle(originalTitle);
}

export function preferredTagName(tag: Manga.Tag) {
  if (tag.attributes.name === undefined) {
    console.log('TAG:!!!!', {tag});
  }
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

export function hasDescription(manga: Manga): boolean {
  const descriptionText = preferredMangaDescription(manga);
  return (descriptionText || '').length > 0;
}

export function preferredChapterTitle(chapter: Chapter) {
  const {title, chapter: number} = chapter.attributes;

  if (!number && !title) {
    return 'Oneshot';
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

export function groupChapters(chapters: Chapter[]): GroupedChapters {
  const groupedChapters = chapters.reduce((map, chapter) => {
    map.set(chapter.attributes.chapter, [
      ...(map.get(chapter.attributes.chapter) || []),
      chapter,
    ]);
    return map;
  }, new Map());

  return groupedChapters;
}

export function useContentRating(): ContentRating[] | undefined {
  const user = useStore(state => state.user.user);
  if (user) {
    return Object.values(ContentRating);
  }
  return undefined;
}

export function isLongStrip(manga: Manga): boolean {
  return Boolean(
    manga.attributes.tags.find(
      tag => tag.id === '3e2b8dae-350e-4ab8-a8ce-016e844b9f0d',
    ),
  );
}
