import {useStore} from '@app/foundation/state/StaterinoProvider';
import {isSessionValid} from '@app/foundation/state/user';
import {PropsWithChildren, useCallback} from 'react';
import {TouchableOpacity} from 'react-native';

interface BaseAuthGuardProps {
  hideUnlessLoggedIn?: boolean;
  onPress?(): void;
  onLongPress?(): void;
}

export type AuthGuardProps = PropsWithChildren<BaseAuthGuardProps>;

export default function AuthGuard({
  hideUnlessLoggedIn,
  onPress,
  onLongPress,
  children,
}: AuthGuardProps) {
  const {get} = useStore;
  const {user} = get();

  const isLoggedIn = Boolean(
    user.token && user.user && isSessionValid(user.token.refresh),
  );

  const handleLogInNow = () => {
    console.log('Not logged in.');
  };

  const handleOnPress = useCallback(() => {
    if (isLoggedIn) {
      onPress?.();
    } else {
      handleLogInNow();
    }
  }, [onPress, isLoggedIn]);

  if (hideUnlessLoggedIn && !isLoggedIn) {
    return null;
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handleOnPress}>
      {children}
    </TouchableOpacity>
  );
}
