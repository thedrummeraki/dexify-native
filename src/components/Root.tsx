import {useStaterino} from '@app/foundation/state/StaterinoProvider';
import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {Button, Text} from 'react-native-paper';

export function Root() {
  const {user, login, logout} = useStaterino();

  return (
    <SafeAreaView>
      <View>
        <Text>Hello, {user?.username ?? 'guest'}</Text>
        <Button
          mode="contained"
          icon="camera"
          onPress={() => {
            if (user) {
              logout();
            } else {
              login({id: '1', username: 'username'});
            }
          }}>
          {user ? 'Logout' : 'Login'}
        </Button>
      </View>
    </SafeAreaView>
  );
}
