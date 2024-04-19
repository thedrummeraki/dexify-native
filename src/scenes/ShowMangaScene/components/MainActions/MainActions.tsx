import AuthGuard from '@app/components/AuthGuard';
import {spacing} from '@app/utils/styles';
import {StyleSheet, View} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import {useMangaDetails} from '../MangaProvider';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {ReadingStatus} from '@app/api/mangadex/types';
import {usePostRequest} from '@app/api/utils';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';

export default function MainActions() {
  const {aggregate, aggregateLoading, manga} = useMangaDetails();
  const cannotBeRead =
    aggregateLoading ||
    aggregate.result === 'error' ||
    Object.keys(aggregate.volumes).length === 0;

  const [post, {loading: submitting}] = usePostRequest(undefined, {
    requireSession: true,
  });
  const {set} = useStore;

  const updateReadingStatus = (status: ReadingStatus) => {
    post(UrlBuilder.updateReadingStatus(manga.id), {status}).then(res => {
      set({library: {data: {statuses: {[manga.id]: status}}}});
    });
  };

  return (
    <View style={styles.root}>
      <View style={styles.minor}>
        <AuthGuard
          onPress={() => updateReadingStatus(ReadingStatus.PlanToRead)}>
          <IconButton
            disabled={submitting}
            mode="contained"
            icon="bookmark-outline"
          />
        </AuthGuard>
        {/* <IconButton */}
        {/*   mode="contained-tonal" */}
        {/*   icon="share-variant" */}
        {/* /> */}
      </View>
      <View style={styles.major}>
        <Button
          disabled={cannotBeRead}
          mode="contained"
          icon="book-open-blank-variant">
          Read now
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  minor: {
    marginLeft: spacing(-2),
    flexDirection: 'row',
    flexShrink: 1,
  },
  major: {
    flexGrow: 1,
  },
});
