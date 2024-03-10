import React, {useCallback, useMemo} from 'react';
import {Manga} from '@app/api/mangadex/types';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Chip, Text, TextInput, useTheme} from 'react-native-paper';
import {sharedStyles} from '@app/utils/styles';

export interface BaseMultiSelectSimpleFieldProps<T> {
  values: T[];
  included: string[];
  excluded: string[];
  onSelectionChange(included: string[], excluded: string[]): void;
}

type MultiSelectSimpleFieldProps<T> = BaseMultiSelectSimpleFieldProps<T> & {
  title: string;
  valueAsKey(value: T): string;
  humanReadableValue(value: T): string;
};

export default function TagsFields({
  values,
  included,
  excluded,
  title,
  onSelectionChange,
  valueAsKey,
  humanReadableValue,
}: MultiSelectSimpleFieldProps<Manga.Tag>) {
  const {
    colors: {onError: clearBackgroundColor, onPrimary: showMoreBackgroundColor},
  } = useTheme();

  const [includedValues, setIncludedValues] = useState(included);
  const [excludedValues, setExcludedValues] = useState(excluded);

  const [query, setQuery] = useState('');
  const [showNValues, setShowNValues] = useState(15);

  const trimmedQuery = query.trim();
  const canShowMore = showNValues < values.length;

  const isIncluded = useCallback(
    (value: Manga.Tag) => {
      const key = valueAsKey(value);
      return included.includes(key);
    },
    [included, valueAsKey],
  );

  const isExcluded = useCallback(
    (value: Manga.Tag) => {
      const key = valueAsKey(value);
      return excluded.includes(key);
    },
    [excluded, valueAsKey],
  );

  const visibleValues: Manga.Tag[] = useMemo(() => {
    let result: Manga.Tag[] = [];

    if (trimmedQuery) {
      result.push(
        ...values.filter(value =>
          humanReadableValue(value).includes(trimmedQuery),
        ),
      );
    } else if (canShowMore) {
      result.push(...values.slice(0, showNValues));
    } else {
      result.push(...values);
    }

    return result.filter(value => !isIncluded(value) && !isExcluded(value));
  }, [
    values,
    trimmedQuery,
    canShowMore,
    showNValues,
    isIncluded,
    isExcluded,
    humanReadableValue,
  ]);

  const selectedValues: Manga.Tag[] = useMemo(
    () => values.filter(value => isIncluded(value) || isExcluded(value)),
    [values, isIncluded, isExcluded],
  );

  const handleShowMore = () => {
    if (canShowMore) {
      setShowNValues(current => current + 10);
    }
  };

  const onChipSelect = (value: Manga.Tag) => {
    const key = valueAsKey(value);
    if (isIncluded(value)) {
      console.log('excluding', value);
      // then exclude
      setIncludedValues(prev => prev.filter(x => x !== key));
      setExcludedValues(prev => [...prev, key]);
    } else if (isExcluded(value)) {
      console.log('deselecting', value);
      // then deselect
      onDeselectChip(value);
    } else {
      // then include
      console.log('including', value);

      setExcludedValues(prev => prev.filter(x => x !== key));
      setIncludedValues(prev => [...prev, key]);
    }
  };

  const onDeselectChip = (value: Manga.Tag) => {
    const key = valueAsKey(value);
    setExcludedValues(prev => prev.filter(x => x !== key));
    setIncludedValues(prev => prev.filter(x => x !== key));
  };

  const icon = (value: Manga.Tag) => {
    if (isIncluded(value)) {
      return 'plus';
    } else if (isExcluded(value)) {
      return 'minus';
    } else {
      return 'chevron-right';
    }
  };

  useEffect(() => {
    onSelectionChange(includedValues, excludedValues);
  }, [onSelectionChange, includedValues, excludedValues]);

  return (
    <View style={styles.root}>
      <Text variant="titleMedium">{title}</Text>
      <View style={styles.searchContainer}>
        <TextInput
          dense
          mode="outlined"
          placeholder="Search for tags..."
          value={query}
          onChangeText={setQuery}
          style={sharedStyles.flex}
        />
        <Button
          compact
          disabled={query.trim().length === 0}
          onPress={() => setQuery('')}>
          Clear
        </Button>
      </View>
      {selectedValues.length > 0 ? (
        <View style={styles.chipsContainer}>
          {selectedValues.map(value => (
            <Chip
              showSelectedOverlay
              key={valueAsKey ? valueAsKey(value) : String(value)}
              icon={icon(value)}
              selected={isIncluded(value) || isExcluded(value)}
              onPress={() => onChipSelect(value)}
              onLongPress={() => onDeselectChip(value)}>
              {humanReadableValue ? humanReadableValue(value) : String(value)}
            </Chip>
          ))}
          <Chip
            icon="close"
            style={{backgroundColor: clearBackgroundColor}}
            onPress={() => {
              setIncludedValues([]);
              setExcludedValues([]);
            }}>
            Clear
          </Chip>
        </View>
      ) : null}
      <View style={styles.chipsContainer}>
        {visibleValues.map(value => (
          <Chip
            showSelectedOverlay
            key={valueAsKey ? valueAsKey(value) : String(value)}
            icon={icon(value)}
            onPress={() => onChipSelect(value)}>
            {humanReadableValue ? humanReadableValue(value) : String(value)}
          </Chip>
        ))}
        {canShowMore ? (
          <Chip
            style={{backgroundColor: showMoreBackgroundColor}}
            onPress={handleShowMore}>
            Show more...
          </Chip>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {display: 'flex', flexDirection: 'column', gap: 16},
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipsContainer: {flexDirection: 'row', gap: 4, flexWrap: 'wrap'},
});
