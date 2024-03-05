import {ThemeColorProfile} from './types';

export function themeColorToString(
  themeColorProfile: ThemeColorProfile,
): string {
  if (typeof themeColorProfile === 'string') {
    return themeColorProfile;
  } else {
    const {r, g, b, a} = themeColorProfile;
    const prefix = a === undefined ? 'rgb' : 'rgba';
    const base = [r, g, b, a].filter(value => value !== undefined).join(', ');

    return `${prefix}(${base})`;
  }
}
