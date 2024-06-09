import {SettingsStackParamList} from '@app/foundation/navigation';
import {
  AppearanceSettingsStore,
  ContentSettingsStore,
  ReaderSettingsStore,
  SettingsStore,
} from '@app/foundation/state/settings';

export type SettingType = 'toggle' | 'navigatable' | 'pressable';

export type SettingsKey = keyof SettingsStore;
export type SettingStoreType = SettingsStore[SettingsKey];

// shortcut for ToggleValueType
type VT<T> = T[keyof T];
type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never;

type RawSettingValueType =
  | VT<AppearanceSettingsStore>
  | VT<ReaderSettingsStore>
  | GetElementType<VT<ContentSettingsStore>>;

export type SettingValueType = RawSettingValueType | RawSettingValueType[];

export interface BaseSetting {
  title: string;
  type?: SettingType;
  subtitle?: string;
  disabled?: boolean;
}

export interface SettingWithValue<SK extends SettingsKey> extends BaseSetting {
  store: SK;
  for: keyof SettingsStore[SK];
}

export interface ToggleSetting<
  SK extends SettingsKey,
  V extends SettingValueType,
> extends SettingWithValue<SK> {
  type: 'toggle';
  onToggle(previousValue: V): V;
  truthCondition?(value: V): boolean;
}

export interface NavigatableSetting<
  SK extends SettingsKey,
  V extends SettingValueType,
> extends SettingWithValue<SK> {
  type: 'navigatable';
  to: keyof SettingsStackParamList;
  values: Array<V>;
  multiple?: boolean;
  screenParams?: any;
  showPreview?: boolean;
  humanFriendlyPreview?(value: V): string;
}

export interface PressableSetting extends BaseSetting {
  type: 'pressable';
  icon?: string;
  onPress(): void;
}

export function isToggle(
  setting: BaseSetting,
): setting is ToggleSetting<SettingsKey, SettingValueType> {
  return setting.type === 'toggle';
}

export function isNavigatable(
  setting: BaseSetting,
): setting is NavigatableSetting<SettingsKey, SettingValueType> {
  return setting.type === 'navigatable';
}

export function isPressable(setting: BaseSetting): setting is PressableSetting {
  return setting.type === 'pressable';
}
