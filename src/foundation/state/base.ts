import staterino from 'staterino';
import merge from 'mergerino';
import {useLayoutEffect, useReducer} from 'react';
import {UserStore, defaultUserStore} from './user';
import {FiltersStore, defaultFiltersStore} from './filters';

export interface AppState {
  user: UserStore;
  filters: FiltersStore;
}

export function defaultState(): AppState {
  return {
    user: defaultUserStore,
    filters: defaultFiltersStore,
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
