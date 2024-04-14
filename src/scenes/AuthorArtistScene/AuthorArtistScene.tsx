import {Author} from '@app/api/mangadex/types';
import {MangaSearchCollection, SceneContainer} from '@app/components';
import {useShowArtistRoute} from '@app/foundation/navigation';

export default function AuthorArtistScene() {
  const route = useShowArtistRoute();

  if (route.params.attributes) {
    const author = route.params as Author;
    return (
      <SceneContainer title={author.attributes.name}>
        <MangaSearchCollection
          useFilters
          hidePreview
          searchBarPlaceholder="Find manga by author..."
          override={{authors: [author.id]}}
        />
      </SceneContainer>
    );
  }

  return <SceneContainer title="ArtAuth"></SceneContainer>;
}
