import React from 'react';
import {MangaStatus} from '@app/api/mangadex/types';
import MultiSelectSimpleField, {
  BaseMultiSelectSimpleFieldProps,
} from './MultiSelectSimpleField';

type MangaStatusFieldProps = BaseMultiSelectSimpleFieldProps<MangaStatus>;

export default function MangaStatusField(props: MangaStatusFieldProps) {
  return (
    <MultiSelectSimpleField
      title="Publication status"
      humanReadableValue={mangaStatusHumanReadable}
      {...props}
    />
  );
}

export function mangaStatusHumanReadable(value: MangaStatus): string {
  switch (value) {
    case 'ongoing':
      return 'Ongoing';
    case 'completed':
      return 'Completed';
    case 'hiatus':
      return 'Hiatus';
    case 'cancelled':
      return 'Cancelled';
    default:
      return String(value);
  }
}
