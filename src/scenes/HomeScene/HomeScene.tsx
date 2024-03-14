import {Browse} from '@app/scenes';
import React from 'react';
import {useState} from 'react';
import {BottomNavigation} from 'react-native-paper';
import {Home, Library, Login, MDLists} from './bottomNavScenes';
import {useUserStore} from '@app/foundation/state/StaterinoProvider';

export default function HomeScene() {
  const {user} = useUserStore();

  if (user) {
    return <AuthenticatedBottomNavigation />;
  } else {
    return <UnauthenticatedBottomNavigation />;
  }
}

function AuthenticatedBottomNavigation() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
    },
    {
      key: 'library',
      title: 'Library',
      focusedIcon: 'bookmark',
      unfocusedIcon: 'bookmark-outline',
    },
    {
      key: 'lists',
      title: 'Lists',
      focusedIcon: 'bookmark',
      unfocusedIcon: 'bookmark-outline',
    },
    {key: 'browse', title: 'Browse...', focusedIcon: 'search-web'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    browse: Browse,
    lists: MDLists,
    library: Library,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}

function UnauthenticatedBottomNavigation() {
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
    browse: Browse,
    login: Login,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
