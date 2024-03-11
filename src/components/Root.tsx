import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FiltersScene, HomeScene} from '@app/scenes';
import {RootStackParamList} from '@app/foundation/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Root() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={HomeScene}
          options={{headerShown: false}}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'fullScreenModal'}}>
        <Stack.Screen name="Filters" component={FiltersScene} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
