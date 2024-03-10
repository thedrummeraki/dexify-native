import {useDebouncedEffect} from '@app/utils';
import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {IconButton, Searchbar} from 'react-native-paper';

interface SearchBarProps {
  query: string;
  loading: boolean;
  placeholder?: string;
  onQueryChange(query: string): void;
  onShowFilters?(): void;
}

export default function SearchBar({
  query,
  loading,
  placeholder,
  onQueryChange,
  onShowFilters,
}: SearchBarProps) {
  const [input, setInput] = useState(query);
  const trimmedInput = input.trim();

  const handleInputChange = useCallback(
    () => onQueryChange(trimmedInput),
    [onQueryChange, trimmedInput],
  );

  useDebouncedEffect(handleInputChange, [handleInputChange]);

  return (
    <View style={styles.root}>
      <Searchbar
        loading={loading}
        value={input}
        placeholder={placeholder}
        style={styles.textInput}
        onChangeText={setInput}
      />
      {onShowFilters ? (
        <IconButton icon="filter-variant" onPress={onShowFilters} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flexDirection: 'row', alignItems: 'center', padding: 8},
  textInput: {flex: 1, borderRadius: 16},
});
