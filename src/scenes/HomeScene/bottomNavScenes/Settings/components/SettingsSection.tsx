import React from 'react';
import {SettingSectionPresenter} from '../settings';
import SettingsSectionWrapper from './SettingsSectionWrapper';
import {isNavigatable, isPressable, isToggle} from '../types';

export interface SettingsSectionProps {
  presenter: SettingSectionPresenter;
}

export default function SettingsSection({presenter}: SettingsSectionProps) {
  const {settings, slug, title, disabled} = presenter;

  if (disabled) {
    return null;
  }

  return (
    <SettingsSectionWrapper title={title} key={slug}>
      {settings.map(setting => {
        if (isToggle(setting)) {
          return (
            <SettingsSectionWrapper.Toggle key={setting.title} {...setting} />
          );
        } else if (isNavigatable(setting)) {
          return (
            <SettingsSectionWrapper.Navigatable
              key={setting.title}
              screenParams={{setting}}
              {...setting}
            />
          );
        } else if (isPressable(setting)) {
          return (
            <SettingsSectionWrapper.Pressable
              key={setting.title}
              {...setting}
            />
          );
        }
        return null;
      })}
    </SettingsSectionWrapper>
  );
}
