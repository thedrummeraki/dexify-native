import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {Banner, Text} from 'react-native-paper';

export default function Downloads() {
  return (
    <SafeAreaView>
      <ScrollView>
        <Banner visible>
          <Text variant="bodyMedium">
            Downloads will be coming to your device... very soon!
          </Text>
        </Banner>
      </ScrollView>
    </SafeAreaView>
  );
}
