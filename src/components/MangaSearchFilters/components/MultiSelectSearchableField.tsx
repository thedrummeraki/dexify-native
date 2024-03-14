import {useDebouncedEffect} from '@app/utils';
import {sharedStyles} from '@app/utils/styles';
import React from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Chip, Text, TextInput} from 'react-native-paper';

export interface BaseMultiSelectSearchableFieldProps<T> {
  /** Timeout for searching */
  searchDebounce?: number;

  placeholder?: string;

  /** Possible values to select from */
  values: T[];

  /** Selected values */
  selected: string[];
  onSearch(query: string): void;
  onChange(value: string[]): void;
}

type MultiSelectSearchableFieldProps<T> =
  BaseMultiSelectSearchableFieldProps<T> & {
    title: string;
    valueAsKey(value: T): string;
    humanReadableValue?(value: T): string;
  };

export default function MultiSelectSearchableField<T>({
  searchDebounce,
  placeholder,
  values,
  selected,
  title,
  onSearch,
  onChange,
  valueAsKey,
  humanReadableValue,
}: MultiSelectSearchableFieldProps<T>) {
  const [selectedValues, setSelectedValues] = useState(selected);
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();
  const [search, setSearch] = useState('');

  const onChipSelect = (value: T) => {
    setSelectedValues(existingValues => {
      let res: string[];
      let key = valueAsKey(value);

      if (existingValues.includes(key)) {
        res = existingValues.filter(existingValue => existingValue !== value);
      } else {
        res = [...existingValues, key];
      }

      return res;
    });
  };

  const isSelected = (value: T) => selected.includes(valueAsKey(value));

  useEffect(() => {
    onChange(selectedValues);
  }, [onChange, selectedValues]);

  useDebouncedEffect(
    () => {
      setSearch(trimmedQuery);
    },
    [trimmedQuery],
    {delay: searchDebounce},
  );

  useEffect(() => {
    onSearch(search);
  }, [onSearch, search]);

  return (
    <View style={styles.root}>
      <Text variant="titleMedium">{title}</Text>
      <TextInput
        dense
        mode="outlined"
        placeholder={placeholder}
        value={query}
        onChangeText={setQuery}
        style={sharedStyles.flex}
      />
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
