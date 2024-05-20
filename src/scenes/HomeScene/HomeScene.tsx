import {Browse} from '@app/scenes';
import React from 'react';
import {useState} from 'react';
import {BottomNavigation} from 'react-native-paper';
import {Home, Library, MDLists, Settings} from './bottomNavScenes';
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
      focusedIcon: 'view-list',
      unfocusedIcon: 'view-list-outline',
    },
    {key: 'browse', title: 'Browse...', focusedIcon: 'search-web'},
    {
      key: 'settings',
      title: 'Settings',
      focusedIcon: 'cog',
      unfocusedIcon: 'cog-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    browse: Browse,
    lists: MDLists,
    library: Library,
    settings: Settings,
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
    {
      key: 'library',
      title: 'Library',
      focusedIcon: 'bookmark',
      unfocusedIcon: 'bookmark-outline',
    },
    // {
    //   key: 'downloads',
    //   title: 'Downloads',
    //   focusedIcon: 'cloud-download',
    //   unfocusedIcon: 'cloud-download-outline',
    // },
    {
      key: 'settings',
      title: 'Settings',
      focusedIcon: 'cog',
      unfocusedIcon: 'cog-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    browse: Browse,
    // downloads: Downloads,
    library: Library,
    settings: Settings,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
