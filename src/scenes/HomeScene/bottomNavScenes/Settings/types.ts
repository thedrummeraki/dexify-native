import {SettingsStackParamList} from '@app/foundation/navigation';
import {
  AppearanceSettingsStore,
  ReaderSettingsStore,
  SettingsStore,
} from '@app/foundation/state/settings';

export type SettingType = 'toggle' | 'navigatable';

export type SettingsKey = keyof SettingsStore;
export type SettingStoreType = SettingsStore[SettingsKey];

// shortcut for ToggleValueType
type TVT<T> = T[keyof T];

export type ToggleValueType =
  | TVT<AppearanceSettingsStore>
  | TVT<ReaderSettingsStore>;

export interface BaseSetting<SK extends SettingsKey> {
  title: string;
  store: SK;
  for: keyof SettingsStore[SK];
  type?: SettingType;
  subtitle?: string;
  disabled?: boolean;
}

export interface ToggleSetting<
  SK extends SettingsKey,
  V extends ToggleValueType,
> extends BaseSetting<SK> {
  type: 'toggle';
  onToggle(previousValue: V): V;
  truthCondition?(value: V): boolean;
}

export interface NavigatableSetting<SK extends SettingsKey>
  extends BaseSetting<SK> {
  type: 'navigatable';
  to: keyof SettingsStackParamList;
  screenParams?: any;
  showPreview?: boolean;
}

export function isToggle(
  setting: BaseSetting<SettingsKey>,
): setting is ToggleSetting<SettingsKey, ToggleValueType> {
  return setting.type === 'toggle';
}

export function isNavigatable(
  setting: BaseSetting<SettingsKey>,
): setting is NavigatableSetting<SettingsKey> {
  return setting.type === 'navigatable';
}
