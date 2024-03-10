import React, {
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useReducer,
} from 'react';
import {defaultState} from './base';
import staterino from 'staterino';
import merge from 'mergerino';
import {TokenInfo, User} from './user';

export type StaterinoProviderProps = PropsWithChildren<{}>;

export interface State {
  user: User | null;
  token: TokenInfo | null;
  login(user: User, token: TokenInfo): void;
  logout(): void;
}
export const StaterinoContext = React.createContext<State>({} as State);

export const useStaterino = () => {
  return useContext(StaterinoContext);
};

export const useStore = staterino({
  hooks: {useLayoutEffect, useReducer},
  merge,
  state: defaultState(),
});

export const useUserStore = () => {
  const {set} = useStore;

  const login = (user: User, token: TokenInfo) => set({user: {user, token}});
  const logout = () => set({user: {user: null, token: null}});
  const userInfo = useStore(userStore => userStore.user);

  return {login, logout, ...userInfo};
};

export default function StaterinoProvider({children}: StaterinoProviderProps) {
  const userStore = useUserStore();

  return (
    <StaterinoContext.Provider value={{...userStore}}>
      {children}
    </StaterinoContext.Provider>
  );
}
