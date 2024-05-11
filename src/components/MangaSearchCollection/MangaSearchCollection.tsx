import React, {useCallback, useEffect, useMemo} from 'react';
import {useState} from 'react';
import SearchBar from '../SearchBar';
import MangaCollection from '../MangaCollection';
import {useMangadexPagination} from '@app/api/mangadex/hooks';
import {
  Manga,
  MangaRequestParams,
  PagedResultsList,
  isSuccess,
} from '@app/api/mangadex/types';
import {useFiltersStore} from '@app/foundation/state/StaterinoProvider';
import {sanitizeFilters} from '@app/foundation/state/filters';
import {useDexifyNavigation} from '@app/foundation/navigation';
import {useLazyGetRequest} from '@app/api/utils';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {FiltersPreview} from './components';
import {StyleProp, View, ViewStyle} from 'react-native';
import {sharedStyles} from '@app/utils/styles';
import {useDimensions} from '@app/utils';
import {VisibleThumbnailInfo} from '../SimpleMangaThumbnail/SimpleMangaThumbnail';

export interface MangaSearchCollectionProps {
  hidePreview?: boolean;
  hideSearchbar?: boolean;
  hideThumbnailInfo?: VisibleThumbnailInfo[];
  useFilters?: boolean;
  searchBarPlaceholder?: string;
  override?: MangaRequestParams;
  requireIds?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function MangaSearchCollection({
  hidePreview,
  hideSearchbar,
  hideThumbnailInfo,
  useFilters,
  searchBarPlaceholder,
  override,
  requireIds,
  contentContainerStyle,
}: MangaSearchCollectionProps) {
  const navigation = useDexifyNavigation();
  const {width} = useDimensions();
  const numColumns = width < 350 ? 2 : 3;

  const [title, setTitle] = useState('');
  const [mangaList, setMangaList] = useState<Manga[]>([]);

  const [hasMore, setHasMore] = useState(true);
  const {offset, nextOffset, nextPage, resetPage} = useMangadexPagination([]);

  const {params: filters} = useFiltersStore();
  const params = useMemo(() => {
    if (useFilters) {
      return {...sanitizeFilters(filters), title, ...override};
    } else {
      return {title, ...override};
    }
  }, [title, filters, useFilters, override]);

  const options = useMemo(
    () => ({limit: 50, offset, ...params}),
    [params, offset],
  );

  const [get, {loading, data}] = useLazyGetRequest<PagedResultsList<Manga>>();

  const fetchManga = useCallback(() => {
    if (requireIds && (options.ids || []).length === 0) {
      return;
    }

    get(UrlBuilder.mangaList({...options, order: {followedCount: 'desc'}}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, override, requireIds]);

  useEffect(() => {
    fetchManga();
  }, [fetchManga]);

  useEffect(() => {
    setMangaList([]);
    setHasMore(true);
    resetPage();
  }, [params, resetPage]);

  useEffect(() => {
    if (isSuccess(data)) {
      let newMangaList = data.data;

      setHasMore(data.total > nextOffset);
      setMangaList(current => {
        const mergedMangas = [...current, ...newMangaList];
        const result: Manga[] = [];
        const addedIds: string[] = [];

        mergedMangas.forEach(manga => {
          if (!addedIds.includes(manga.id)) {
            result.push(manga);
            addedIds.push(manga.id);
          }
        });

        return result;
      });
    }
  }, [data, nextOffset]);

  return (
    <View style={sharedStyles.flex}>
      {hideSearchbar ? null : (
        <View>
          <SearchBar
            loading={loading}
            query={title}
            placeholder={searchBarPlaceholder}
            onQueryChange={setTitle}
            onShowFilters={() => navigation.push('Filters')}
          />
          {hidePreview ? null : <FiltersPreview />}
        </View>
      )}
      <MangaCollection
        hideThumbnailInfo={hideThumbnailInfo}
        mangaList={mangaList}
        loading={loading}
        numColumns={numColumns}
        contentContainerStyle={contentContainerStyle}
        onMangaPress={manga => navigation.push('ShowManga', {...manga})}
        onEndReached={() => {
          if (!loading && hasMore) {
            nextPage();
          }
        }}
      />
    </View>
  );
}
