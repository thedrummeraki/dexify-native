import {useEffect} from 'react';
import {Dimensions, Platform, StatusBar} from 'react-native';

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
