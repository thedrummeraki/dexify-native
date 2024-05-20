import React from 'react';
import {sharedStyles} from '@app/utils/styles';
import {SafeAreaView, View} from 'react-native';
import {Banner, Text} from 'react-native-paper';

export default function Settings() {
  return (
    <SafeAreaView>
      <View style={sharedStyles.container}>
        <Text variant="titleLarge">Settings</Text>
        <Banner visible>
          The ability to edit this app's settings will be coming to your amazing
          device soon!
        </Banner>
      </View>
    </SafeAreaView>
  );
}
