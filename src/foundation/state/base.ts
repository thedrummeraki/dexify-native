import staterino from 'staterino';
import merge from 'mergerino';
import {useLayoutEffect, useReducer} from 'react';
import {UserStore, defaultUserStore} from './user';

export interface AppState {
  user: UserStore;
}

export function defaultState(): AppState {
  return {
    user: defaultUserStore,
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
