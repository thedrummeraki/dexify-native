import {StyleSheet, View} from 'react-native';
import {useManga} from './MangaProvider';
import {findRelationships} from '@app/api/mangadex/utils';
import {Artist, Author, ReadingStatus} from '@app/api/mangadex/types';
import {useTheme} from 'react-native-paper';
import {spacing} from '@app/utils/styles';
import TextBadge from '@app/components/TextBadge';
import {useDexifyNavigation} from '@app/foundation/navigation';
import ContentRatingTextBadge from '@app/components/ContentRatingTextBadge';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {readingStatusName} from '@app/scenes/HomeScene/bottomNavScenes/Library/Library';
import {useEffect, useState} from 'react';

export default function AuthorsArtists() {
  const navigation = useDexifyNavigation();
  const styles = useStyles();
  const manga = useManga();

  const artists = findRelationships<Artist>(manga, 'artist');
  const authors = findRelationships<Author>(manga, 'author');

  const artistsAndAuthors = [...authors, ...artists].filter(
    (value, index, self) => self.findIndex(v => v.id === value.id) === index,
  );

  const [readingStatus, setReadingStatus] = useState<ReadingStatus | null>(
    null,
  );

  const {subscribe} = useStore;

  useEffect(() => {
    return subscribe(
      state => state.library.data.statuses,
      statuses => {
        setReadingStatus(statuses[manga.id] || null);
      },
    );
  }, []);

  return (
    <View style={styles.root}>
      {readingStatus ? (
        <TextBadge content={readingStatusName(readingStatus)} />
      ) : null}
      <ContentRatingTextBadge type="manga" manga={manga} />
      {artistsAndAuthors.map(author => {
        const icon = author.type === 'artist' ? 'palette' : 'account';
        return (
          <TextBadge
            key={author.id}
            content={author.attributes.name}
            icon={icon}
            onPress={() => navigation.push('ShowArtist', author)}
          />
        );
      })}
    </View>
  );
}

function useStyles() {
  const theme = useTheme();

  const styles = StyleSheet.create({
    root: {
      display: 'flex',
      flexDirection: 'row',
      gap: spacing(1),
      flexWrap: 'wrap',
    },
    year: {
      color: theme.colors.outline,
    },
  });

  return styles;
}
