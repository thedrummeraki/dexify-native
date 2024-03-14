import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
} from 'react';
import {defaultState} from './base';
import staterino from 'staterino';
import merge from 'mergerino';
import {
  TokenInfo,
  User,
  UserStore,
  isSessionValid,
  tokenInfoFromAuthResponse,
} from './user';
import {
  FilterParamsState,
  FilterSortState,
  FiltersMiscObjects,
  defaultFiltersStore,
} from './filters';

import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {AuthResponse} from '@app/api/mangadex/types';

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
  const {set, subscribe} = useStore;

  const login = (user: User, token: TokenInfo) => {
    console.log('logging until:', token.session.validUntil);
    set({user: {user, token}});
  };
  const logout = () => {
    const emptyUserStore = {user: {user: null, token: null}};
    storeSession(emptyUserStore.user);
    set(emptyUserStore);
  };
  const userInfo = useStore(store => store.user);

  useEffect(() => {
    return subscribe(
      state => state.user,
      user => {
        if (user.user) {
          storeSession(user).catch(e =>
            console.error('Failed to store UserStore', user, '. Details:', e),
          );
        }
      },
    );
  }, [subscribe]);

  useEffect(() => {
    retrieveStoredSession().then(user => {
      if (user) {
        set({user});
      }
    });
  }, [set]);

  return {login, logout, ...userInfo};
};

export const useFiltersStore = () => {
  const {set} = useStore;

  const setParams = (params: FilterParamsState) => set({filters: {params}});
  const setOrder = (sort: FilterSortState) => set({filters: {sort}});
  const removeFilter = (key: keyof FilterParamsState) => {
    set({filters: {[key]: defaultFiltersStore.params[key]}});
  };
  const clear = () => set({filters: defaultFiltersStore});
  const setMiscObjects = useCallback(
    (objects: FiltersMiscObjects) => set({filters: {objects}}),
    [set],
  );

  const filtersInfo = useStore(store => store.filters);

  return {
    setParams,
    setOrder,
    clear,
    removeFilter,
    setMiscObjects,
    ...filtersInfo,
  };
};

export default function StaterinoProvider({children}: StaterinoProviderProps) {
  const userStore = useUserStore();

  return (
    <StaterinoContext.Provider value={{...userStore}}>
      {children}
    </StaterinoContext.Provider>
  );
}

async function storeSession(session: UserStore) {
  try {
    await EncryptedStorage.setItem('user_session', JSON.stringify(session));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function retrieveStoredSession(): Promise<UserStore | null> {
  try {
    const retrieved = await EncryptedStorage.getItem('user_session');
    if (retrieved) {
      const {token, user} = JSON.parse(retrieved);
      if (!token || !user) {
        console.log('No user stored');
        return null;
      }

      const parsedUser: User = {
        username: user.username,
      };

      const parsedToken: TokenInfo = {
        refresh: {
          value: token.refresh.value,
          validUntil: Number.parseInt(token.refresh.validUntil, 10),
        },
        session: {
          value: token.session.value,
          validUntil: Number.parseInt(token.session.validUntil, 10),
        },
      };

      if (isSessionValid(parsedToken.session)) {
        return {
          token: parsedToken,
          user: parsedUser,
        };
      }

      console.log('refreshing token...');

      const response = await axios.post<AuthResponse>(
        'https://api.mangadex.org/auth/refresh',
        {
          token: parsedToken.refresh.value,
        },
      );

      if (response.status < 300 && response.status >= 200) {
        const {data} = response;
        if (data.result === 'ok') {
          console.log('successfully refreshed token.');
          const tokenInfo = tokenInfoFromAuthResponse(data);
          return {token: tokenInfo, user: parsedUser};
        } else {
          console.warn('Could not refresh token. Details:', response);
        }
      } else {
        console.warn('Could not refresh token. HTTP code:', response.status);
      }

      return null;
    }
    return null;
  } catch (error) {
    console.warn('Could not retrieve stored user info:', error);
    return null;
  }
}
