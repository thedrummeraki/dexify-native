import {CustomList} from '@app/api/mangadex/types';
import {useShowCustomListRoute} from '@app/foundation/navigation';
import CustomListSceneDetails from './CustomListSceneDetails';
import {useState} from 'react';

export default function CustomListScene() {
  const route = useShowCustomListRoute();
  const maybeCustomList = route.params;

  const [customList, setCustomList] = useState(() => {
    if (maybeCustomList.attributes) {
      return maybeCustomList as CustomList;
    }
    return null;
  });

  if (customList) {
    return <CustomListSceneDetails customList={customList} />;
  }

  return null;
}
