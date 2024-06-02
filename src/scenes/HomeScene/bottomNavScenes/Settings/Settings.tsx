import React from 'react';
import {sharedStyles, spacing} from '@app/utils/styles';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {Text} from 'react-native-paper';
import {useSettingsPresenters} from './settings';
import SettingsSection from './components/SettingsSection';

export default function Settings() {
  const presenters = useSettingsPresenters();

  return (
    <SafeAreaView style={sharedStyles.flex}>
      <ScrollView style={[{gap: spacing(6)}]}>
        <View style={sharedStyles.container}>
          <Text variant="headlineMedium">Settings</Text>
        </View>
        {presenters.map(presenter => (
          <SettingsSection key={presenter.slug} presenter={presenter} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
