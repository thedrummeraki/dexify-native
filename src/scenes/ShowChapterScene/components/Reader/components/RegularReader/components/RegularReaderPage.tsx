import React from 'react';
import {Page} from '@app/scenes/ShowChapterScene/components/types';
import {useDimensions} from '@app/utils';
import {Image, StyleSheet, View} from 'react-native';
import {sharedStyles} from '@app/utils/styles';

export interface RegularReaderPageProps {
  page: Page;
}

export default function RegularReaderPage({page}: RegularReaderPageProps) {
  const {width: deviceWidth, height: deviceHeight} = useDimensions();
  const {
    image: {width: imageWidth, height: imageHeight, uri},
  } = page;

  const aspectRatio = imageWidth / imageHeight;

  return (
    <View
      style={[
        sharedStyles.flex,
        sharedStyles.aCenter,
        sharedStyles.jCenter,
        {width: deviceWidth, height: deviceHeight},
      ]}>
      <Image
        style={[{width: deviceWidth, aspectRatio}, styles.image]}
        source={{uri}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
});
