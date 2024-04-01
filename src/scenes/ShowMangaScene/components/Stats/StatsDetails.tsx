import {Manga} from '@app/api/mangadex/types';
import {View} from 'react-native';
import {Chip} from 'react-native-paper';
import {styles} from './styles';

export interface StatsDetailsProps {
  statistics: Manga.Statistic;
}

function StatsDetails({statistics}: StatsDetailsProps) {
  const comments = statistics.comments?.repliesCount || 'N/A';
  const rating = statistics.rating.average?.toPrecision(3) || 'N/A';
  const follows = statistics.follows;

  return (
    <View style={styles.root}>
      <Chip compact icon="star">
        {rating.toString()}
      </Chip>
      <Chip compact icon="bookmark">
        {follows.toString()}
      </Chip>
      <Chip compact icon="comment">
        {comments.toString()}
      </Chip>
    </View>
  );
}

function Loading() {
  return (
    <View style={styles.root}>
      <Chip disabled compact icon="star">
        0.00
      </Chip>
      <Chip disabled compact icon="bookmark">
        N/A
      </Chip>
      <Chip disabled compact icon="comment">
        N/A
      </Chip>
    </View>
  );
}

StatsDetails.Loading = Loading;
export default StatsDetails;
