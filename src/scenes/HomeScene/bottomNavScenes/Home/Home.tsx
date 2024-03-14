import React from 'react';
import {sharedStyles, spacing} from '@app/utils/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {useDimensions} from '@app/utils';
import HomeSection from './components/HomeSection';
import {useUserStore} from '@app/foundation/state/StaterinoProvider';

export default function Home() {
  const data = Array.from({length: 10}, (_, index) => index);
  const {user, logout} = useUserStore();

  const {height: windowHeight} = useDimensions();
  const {
    colors: {backdrop: backgroundColor},
  } = useTheme();

  const height = windowHeight * 0.57;
  const width = '100%';

  return (
    <SafeAreaView style={sharedStyles.flex}>
      <ScrollView>
        <View style={{height, width, backgroundColor}} />
        <HomeSection
          title="Title"
          subtitle="Subtitle!"
          data={data}
          renderItem={() => (
            <View style={[styles.skeletonItem, {backgroundColor}]} />
          )}
        />
        <HomeSection
          title="Other title"
          subtitle="Just another another subtitle here."
          data={data}
          renderItem={() => (
            <View style={[styles.skeletonItem, {backgroundColor}]} />
          )}
        />
        {user ? <Button onPress={logout}>Log out</Button> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  skeletonItem: {
    width: 100,
    aspectRatio: 3 / 4,
    borderRadius: spacing(2),
  },
});
