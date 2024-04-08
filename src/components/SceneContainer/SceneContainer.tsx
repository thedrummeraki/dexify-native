import { useDexifyNavigation } from '@app/foundation/navigation';
import { sharedStyles, spacing } from '@app/utils/styles';
import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, IconButton, Text, useTheme } from 'react-native-paper';

export interface SceneContainerHeaderProps {
  title?: string;
  onBackPress?(): void;
  onDetailsPress?(): void;
}

export type SceneContainerProps = PropsWithChildren<
  SceneContainerHeaderProps & { canScroll?: boolean }
>;

export default function SceneContainer({
  children,
  canScroll,
  ...headerProps
}: SceneContainerProps) {
  const ContainerComponent = canScroll ? ScrollView : View;

  return (
    <View style={styles.root}>
      <Header {...headerProps} />
      <ContainerComponent style={[styles.container]}>
        {children}
      </ContainerComponent>
    </View>
  );
}

function Header({
  title,
  onBackPress,
  onDetailsPress,
}: Omit<SceneContainerProps, 'children'>) {
  const navigation = useDexifyNavigation();
  const handleBackPress = () => {
    onBackPress?.();
    navigation.goBack();
  };

  const theme = useTheme();
  return (
    <Appbar.Header
      elevated
      theme={theme}
      style={[styles.header, { borderBottomColor: theme.colors.primary }]}>
      <View style={styles.headerLeft}>
        <IconButton icon="close" onPress={handleBackPress} />
        {title ? (
          <Text numberOfLines={1} variant="titleMedium">
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
  );
}

const styles = StyleSheet.create({
  root: { display: 'flex', flex: 1 },
  header: { display: 'flex', backgroundColor: 'transparent' },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerRight: { flexShrink: 1, flexDirection: 'row-reverse' },
  container: { flex: 1 },
});
