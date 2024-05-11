import FlagProvider, {useUnleashContext} from '@unleash/proxy-client-react';
import EncryptedStorage from 'react-native-encrypted-storage';
import React, {PropsWithChildren, useEffect} from 'react';
import {useStore} from '@app/foundation/state/StaterinoProvider';

export default function UnleashProvider({children}: PropsWithChildren<{}>) {
  const user = useStore(state => state.user.user);

  const context = user ? {userId: user.username} : {};

  const config = {
    url: 'https://unleash-vgj39.ondigitalocean.app/api/frontend',
    clientKey:
      'default:development.9d910a7d8ac7ab47ac016def4ec64138d4406e1cd4b535136721b27a',
    refreshInterval: 15,
    appName: 'dexify',
    storageProvider: {
      save: (name: string, data: object) =>
        EncryptedStorage.setItem(name, JSON.stringify(data)),
      get: async (name: string) => {
        const data = await EncryptedStorage.getItem(name);
        return data ? JSON.parse(data) : undefined;
      },
    },
    context,
  };

  return (
    <FlagProvider config={config}>
      <UserWatchProvider>{children}</UserWatchProvider>
    </FlagProvider>
  );
}

function UserWatchProvider({children}: PropsWithChildren<{}>) {
  const {subscribe} = useStore;
  const updateContext = useUnleashContext();

  useEffect(() => {
    return subscribe(
      state => state.user.user?.username,
      username => {
        updateContext({userId: username});
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
