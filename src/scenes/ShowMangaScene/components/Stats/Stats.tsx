import {Manga} from '@app/api/mangadex/types';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {useLazyGetRequest} from '@app/api/utils';
import {useEffect} from 'react';
import {useManga} from '../MangaProvider';
import StatsDetails from './StatsDetails';

export default function Stats() {
  const manga = useManga();
  const [get, {data, loading}] = useLazyGetRequest<Manga.StatisticsResponse>(
    UrlBuilder.mangaStatistics(manga.id),
  );

  useEffect(() => {
    get();
  }, []);

  if (loading) {
    return <StatsDetails.Loading />;
  }

  if (data?.result === 'ok') {
    const mangaStatistics = data.statistics[manga.id];
    return <StatsDetails statistics={mangaStatistics} />;
  }

  return null;
}
