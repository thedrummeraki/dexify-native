import {useEffect} from 'react';
import {Dimensions, Platform, StatusBar} from 'react-native';

import {NativeModules} from 'react-native';

/**
 * A debounced function, for useEffect.
 *
 * @param callback The callback to debounce. MUST be memoized.
 * @param deps The dependency list.
 * @param options Customize the behaviour of this hook.
 */
export function useDebouncedEffect(
  callback: () => void,
  deps: any[],
  options?: {delay?: number},
) {
  const debounceOptions = options || {};
  const delay = debounceOptions.delay || 500;

  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);
    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, callback, delay]);
}

/**
 * A hook that returns the current screen's dimensions.
 * @param source Indicate from where to get the dimensions from (default: "window")
 * @returns An object with the relevant screen dimensions.
 */
export function useDimensions(source: 'window' | 'screen' = 'window') {
  const heightOffset = StatusBar.currentHeight || 0;
  return {...Dimensions.get(source), heightOffset};
}

export function usePlatformName() {
  switch (Platform.OS) {
    case 'ios':
      return 'iOS';
    case 'android':
      return 'Android';
    case 'windows':
      return 'Windows';
    case 'macos':
      return 'macOS';
    case 'web':
      return 'web';
  }
}

export function getDeviceLocale(): string {
  if (Platform.OS === 'ios') {
    return (
      NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]
    );
  } else if (Platform.OS === 'android') {
    return NativeModules.I18nManager.localeIdentifier;
  }

  // return en by default
  return 'en';
}

export function getDeviceMangadexFriendlyLanguage(): string {
  return getDeviceLocale().split('_')[0];
}

export function timeDifference(current: Date, previous: Date): string {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current.getTime() - previous.getTime();

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return '~' + Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return '~' + Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return '~' + Math.round(elapsed / msPerYear) + ' years ago';
  }
}

export function mergeLists<T extends {id: string}>(
  current: T[],
  newList: T[],
): T[] {
  const mergedItems = [...current, ...newList];
  const result: T[] = [];
  const addedIds: string[] = [];

  mergedItems.forEach(item => {
    if (!addedIds.includes(item.id)) {
      result.push(item);
      addedIds.push(item.id);
    }
  });

  return mergedItems;
}

export function niceMerge<T extends object>(
  current: T[],
  newList: T[],
  by: keyof T,
) {
  return [];
}

export function intersectPrimitives<
  T extends string | number | boolean | undefined | null,
>(a: T[], b: T[]): T[] {
  var setB = new Set(b);
  return [...new Set(a)].filter(x => setB.has(x));
}

export function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

export function notEmpty<T>(item: T | null | undefined): item is T {
  return !!item;
}
