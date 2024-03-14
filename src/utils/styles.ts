import {defaultSpacing} from '@app/foundation/theme/base';
import {StyleSheet} from 'react-native';

export function spacing(n: number): number {
  return defaultSpacing * n;
}

export const sharedStyles = StyleSheet.create({
  flex: {flex: 1},
  container: {padding: defaultSpacing * 2, gap: spacing(2)},
});
