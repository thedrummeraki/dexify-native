import React, {
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useReducer,
} from 'react';
import {defaultState} from './base';
import staterino from 'staterino';
import merge from 'mergerino';
import {User} from './user';

export type StaterinoProviderProps = PropsWithChildren<{}>;

export interface State {
  user: User | null;
  login(user: User): void;
  logout(): void;
}
export const StaterinoContext = React.createContext<State>({} as State);

export const useStaterino = () => {
  return useContext(StaterinoContext);
};

const useStore = staterino({
  hooks: {useLayoutEffect, useReducer},
  merge,
  state: defaultState(),
});

const useUserStore = () => {
  const {set} = useStore;

  const login = (user: User) => set({user: {user}});
  const logout = () => set({user: {user: null}});
  const {user} = useStore(userStore => userStore.user);

  return {login, logout, user};
};

export default function StaterinoProvider({children}: StaterinoProviderProps) {
  const userStore = useUserStore();

  return (
    <StaterinoContext.Provider value={{...userStore}}>
      {children}
    </StaterinoContext.Provider>
  );
}
