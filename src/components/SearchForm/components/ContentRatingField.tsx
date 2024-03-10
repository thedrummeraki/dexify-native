import React from 'react';
import {ContentRating} from '@app/api/mangadex/types';
import MultiSelectSimpleField, {
  BaseMultiSelectSimpleFieldProps,
} from './MultiSelectSimpleField';

type ContentRatingFieldProps = BaseMultiSelectSimpleFieldProps<ContentRating>;

export default function ContentRatingField(props: ContentRatingFieldProps) {
  return (
    <MultiSelectSimpleField
      title="Content Rating"
      humanReadableValue={contentRatingHumanReadable}
      {...props}
    />
  );
}

function contentRatingHumanReadable(value: ContentRating): string {
  switch (value) {
    case 'safe':
      return 'Safe';
    case 'suggestive':
      return 'Suggestive';
    case 'erotica':
      return 'Erotica';
    case 'pornographic':
      return 'Hentai (18+)';
    default:
      return String(value);
  }
}
