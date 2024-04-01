import {spacing} from '@app/utils/styles';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1),
  },
});
