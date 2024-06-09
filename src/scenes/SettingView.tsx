import React from 'react';
import {useSettingShowRoute} from '@app/foundation/navigation';
import {Caption} from 'react-native-paper';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {sharedStyles} from '@app/utils/styles';
import SettingsSectionWrapper from './HomeScene/bottomNavScenes/Settings/components/SettingsSectionWrapper';
import {useSettingValue} from './HomeScene/bottomNavScenes/Settings/settings';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {intersectPrimitives} from '@app/utils';

export default function SettingView() {
  const {
    params: {setting},
  } = useSettingShowRoute();

  const {set, get} = useStore;
  const {values, subtitle, multiple, humanFriendlyPreview} = setting;
  const [_, isEnabled] = useSettingValue(setting);

  return (
    <SafeAreaView style={sharedStyles.flex}>
      <ScrollView>
        <View style={sharedStyles.container}>
          {subtitle ? <Caption>{subtitle}</Caption> : null}
        </View>
        <SettingsSectionWrapper>
          {values.map(value => (
            <SettingsSectionWrapper.Pressable
              key={String(value)}
              icon={isEnabled(value) ? 'check' : undefined}
              onPress={() => {
                if (multiple) {
                  console.log('multiple');
                  const {
                    settings: {
                      [setting.store]: {[setting.for]: currentValue},
                    },
                  } = get();
                  // if (!Array.isArray(currentValue)) {
                  //   return;
                  // }

                  const newValue = !Array.isArray(currentValue)
                    ? [value]
                    : currentValue.includes(value)
                    ? currentValue.filter(x => x !== value)
                    : [...currentValue, value];

                  console.log({currentValue, newValue});

                  set({
                    settings: {
                      [setting.store]: {
                        [setting.for]: intersectPrimitives(
                          newValue,
                          setting.values,
                        ),
                      },
                    },
                  });
                } else {
                  set({settings: {[setting.store]: {[setting.for]: value}}});
                }
              }}
              title={
                humanFriendlyPreview
                  ? humanFriendlyPreview(value)
                  : String(value)
              }
              type="pressable"
            />
          ))}
        </SettingsSectionWrapper>
      </ScrollView>
    </SafeAreaView>
  );
}
