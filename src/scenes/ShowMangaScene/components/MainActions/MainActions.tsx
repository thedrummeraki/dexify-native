import {StyleSheet, View} from 'react-native';
import {Button, IconButton} from 'react-native-paper';

export default function MainActions() {
  return (
    <View style={styles.root}>
      <View style={styles.minor}>
        <IconButton mode="contained" icon="bookmark" />
        <IconButton mode="contained-tonal" icon="share-variant" />
      </View>
      <View style={styles.major}>
        <Button mode="contained" icon="book-open-blank-variant">
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
    display: 'none',
    flex: 1,
  },
  major: {
    flex: 1,
  },
});
