import React from 'react';
import Home from '@app/scenes/Home';
import {useState} from 'react';
import {BottomNavigation} from 'react-native-paper';

export default function ButtonNavigationScene() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
    },
    {key: 'browse', title: 'Browse...', focusedIcon: 'search-web'},
    {key: 'login', title: 'Login', focusedIcon: 'account-key'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    browse: Home,
    login: Home,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
