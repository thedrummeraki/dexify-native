import React, {useEffect} from 'react';
import {
  Manga,
  MangaRelationshipType,
  PagedResultsList,
  Relationship,
  isSuccess,
} from '@app/api/mangadex/types';
import {useLazyGetRequest} from '@app/api/utils';
import {useState} from 'react';
import {useMangaDetails} from './MangaProvider';
import {findRelationships, useContentRating} from '@app/api/mangadex/utils';
import {ItemsSection, SimpleMangaThumbnail} from '@app/components';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {sharedStyles} from '@app/utils/styles';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useDexifyNavigation} from '@app/foundation/navigation';
import {useSubscribedLibrary} from '@app/providers/LibraryProvider';

export default function RelatedSections() {
  const theme = useTheme();
  const navigation = useDexifyNavigation();
  const {manga} = useMangaDetails();
  const [relatedManga, setRelatedManga] = useState<Manga[]>([]);
  const {data: library} = useSubscribedLibrary();

  const contentRating = useContentRating();

  const relatedMangaData: Relationship<Manga>[] = findRelationships<Manga>(
    manga,
    'manga',
  );

  const hasMore = relatedMangaData.length > 10;

  const [fetchRelatedManga, {data, loading}] =
    useLazyGetRequest<PagedResultsList<Manga>>();

  const count = isSuccess(data) ? data.total : 0;

  useEffect(() => {
    if (relatedMangaData.length === 0) {
      return;
    }

    const ids = relatedMangaData.map(x => x.id).slice(0, 100);
    fetchRelatedManga(
      UrlBuilder.mangaList({
        ids,
        limit: 10,
        contentRating,
        order: {
          followedCount: 'desc',
        },
      }),
    ).then(data => {
      if (isSuccess(data)) {
        setRelatedManga(data.data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <ItemsSection
        data={relatedMangaData}
        hideIfEmpty
        onViewMorePress={hasMore ? () => {} : undefined}
        renderItem={() => (
          <View
            style={[
              {backgroundColor: theme.colors.surfaceDisabled},
              sharedStyles.fixedSizeThumbnail,
            ]}
          />
        )}
        title="Related manga"
      />
    );
  }

  return (
    <ItemsSection
      hideIfEmpty
      data={relatedManga}
      title={`Related manga (${count})`}
      subtitle="Browse other related works"
      onViewMorePress={hasMore ? () => {} : undefined}
      renderItem={({item}) => {
        const relationship = relatedMangaData.find(x => x.id === item.id);
        const related = relationship?.related;
        const relatedName = related
          ? MANGA_RELATIONS[related] || related
          : undefined;

        return (
          <SimpleMangaThumbnail
            manga={item}
            onPress={() => navigation.push('ShowManga', item)}
            style={{
              height: sharedStyles.fixedSizeThumbnail.height + 40,
              width:
                sharedStyles.fixedSizeThumbnail.height *
                sharedStyles.fixedSizeThumbnail.aspectRatio,
            }}
            imageStyle={sharedStyles.fixedSizeThumbnail}
            subtitle={relatedName}
            info={{readingStatus: library.statuses[item.id]}}
          />
        );
      }}
      keyExtractor={item => item.id}
    />
  );
}

const MANGA_RELATIONS: {[keyof in MangaRelationshipType]: string} = {
  monochrome: 'Monochrome',
  adapted_from: 'Adapted from',
  alternate_story: 'Alternate story',
  alternate_version: 'Alternate version',
  based_on: 'Based on',
  colored: 'Coloured work',
  doujinshi: 'Doujinshi',
  main_story: 'Main story',
  prequel: 'Prequel',
  preserialization: 'Preserialization',
  same_franchise: 'From same franchise',
  sequel: 'Sequel',
  serialization: 'Serialization',
  shared_universe: 'Shared universe',
  side_story: 'Side story',
  spin_off: 'Spin off',
};
