import {Browse} from '@app/scenes';
import React from 'react';
import {useState} from 'react';
import {BottomNavigation} from 'react-native-paper';
import Home from './bottomNavScenes/Home';

export default function HomeScene() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
    },
    {
      key: 'lists',
      title: 'My corner',
      focusedIcon: 'bookmark',
    },
    {key: 'browse', title: 'Browse...', focusedIcon: 'search-web'},
    {key: 'login', title: 'Login', focusedIcon: 'account-key'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    browse: Browse,
    lists: Home,
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
