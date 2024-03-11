export enum HomeItemType {
  WelcomeItem,
  FeaturedItem,
  HistoryItem,

  FeaturedList,
  RegularList,
}

export interface HomeItem {
  type: HomeItemType;
  title?: string;
  subtitle?: string;
}

function useUnauthenticatedHomeStructure(): HomeItem[] {
  return [
    {
      type: HomeItemType.FeaturedItem,
    },
    {
      type: HomeItemType.RegularList,
      title: 'Recently added',
    },
    {
      type: HomeItemType.RegularList,
      title: 'New chapters',
    },
    {
      type: HomeItemType.FeaturedList,
      title: 'Airing this season',
    },
    {
      type: HomeItemType.RegularList,
      title: 'Most popular titles',
    },
  ];
}

export function useHomeStructure(): HomeItem[] {
  return useUnauthenticatedHomeStructure();
}
