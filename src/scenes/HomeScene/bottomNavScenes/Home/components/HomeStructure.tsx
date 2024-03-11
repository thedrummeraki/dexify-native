import {MangaRequestParams} from '@app/api/mangadex/types';
import {HomeItem} from '../useHomeStructure';

export type HomeStructureProps = HomeItem & {
  params?: MangaRequestParams;
};

export default function HomeStructure({
  type,
  subtitle,
  title,
  params,
}: HomeStructureProps) {}

function WelcomeItem() {}
