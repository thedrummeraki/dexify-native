import React from 'react';
import {useMangaDetails} from '../MangaProvider';
import StatsDetails from './StatsDetails';

export default function Stats() {
  const {manga, stats, statsLoading: loading} = useMangaDetails();

  if (loading) {
    return <StatsDetails.Loading />;
  }

  if (stats.result === 'ok') {
    const mangaStatistics = stats.statistics[manga.id];
    if (!mangaStatistics) {
      return <StatsDetails.Loading />;
    }
    return <StatsDetails statistics={mangaStatistics} />;
  }

  return null;
}
