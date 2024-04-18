import {ContentRating, Manga} from '@app/api/mangadex/types';
import TextBadge from './TextBadge';
import {contentRatingHumanReadable} from './MangaSearchFilters/components/ContentRatingField';

interface BaseProps {
  type: 'manga' | 'contentRating';
}

interface PropsForManga extends BaseProps {
  type: 'manga';
  manga: Manga;
}

interface PropsForContentRating extends BaseProps {
  type: 'contentRating';
  contentRating: ContentRating;
}

export type ContentRatingProps = PropsForManga | PropsForContentRating;

export default function ContentRatingTextBadge(props: ContentRatingProps) {
  if (props.type === 'manga') {
    return (
      <ContentRatingTextBadge
        type="contentRating"
        contentRating={props.manga.attributes.contentRating}
      />
    );
  }

  const {contentRating} = props;

  return (
    <TextBadge
      icon={iconForContentRating(contentRating)}
      content={contentRatingHumanReadable(contentRating)}
      background="surfaceVariant"
    />
  );
}

function iconForContentRating(contentRating: ContentRating) {
  switch (contentRating) {
    case ContentRating.safe:
      return 'check-bold';
    case ContentRating.suggestive:
      return 'check-outline';
    case ContentRating.erotica:
      return 'alert-rhombus-outline';
    case ContentRating.pornographic:
      return 'alert-rhombus';
  }
}
