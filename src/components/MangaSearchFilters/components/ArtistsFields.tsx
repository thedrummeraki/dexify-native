import React, {useCallback} from 'react';
import {Artist} from '@app/api/mangadex/types';
import MultiSelectSearchableField, {
  BaseMultiSelectSearchableFieldProps,
} from './MultiSelectSearchableField';

type ArtistsFieldProps = BaseMultiSelectSearchableFieldProps<Artist>;

export default function ArtistsField(props: ArtistsFieldProps) {
  const valueAsKey = useCallback((artist: Artist) => artist.id, []);

  return (
    <MultiSelectSearchableField
      title="Artists"
      humanReadableValue={artistAuthorHumanReadable}
      valueAsKey={valueAsKey}
      {...props}
    />
  );
}

export function artistAuthorHumanReadable(artist: Artist): string {
  return artist.attributes.name;
}
