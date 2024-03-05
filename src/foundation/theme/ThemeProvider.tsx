import React, {PropsWithChildren, useContext} from 'react';
import {Theme} from './types';
import {defaultTheme} from '.';

export type ThemeProviderProps = {
  theme: Theme;
} & PropsWithChildren<{}>;

export const ThemeContext = React.createContext<Theme>(defaultTheme);

export const useTheme = () => {
  const {spacing: spacingValue, ...other} = useContext(ThemeContext);
  const spacing = (base: number) => spacingValue * base;

  return {spacing, ...other};
};

export default function ThemeProvider({theme, children}: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
