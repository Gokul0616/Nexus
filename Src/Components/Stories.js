import React, { memo } from "react";
import { FlatList, TouchableOpacity, View, Text, Pressable } from "react-native";
import DynamicImage from "./DynamicImage"; import AntDesign from "react-native-vector-icons/AntDesign";
import { HomeScreenStyles as styles } from "./Styles/Styles";
import { SecondaryColor, storage } from "./CommonData";


function areAllSlidesViewed(storyObj) {
  if (!storyObj || !Array.isArray(storyObj.slides)) {
    return false;
  }

  return storyObj.slides.length > 0 && storyObj.slides.every(slide => slide.viewed === true);
}



function compareStories(storyA, storyB) {
  const allViewedA = areAllSlidesViewed(storyA);
  const allViewedB = areAllSlidesViewed(storyB);
  if (allViewedA === allViewedB) {
    return 0;
  }
  return allViewedA ? 1 : -1;
}

const RenderStories = ({
  stories,
  setLoadingPosts,
  isConnected,
  navigation,
  setGestureCaptured,
  gestureCaptured,
  onPress
}) => {
  const currentUser = JSON.parse(storage.getString('profile'));


  let newStories = [...stories];


  const currentUserStoryExists = stories.some(
    story => story.id === currentUser.userId || story.userId === currentUser.userId
  );


  if (!currentUserStoryExists) {
    newStories.unshift({
      id: currentUser.userId,
      userId: currentUser.userId,
      username: currentUser.username,
      avatar: currentUser.profilePic,
      slides: [],
      isCurrentUserPlaceholder: true,
    });
  }


  const currentUserStory = newStories.find(story => story.id === currentUser.userId);
  const otherStories = newStories.filter(story => story.id !== currentUser.userId);


  const sortedOtherStories = otherStories.sort(compareStories);

  const sortedStories = currentUserStory ? [currentUserStory, ...sortedOtherStories] : sortedOtherStories;

  const renderStoryItem = ({ item }) => {
    const showPlusIcon = item.id === currentUser.userId

    return (
      <TouchableOpacity
        style={styles.storyContainer}
        onPress={() => {

          onPress(item);
        }}
      >
        <View style={styles.avatarContainer}>
          <View style={[{ borderWidth: 3, borderColor: SecondaryColor, borderRadius: 50, padding: 2 },
          (item.isCurrentUserPlaceholder && item.slides.length === 0) && { borderColor: 'transparent' },
          !item.isCurrentUserPlaceholder && areAllSlidesViewed(item) && { borderColor: "#ccc" }
          ]}>

            <DynamicImage
              uri={item.avatar}
              style={[
                styles.storyAvatar,

              ]}

              resizeMode="contain"
              isConnected={isConnected}
              item={item}
              setLoadingPosts={setLoadingPosts}
            />
          </View>
          {showPlusIcon && (
            <Pressable onPress={() => navigation.navigate("AddPosts")} style={styles.plusIconContainer}>
              <AntDesign name="pluscircle" size={20} color={SecondaryColor} /></Pressable>
          )}
        </View>
        <Text style={styles.storyName} numberOfLines={1}>
          {item.username}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.storiesContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        onScroll={() => {
          navigation.setParams({ swipeEnabled: false });
          if (gestureCaptured) {
            navigation.setParams({ swipeEnabled: false });
          }
        }}
        data={sortedStories}
        onTouchStart={() => {
          setGestureCaptured(true);
        }}
        onMomentumScrollBegin={() => {
          setGestureCaptured(true);
        }}
        onMomentumScrollEnd={() => {
          setGestureCaptured(false);
        }}
        keyExtractor={item => item.id}
        renderItem={renderStoryItem}
        contentContainerStyle={styles.storiesContent}
      />
    </View>
  );
};

export default memo(RenderStories);
