import {Page} from '@app/scenes/ShowChapterScene/components/types';
import RegularReader from '..';
import {useDimensions} from '@app/utils';
import {View} from 'react-native';
import {sharedStyles} from '@app/utils/styles';

export interface RegularReaderPageProps {
  page: Page;
}

export default function RegularReaderPage({page}: RegularReaderPageProps) {
  const {width: deviceWidth, height: deviceHeight} = useDimensions();

  return (
    <View
      style={
        ([sharedStyles.flex, sharedStyles.aCenter, sharedStyles.jCenter],
        {width: deviceHeight, height: deviceHeight})
      }></View>
  );
}
