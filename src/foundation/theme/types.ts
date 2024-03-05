export interface Theme {
  color: ThemeColor;
  typography: ThemeTypography;
  spacing: number;
}

export type ThemeColorHex = string;
export type ThemeColorRgb = {r: number; g: number; b: number; a?: number};
export type ThemeColorProfile = ThemeColorHex | ThemeColorRgb;

export interface ThemeColor {
  primary: ThemeColorProfile;
  accent: ThemeColorProfile;
  secondary: ThemeColorProfile;
  text: ThemeColorProfile;
  background: ThemeColorProfile;
  placeholder: ThemeColorProfile;
}

export type ThemeTypographyFontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

export interface ThemeTypographyCategory {
  fontSize: number;
  fontWeight: ThemeTypographyFontWeight;
}

export interface ThemeTypography {
  title: ThemeTypographyCategory;
  subtitle: ThemeTypographyCategory;
  smallTitle: ThemeTypographyCategory;

  text: ThemeTypographyCategory;
  description: ThemeTypographyCategory;
  note: ThemeTypographyCategory;
}
