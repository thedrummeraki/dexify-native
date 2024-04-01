import {StyleSheet, View} from 'react-native';
import {useManga} from './MangaProvider';
import {Text, useTheme} from 'react-native-paper';

export default function Publication() {
  const {
    attributes: {year, status},
  } = useManga();

  const theme = useTheme();

  return (
    <View style={styles.root}>
      <Text variant="bodySmall" style={{color: theme.colors.outline}}>
        {year}
      </Text>
      <Text>・</Text>
      <Text variant="bodySmall">{status.toLocaleUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
});
