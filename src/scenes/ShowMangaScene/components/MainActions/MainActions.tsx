import React from 'react';
import AuthGuard from '@app/components/AuthGuard';
import {spacing} from '@app/utils/styles';
import {StyleSheet, View} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import {useMangaDetails} from '../MangaProvider';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {useDexifyNavigation} from '@app/foundation/navigation';
import {readingStatusName} from '@app/scenes/HomeScene/bottomNavScenes/Library/Library';

export default function MainActions() {
  const navigation = useDexifyNavigation();
  const [library, mdLists, user] = useStore([
    state => state.library.data,
    state => state.mdLists.data,
    state => state.user.user,
  ]);
  const {manga} = useMangaDetails();

  const readingStatus = library.statuses[manga.id];
  const addedToList = (mdLists[manga.id] || []).length > 0;

  return (
    <View style={styles.root}>
      <View style={styles.minor}>
        <AuthGuard
          onPress={() => navigation.push('ShowMangaMDListsModal', manga)}>
          {/* <IconButton
            disabled={!user}
            mode={addedToList ? 'contained' : 'outlined'}
            icon={addedToList ? 'bookmark-check' : 'bookmark-outline'}
          /> */}
          <IconButton
            disabled
            mode={addedToList ? 'contained' : 'outlined'}
            icon={addedToList ? 'cloud-download' : 'cloud-download-outline'}
          />
        </AuthGuard>
        {/* <IconButton */}
        {/*   mode="contained-tonal" */}
        {/*   icon="share-variant" */}
        {/* /> */}
      </View>
      <View style={styles.major}>
        <Button
          mode={readingStatus ? 'contained' : 'outlined'}
          icon={readingStatus ? 'check' : undefined}
          onPress={() => navigation.push('ShowMangaLibraryModal', manga)}>
          {readingStatus
            ? readingStatusName(readingStatus)
            : 'Add to library...'}
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
