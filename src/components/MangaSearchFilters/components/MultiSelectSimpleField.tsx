import React from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Chip, Text} from 'react-native-paper';

export interface BaseMultiSelectSimpleFieldProps<T> {
  values: T[];
  selected: T[];
  onChange(value: T[]): void;
}

type MultiSelectSimpleFieldProps<T> = BaseMultiSelectSimpleFieldProps<T> & {
  title: string;
  valueAsKey?(value: T): string;
  humanReadableValue?(value: T): string;
};

export default function MultiSelectSimpleField<T>({
  values,
  selected,
  title,
  onChange,
  valueAsKey,
  humanReadableValue,
}: MultiSelectSimpleFieldProps<T>) {
  const [selectedValues, setSelectedValues] = useState(selected);

  const onChipSelect = (value: T) => {
    setSelectedValues(existingValues => {
      let res: T[];
      let start = performance.now();

      if (existingValues.includes(value)) {
        res = existingValues.filter(existingValue => existingValue !== value);
      } else {
        res = [...existingValues, value];
      }
      let end = performance.now();

      console.log(`${end - start} ms`);

      return res;
    });
  };

  const isSelected = (value: T) => selected.includes(value);

  useEffect(() => {
    onChange(selectedValues);
  }, [onChange, selectedValues]);

  return (
    <View style={styles.root}>
      <Text variant="titleMedium">{title}</Text>
      <View style={styles.chipsContainer}>
        {values.map(value => (
          <Chip
            showSelectedOverlay
            key={valueAsKey ? valueAsKey(value) : String(value)}
            icon={isSelected(value) ? undefined : 'chevron-right'}
            selected={isSelected(value)}
            onPress={() => onChipSelect(value)}>
            {humanReadableValue ? humanReadableValue(value) : String(value)}
          </Chip>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {display: 'flex', flexDirection: 'column', gap: 16},
  chipsContainer: {flexDirection: 'row', gap: 4, flexWrap: 'wrap'},
});
