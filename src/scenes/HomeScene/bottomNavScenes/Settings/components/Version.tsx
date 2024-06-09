import React from 'react';
import {sharedStyles, spacing} from '@app/utils/styles';
import {appVersion} from '@app/utils';
import {View} from 'react-native';
import {Caption, Text} from 'react-native-paper';

export default function Version() {
  return (
    <View
      style={[
        sharedStyles.row,
        sharedStyles.aCenter,
        sharedStyles.jCenter,
        sharedStyles.container,
        {marginBottom: spacing(2)},
      ]}>
      <Text>Version:</Text>
      <Caption>{appVersion()}</Caption>
    </View>
  );
}
