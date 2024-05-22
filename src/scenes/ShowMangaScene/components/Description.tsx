import React from 'react';
import {Text, useTheme} from 'react-native-paper';
import {useManga} from './MangaProvider';
import {preferredMangaDescription} from '@app/api/mangadex/utils';
import {useEffect, useRef, useState} from 'react';
import TextBadge from '@app/components/TextBadge';
import {Platform, View} from 'react-native';
import {sharedStyles, spacing} from '@app/utils/styles';

export interface DescriptionProps {
  numberOfLines?: number;
  hideExpandButton?: boolean;
}

export default function Description({
  numberOfLines = 3,
  hideExpandButton,
}: DescriptionProps) {
  const manga = useManga();
  const theme = useTheme();

  const initialized = useRef(false);

  const [shouldShowMore, setShouldShowMore] = useState(false);
  const [lines, setLines] = useState(-1);
  const [visibleNumberOfLines, setVisibleNumberOfLines] = useState<
    number | undefined
  >(Platform.OS === 'ios' ? undefined : numberOfLines); // weird hack for iOS
  const [showingMore, setShowingMore] = useState(false);

  useEffect(() => {
    if (showingMore) {
      setVisibleNumberOfLines(Platform.OS === 'ios' ? undefined : lines);
    } else {
      setVisibleNumberOfLines(numberOfLines);
    }
  }, [showingMore, lines, numberOfLines]);

  console.log({shouldShowMore, visibleNumberOfLines, lines, numberOfLines});

  return (
    <View style={[sharedStyles.flex, sharedStyles.jCenter, {gap: spacing(2)}]}>
      <Text
        numberOfLines={visibleNumberOfLines}
        style={{color: theme.colors.outline}}
        onTextLayout={e => {
          if (initialized.current) {
            return;
          }
          const linesCount = e.nativeEvent.lines.length;
          console.log('found linesCount of', linesCount);
          setVisibleNumberOfLines(numberOfLines);
          setLines(linesCount);
          setShouldShowMore(linesCount > numberOfLines);
          initialized.current = true;
        }}>
        {preferredMangaDescription(manga)}
      </Text>
      {!hideExpandButton ? (
        <View style={[sharedStyles.row, sharedStyles.jCenter]}>
          <TextBadge
            icon={showingMore ? 'minus' : 'plus'}
            content={showingMore ? 'Collapse' : 'Expand...'}
            background="surfaceDisabled"
            onPress={() => {
              setShowingMore(current => !current);
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
