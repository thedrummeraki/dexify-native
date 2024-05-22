import React, {useEffect, useState} from 'react';
import {useChapterStore} from './state';
import {
  AtHomeResponse,
  ScanlationGroup,
  isSuccess,
} from '@app/api/mangadex/types';
import {Caption, ProgressBar, Text} from 'react-native-paper';
import {Image, View} from 'react-native';
import {sharedStyles} from '@app/utils/styles';
import {CoverSize, findRelationship, mangaImage} from '@app/api/mangadex/utils';
import {TextBadge} from '@app/components';
import {useLazyGetRequest} from '@app/api/utils';
import UrlBuilder from '@app/api/mangadex/types/api/urlBuilder';
import {Page} from './types';

export default function Loading() {
  const {set} = useChapterStore;
  const [chapter, manga, progress] = useChapterStore(state => [
    state.chapter,
    state.manga,
    state.progress,
  ]);

  const [fetchAtHome] = useLazyGetRequest<AtHomeResponse>(
    UrlBuilder.getAtHomeServer(chapter.id),
  );
  const [pageUrls, setPageUrls] = useState<string[]>();
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    set({loading: true});
    fetchAtHome().then(res => {
      if (isSuccess(res)) {
        const constructedPageUrls = res.chapter.dataSaver.map(dataSaver => {
          return [res.baseUrl, 'data-saver', res.chapter.hash, dataSaver].join(
            '/',
          );
        });

        setPageUrls(constructedPageUrls);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set, chapter.id]);

  useEffect(() => {
    if (!pageUrls) {
      return;
    }

    pageUrls.forEach((uri, index) => {
      const number = index + 1;

      Image.getSize(uri, (width, height) => {
        const page: Page = {
          image: {width, height, uri},
          number,
          position: number,
        };
        setPages(current => [...current, page]);
      });
    });
  }, [pageUrls]);

  useEffect(() => {
    const currentProgress = pages.length / chapter.attributes.pages;
    set({pages, progress: currentProgress, loading: currentProgress < 1});
  }, [set, pages, chapter]);

  const {
    attributes: {volume},
  } = chapter;

  const chapterText =
    (chapter.attributes.chapter && `Chapter ${chapter.attributes.chapter}`) ||
    'Oneshot';

  const volumeText = volume ? `Volume ${volume}` : 'No volume';
  const group = findRelationship<ScanlationGroup>(chapter, 'scanlation_group');

  return (
    <View
      style={[sharedStyles.flex, sharedStyles.center, sharedStyles.container]}>
      <View>
        <Image
          style={[
            sharedStyles.largeFixedSizeThumbnail,
            sharedStyles.noRoundBorders,
          ]}
          source={{uri: mangaImage(manga, {size: CoverSize.Medium})}}
        />
        <ProgressBar progress={progress} />
      </View>
      <View style={[sharedStyles.titleCaptionContainer, sharedStyles.aCenter]}>
        <Text variant="titleMedium">{chapterText}</Text>
        <Caption>{volumeText}</Caption>
      </View>
      {group ? (
        <TextBadge icon="account" content={group.attributes.name} />
      ) : null}
    </View>
  );
}
