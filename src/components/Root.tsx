import React from 'react';
import {sharedStyles} from '@app/utils/styles';
import ButtonNavigationScene from '@app/foundation/ButtonNavigationScene';
import {View} from 'react-native';

// type MangaSearchParams = Partial<FormState & {title: string}>;

export function Root() {
  return (
    <View style={sharedStyles.flex}>
      <ButtonNavigationScene />
    </View>
  );
}

// const handleSubmit = useCallback((fields: Partial<FormState>) => {
//   const entries = Object.entries(fields).filter(([_, value]) => {
//     if (typeof value === 'string' || Array.isArray(value)) {
//       return value.length > 0;
//     } else if (typeof value === 'object') {
//       return Object.keys(value).length > 0;
//     } else {
//       return value !== undefined && value !== null;
//     }
//   });

//   const result = Object.fromEntries(entries) as FormState;
//   setParams({...result});
//   setShowFilters(false);
// }, []);

// useDebouncedEffect(() => {
//   // handleSubmit(params);
//   if (title.length > 0 || Object.keys(params)) {
//     console.log('submitting on change', {title, params});
//     // fetchManga(UrlBuilder.mangaList({...params, title})).then(result => {
//     //   if (isSuccess(result)) {
//     //     setManga(result.data);
//     //   }
//     // });
//   }
// }, [title, params]);
