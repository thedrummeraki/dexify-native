import {ThemeColor, Theme, ThemeTypography} from './types';

export const defaultColor: ThemeColor = {
  background: {r: 0, g: 0, b: 0},
  placeholder: '',
  primary: {r: 255, g: 103, b: 64},
  accent: {r: 103, g: 64, b: 255},
  secondary: {r: 64, g: 255, b: 103},
  text: '#ffffff',
};

export const defaultTypography: ThemeTypography = {
  description: {
    fontSize: 16,
    fontWeight: '300',
  },
  note: {
    fontSize: 16,
    fontWeight: '300',
  },
  smallTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  text: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
};

export const defaultSpacing = 4;

export const defaultTheme: Theme = {
  color: defaultColor,
  typography: defaultTypography,
  spacing: defaultSpacing,
};
