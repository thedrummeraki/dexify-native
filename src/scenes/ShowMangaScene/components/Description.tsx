import {Text, useTheme} from 'react-native-paper';
import {useManga} from './MangaProvider';
import {preferredMangaDescription} from '@app/api/mangadex/utils';
import {useEffect, useState} from 'react';
import TextBadge from '@app/components/TextBadge';
import {Platform, View} from 'react-native';
import {spacing} from '@app/utils/styles';

export interface DescriptionProps {
  numberOfLines?: number;
}

export default function Description({numberOfLines = 3}: DescriptionProps) {
  const manga = useManga();
  const theme = useTheme();

  const [shouldShowMore, setShouldShowMore] = useState(false);
  const [lines, setLines] = useState(-1);
  const [visibleNumberOfLines, setVisibleNumberOfLines] = useState<
    number | undefined
  >(Platform.OS === 'ios' ? undefined : numberOfLines); // weird hack for iOS
  console.log({visibleNumberOfLines});
  const [showingMore, setShowingMore] = useState(false);

  useEffect(() => {
    if (showingMore) {
      setVisibleNumberOfLines(undefined);
    } else {
      setVisibleNumberOfLines(numberOfLines);
    }
  }, [showingMore, lines, numberOfLines]);

  return (
    <View style={{justifyContent: 'center', flex: 1, gap: spacing(2)}}>
      <Text
        numberOfLines={visibleNumberOfLines}
        style={{color: theme.colors.outline}}
        onTextLayout={e => {
          const linesCount = e.nativeEvent.lines.length;
          console.log({linesCount, lines: e.nativeEvent.lines});
          setVisibleNumberOfLines(numberOfLines);
          setLines(linesCount);
          setShouldShowMore(linesCount > numberOfLines);
        }}>
        {preferredMangaDescription(manga)}
      </Text>
      {shouldShowMore !== null && lines > numberOfLines ? (
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
