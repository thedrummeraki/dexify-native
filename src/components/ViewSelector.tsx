import {useEffect, useState} from 'react';
import {IconButton, IconButtonProps} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

export type ViewSelectorOption<T> = {
  value: T;
} & Pick<IconButtonProps, 'icon'>;

export interface ViewSelectorProps<T> {
  options: ViewSelectorOption<T>[];
  value: T;
  onValueChange(value: T): void;
  checkValueEqs?(one: T, two: T): boolean;
  keyExtractor?(value: T): string;
}

export default function ViewSelector<T>({
  options,
  value,
  onValueChange,
  checkValueEqs,
  keyExtractor,
}: ViewSelectorProps<T>) {
  const [currentValue, setCurrentValue] = useState<T>(value);

  useEffect(() => {
    onValueChange(currentValue);
  }, [onValueChange, currentValue]);

  return (
    <View style={styles.root}>
      {options.map(option => {
        const isSelected = checkValueEqs
          ? checkValueEqs(option.value, currentValue)
          : option.value === currentValue;
        const mode = isSelected ? 'outlined' : undefined;
        const key = keyExtractor?.(option.value) || String(option.value);

        return (
          <IconButton
            key={key}
            mode={mode}
            selected={isSelected}
            onPress={() => setCurrentValue(option.value)}
            {...option}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flexShrink: 1,
  },
});
