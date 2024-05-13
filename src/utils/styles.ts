import {defaultSpacing} from '@app/foundation/theme/base';
import {StyleSheet} from 'react-native';

export function spacing(n: number): number {
  return defaultSpacing * n;
}

const baseStyles = StyleSheet.create({
  // structure
  flex: {flex: 1},
  container: {padding: defaultSpacing * 2, gap: spacing(2)},
  roundBorders: {borderRadius: spacing(2)},
  squareAspectRatio: {aspectRatio: 1},
  titleCaptionContainer: {gap: spacing(-1.5)},

  // font
  bold: {fontWeight: 'bold'},

  // padding
  noTopPadding: {paddingTop: 0},
  noLeftPadding: {paddingLeft: 0},
  noRightPadding: {paddingRight: 0},
  noBottomPadding: {paddingBottom: 0},
  noTopMargin: {marginTop: 0},
  noLeftMargin: {marginLeft: 0},
  noRightMargin: {marginRight: 0},
  noBottomMargin: {marginBottom: 0},
});

const customStyles = StyleSheet.create({
  tightContainer: {
    ...baseStyles.container,
    gap: spacing(1),
  },
  fixedSizeThumbnail: {
    height: 150,
    aspectRatio: 3 / 4,
    ...baseStyles.roundBorders,
  },
});

export const sharedStyles = StyleSheet.create({
  ...baseStyles,
  ...customStyles,
  mediumFixedSizeThumbnail: {
    ...customStyles.fixedSizeThumbnail,
    height: 175,
  },
  largeFixedSizeThumbnail: {
    ...customStyles.fixedSizeThumbnail,
    height: 200,
  },
});
