import React from 'react';
import {PropsWithChildren} from 'react';

type SessionProviderProps = PropsWithChildren<{}>;

/**
 * A simple provider which ensures that session is up to date.
 */
export default function SessionProvider({children}: SessionProviderProps) {
  return <>{children}</>;
}
