import {useEffect} from 'react';

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
