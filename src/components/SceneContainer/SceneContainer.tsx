import {useDexifyNavigation} from '@app/foundation/navigation';
import {sharedStyles, spacing} from '@app/utils/styles';
import {PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Appbar, IconButton, Text, useTheme} from 'react-native-paper';

export type SceneHeaderProps = PropsWithChildren<{
  title?: string;
  onBackPress?(): void;
  onDetailsPress?(): void;
}>;

export default function SceneContainer({
  title,
  onBackPress,
  onDetailsPress,
  children,
}: SceneHeaderProps) {
  const navigation = useDexifyNavigation();
  const handleBackPress = () => {
    onBackPress?.();
    navigation.goBack();
  };

  const theme = useTheme();

  return (
    <View style={styles.root}>
      <Appbar.Header
        elevated
        theme={theme}
        style={[styles.header, {borderBottomColor: theme.colors.primary}]}>
        <View style={styles.headerLeft}>
          <IconButton icon="close" onPress={handleBackPress} />
          {title ? (
            <Text numberOfLines={1} variant="titleSmall">
              {title}
            </Text>
          ) : null}
        </View>
        <View style={styles.headerRight}>
          {onDetailsPress ? (
            <IconButton icon="information-outline" onPress={onDetailsPress} />
          ) : null}
        </View>
      </Appbar.Header>
      <ScrollView style={[styles.container]}>{children}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {display: 'flex', flex: 1},
  header: {display: 'flex', backgroundColor: 'transparent'},
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerRight: {flexShrink: 1, flexDirection: 'row-reverse'},
  container: {flex: 1},
});
