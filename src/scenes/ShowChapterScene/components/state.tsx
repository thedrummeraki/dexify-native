import React from 'react';
import {Chapter, Manga} from '@app/api/mangadex/types';
import merge from 'mergerino';
import {PropsWithChildren, useLayoutEffect, useReducer} from 'react';
import staterino from 'staterino';
import {Page} from './types';

export enum ReadingDirection {
  LeftToRight = 'ltr',
  RightToLeft = 'rtl',
}

export interface RegularOnlySettings {
  diretion: ReadingDirection;
}

export interface BaseChapterSceneStateWithOptionalMetadata {
  chapter: Chapter | null;
  manga: Manga | null;
  loading: boolean;
  progress: number;
  pages: Page[];
  page: number;
  headerShown: boolean;
  regular: RegularOnlySettings;
}

export interface CompleteChapterSceneState
  extends BaseChapterSceneStateWithOptionalMetadata {
  chapter: Chapter;
  manga: Manga;
}

export type ChapterSceneState =
  | CompleteChapterSceneState
  | BaseChapterSceneStateWithOptionalMetadata;

interface BaseProviderProps {
  chapter: Chapter;
  jumpToPage?: number;
}

export type ProviderProps = PropsWithChildren<BaseProviderProps>;

export const defaultState: ChapterSceneState = {
  chapter: null,
  manga: null,
  loading: true,
  pages: [],
  page: 1,
  headerShown: false,
  progress: 0,
  regular: {
    diretion: ReadingDirection.LeftToRight,
  },
};

export const useChapterStore = staterino({
  state: defaultState as CompleteChapterSceneState,
  hooks: {useLayoutEffect, useReducer},
  merge,
});

export function ChapterGuard({children}: PropsWithChildren<{}>) {
  // tricky TS issue here, but chapter|manga can be null, but will eventually be set.
  const [chapter, manga] = useChapterStore(state => [
    state.chapter,
    state.manga,
  ]);
  if (!chapter || !manga) {
    console.log('Waiting for chapter & manga in state...');
    return null;
  }

  return <>{children}</>;
}
