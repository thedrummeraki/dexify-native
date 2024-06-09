import React from 'react';
import {sharedStyles} from '@app/utils/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image, ScrollView, View} from 'react-native';
import HomeSection from './components/HomeSection';
import {useFetchCategoryProvider} from './useFetchHome';
import {SimpleMangaThumbnail} from '@app/components';
import {useDexifyNavigation} from '@app/foundation/navigation';
import {Button, ProgressBar, Text, useTheme} from 'react-native-paper';
import {useBaseProvider} from '@app/home/providers';
import {isSuccess} from '@app/api/mangadex/types';
import ChaptersListItem from '@app/scenes/ShowMangaVolumeScene/components/ChapterListItem';
import {CategoryDisplay} from '@app/home/types';
import {
  CoverSize,
  mangaImage,
  preferredMangaTitle,
} from '@app/api/mangadex/utils';
import {SimpleMangaProvider} from '@app/scenes/ShowMangaScene/components/MangaProvider';
import {
  AuthorsArtists,
  Description,
  Publication,
} from '@app/scenes/ShowMangaScene/components';

export default function Home() {
  const navigation = useDexifyNavigation();

  const homeProvider = useBaseProvider();
  const {loading, responses} = useFetchCategoryProvider(homeProvider);

  const {
    colors: {backdrop: backgroundColor, surfaceDisabled},
  } = useTheme();

  if (loading) {
    return (
      <SafeAreaView style={sharedStyles.flex}>
        <ScrollView>
          <ProgressBar indeterminate />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={sharedStyles.flex}>
      <ScrollView style={sharedStyles.flex}>
        {/* <View
          style={[
            sharedStyles.flex,
            sharedStyles.squareAspectRatio,
            {backgroundColor},
          ]}
        /> */}
        {responses.map(({category, response}) => {
          if (category.display === CategoryDisplay.Featured) {
            const manga = isSuccess(response) ? response.data[0] : null;
            if (!manga || manga.type !== 'manga') {
              return null;
            }

            return (
              <SimpleMangaProvider key={category.slug} manga={manga}>
                <Image
                  source={{
                    uri: mangaImage(manga, {size: CoverSize.Original}),
                  }}
                  style={[sharedStyles.squareAspectRatio, {backgroundColor}]}
                />
                <View style={sharedStyles.container}>
                  <View>
                    <Text variant="titleLarge">
                      {preferredMangaTitle(manga)}
                    </Text>
                    <Description hideExpandButton />
                  </View>
                </View>
                <View style={sharedStyles.tightContainer}>
                  <AuthorsArtists />
                  <Publication />
                </View>
                <View style={sharedStyles.container}>
                  <Button
                    onPress={() => navigation.push('ShowManga', manga)}
                    mode="contained-tonal">
                    Learn more...
                  </Button>
                </View>
              </SimpleMangaProvider>
            );
          }
          return (
            <HomeSection
              vertical={category.resource === 'chapter'}
              key={category.slug}
              title={category.title}
              subtitle={category.subtitle}
              data={isSuccess(response) ? response.data : []}
              renderItem={({item}) => {
                if (
                  item?.type === 'manga' &&
                  category.display === CategoryDisplay.Collection
                ) {
                  return (
                    <SimpleMangaThumbnail
                      manga={item}
                      onPress={() => navigation.push('ShowManga', item)}
                      style={{
                        height: sharedStyles.fixedSizeThumbnail.height + 40,
                        width:
                          sharedStyles.fixedSizeThumbnail.height *
                          sharedStyles.fixedSizeThumbnail.aspectRatio,
                      }}
                      imageStyle={[
                        sharedStyles.fixedSizeThumbnail,
                        {backgroundColor: surfaceDisabled},
                      ]}
                    />
                  );
                } else if (item?.type === 'chapter') {
                  return (
                    <ChaptersListItem
                      chapterIdentifier={null}
                      chapters={[item]}
                      onPress={() => {}}
                    />
                  );
                }
                return null;
              }}
            />
          );
        })}
        {/* <HomeSection
          title="Trending now"
          data={data?.popularNow || []}
          renderItem={({item}) => (
            <SimpleMangaThumbnail
              manga={item}
              onPress={() => navigation.push('ShowManga', item)}
              style={{
                height: sharedStyles.fixedSizeThumbnail.height + 40,
                width:
                  sharedStyles.fixedSizeThumbnail.height *
                  sharedStyles.fixedSizeThumbnail.aspectRatio,
              }}
              imageStyle={sharedStyles.fixedSizeThumbnail}
            />
          )}
        />
        <HomeSection
          title="New arrivals"
          data={data?.newArrivals || []}
          renderItem={({item}) => (
            <SimpleMangaThumbnail
              manga={item}
              onPress={() => navigation.push('ShowManga', item)}
              style={{
                height: sharedStyles.fixedSizeThumbnail.height + 40,
                width:
                  sharedStyles.fixedSizeThumbnail.height *
                  sharedStyles.fixedSizeThumbnail.aspectRatio,
              }}
              imageStyle={sharedStyles.fixedSizeThumbnail}
            />
          )}
        /> */}
        {/* <HomeSection
          title="Just updated"
          data={data?.newlyAddedChapters || []}
          renderItem={() => (
            <View
              style={[sharedStyles.mediumFixedSizeThumbnail, {backgroundColor}]}
            />
          )}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
}
