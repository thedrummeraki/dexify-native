import React, {PropsWithChildren} from 'react';
import {sharedStyles, spacing} from '@app/utils/styles';
import {StyleSheet, View} from 'react-native';
import {List, Switch, Text, TouchableRipple} from 'react-native-paper';
import {
  RootStackParamList,
  useDexifySettingsNavigation,
} from '@app/foundation/navigation';
import {AppState} from '@app/foundation/state/base';
import {
  NavigatableSetting,
  PressableSetting,
  SettingsKey,
  ToggleSetting,
  SettingValueType,
} from '../types';
import {useStore} from '@app/foundation/state/StaterinoProvider';
import {useSettingValue} from '../settings';

export type ItemType = 'navigatable' | 'toggle';

interface BaseItemProps {
  label: string;
  type?: ItemType;
}

interface NavigatableItemProp extends BaseItemProps {
  type: 'navigatable';
  to: keyof RootStackParamList;
}

interface ToggleItemProp extends BaseItemProps {
  type: 'toggle';
  onPress<Key extends keyof AppState, Value extends AppState[Key]>(
    value: Value,
  ): void;
}

export type ItemProps = NavigatableItemProp | ToggleItemProp;

export type ItemWrapperProps = PropsWithChildren<{
  first?: boolean;
  last?: boolean;
  onPress?(): void;
}> &
  Partial<
    Pick<
      NavigatableSetting<SettingsKey, SettingValueType>,
      'to' | 'screenParams'
    >
  >;

function useStyles() {
  const styles = StyleSheet.create({
    wrapper: {},
    first: {
      borderTopLeftRadius: spacing(2),
      borderTopRightRadius: spacing(2),
    },
    last: {
      borderBottomLeftRadius: spacing(2),
      borderBottomRightRadius: spacing(2),
    },
    root: {
      padding: spacing(3),
      justifyContent: 'space-between',
    },
  });

  return styles;
}

export function Navigatable({
  ...setting
}: NavigatableSetting<SettingsKey, SettingValueType>) {
  const styles = useStyles();
  const {title, showPreview} = setting;

  const [currentValue] = useSettingValue(setting);
  const valueText = setting.humanFriendlyPreview
    ? setting.humanFriendlyPreview(currentValue)
    : String(currentValue);

  return (
    <View style={[styles.root, sharedStyles.row, sharedStyles.aCenter]}>
      <Text variant="bodyLarge">{title}</Text>
      <View style={[sharedStyles.row, sharedStyles.aCenter]}>
        {showPreview ? <Text>{valueText}</Text> : null}
        <List.Icon icon="chevron-right" />
      </View>
    </View>
  );
}

export function PressableItem({...setting}: PressableSetting) {
  const styles = useStyles();
  const {title, icon} = setting;

  return (
    <View style={[styles.root, sharedStyles.row, sharedStyles.aCenter]}>
      <Text variant="bodyLarge">{title}</Text>
      <View style={[sharedStyles.row, sharedStyles.aCenter]}>
        {icon ? <List.Icon icon={icon} /> : null}
      </View>
    </View>
  );
}

export function Toggle({
  ...setting
}: ToggleSetting<SettingsKey, SettingValueType>) {
  const {set, get} = useStore;
  const styles = useStyles();
  const {title} = setting;

  const [currentValue] = useSettingValue(setting);

  const switchValue = setting.truthCondition
    ? setting.truthCondition(currentValue as SettingValueType)
    : Boolean(currentValue);

  return (
    <View style={[styles.root, sharedStyles.row, sharedStyles.aCenter]}>
      <Text variant="bodyLarge">{title}</Text>
      <Switch
        value={switchValue}
        onValueChange={() => {
          const {
            settings: {
              [setting.store]: {[setting.for]: previousValue},
            },
          } = get();
          const value = setting.onToggle(previousValue as SettingValueType);
          set({settings: {[setting.store]: {[setting.for]: value}}});
        }}
      />
    </View>
  );
}

export function ItemWrapper({
  children,
  first,
  last,
  to,
  screenParams,
  onPress,
}: ItemWrapperProps) {
  const styles = useStyles();
  const navigation = useDexifySettingsNavigation();

  const handlePress = onPress
    ? onPress
    : to
    ? () => navigation.push(to, screenParams)
    : undefined;

  return (
    <TouchableRipple
      borderless
      style={[first && styles.first, last && styles.last]}
      onPress={handlePress}>
      <View
        style={[styles.wrapper, first && styles.first, last && styles.last]}>
        {children}
      </View>
    </TouchableRipple>
  );
}
