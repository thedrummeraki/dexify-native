import {Text, useTheme} from 'react-native-paper';
import {useManga} from './MangaProvider';
import {preferredMangaDescription} from '@app/api/mangadex/utils';
import {useEffect, useState} from 'react';
import TextBadge from '@app/components/TextBadge';
import {View} from 'react-native';

export interface DescriptionProps {
  numberOfLines?: number;
}

export default function Description({numberOfLines = 3}: DescriptionProps) {
  const manga = useManga();
  const theme = useTheme();

  const [shouldShowMore, setShouldShowMore] = useState(false);
  const [lines, setLines] = useState(-1);
  const [visibleNumberOfLines, setVisibleNumberOfLines] =
    useState(numberOfLines);
  const [showingMore, setShowingMore] = useState(false);

  useEffect(() => {
    if (showingMore) {
      setVisibleNumberOfLines(lines);
    } else {
      setVisibleNumberOfLines(numberOfLines);
    }
  }, [showingMore, lines, numberOfLines]);

  return (
    <View style={{justifyContent: 'center', flex: 1}}>
      <Text
        numberOfLines={visibleNumberOfLines}
        style={{color: theme.colors.outline}}
        onTextLayout={e => {
          const linesCount = e.nativeEvent.lines.length;
          setLines(linesCount);
          setShouldShowMore(linesCount > numberOfLines);
        }}>
        {preferredMangaDescription(manga)}
      </Text>
      {shouldShowMore !== null ? (
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TextBadge
            icon={showingMore ? 'minus' : 'plus'}
            content={showingMore ? 'Collapse' : 'Expand...'}
            onPress={() => {
              setShowingMore(current => !current);
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
