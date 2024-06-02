import staterino from 'staterino';
import merge from 'mergerino';
import {useLayoutEffect, useReducer} from 'react';
import {UserStore, defaultUserStore} from './user';
import {
  ChapterFiltersStore,
  FiltersStore,
  defaultChapterFiltersStore,
  defaultFiltersStore,
} from './filters';
import {
  LibraryStore,
  MDListsStore,
  defaultLibraryStore,
  defaultMDListsStore,
} from './library';
import {ReaderStore, defaultReaderStore} from './reader';
import {SettingsStore, defaultSettingsStore} from './settings';

export interface AppState {
  user: UserStore;
  filters: FiltersStore;
  chapterFilters: ChapterFiltersStore;
  reader: ReaderStore;
  library: LibraryStore;
  mdLists: MDListsStore;
  settings: SettingsStore;
}

export function defaultState(): AppState {
  return {
    user: defaultUserStore,
    filters: defaultFiltersStore,
    chapterFilters: defaultChapterFiltersStore,
    reader: defaultReaderStore,
    library: defaultLibraryStore,
    mdLists: defaultMDListsStore,
    settings: defaultSettingsStore,
  };
}

export function buildStaterino() {
  const hooks = {useLayoutEffect, useReducer};
  const state = defaultState();

  return staterino({state, hooks, merge});
}

const createStore = staterino({
  state: defaultState,
  hooks: {useLayoutEffect, useReducer},
  merge,
});

export const {get, set, subscribe} = createStore;
export const useStore = createStore;
