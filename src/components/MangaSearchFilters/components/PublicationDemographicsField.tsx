import React from 'react';
import {PublicationDemographic} from '@app/api/mangadex/types';
import MultiSelectSimpleField, {
  BaseMultiSelectSimpleFieldProps,
} from './MultiSelectSimpleField';

type PublicationDemographicsFieldProps =
  BaseMultiSelectSimpleFieldProps<PublicationDemographic>;

export default function PublicationDemographicsField(
  props: PublicationDemographicsFieldProps,
) {
  return (
    <MultiSelectSimpleField
      title="Magazine demographic"
      humanReadableValue={publicationDemographicsHumanReadableValue}
      {...props}
    />
  );
}

export function publicationDemographicsHumanReadableValue(
  value: PublicationDemographic,
): string {
  switch (value) {
    case 'shounen':
      return 'Shonen';
    case 'shoujo':
      return 'Shojo';
    case 'josei':
      return 'Josei';
    case 'seinen':
      return 'Seinen';
    default:
      return 'None';
  }
}
