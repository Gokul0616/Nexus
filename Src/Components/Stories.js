import {FlatList, TouchableOpacity, View, Text} from 'react-native';
import DynamicImage from './DynamicImage';
import {memo} from 'react';
import {HomeScreenStyles as styles} from './Styles/Styles';
const RenderStories = ({
  stories,
  setLoadingPosts,
  isConnected,
  navigation,
  setGestureCaptured,
  gestureCaptured,
}) => {
  return (
    <View style={styles.storiesContainer}>
      <FlatList
        horizontal
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        onScroll={() => {
          navigation.setParams({swipeEnabled: false});
          if (gestureCaptured) {
            navigation.setParams({swipeEnabled: false});
          }
        }}
        data={stories}
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
        renderItem={({item}) => (
          <TouchableOpacity style={styles.storyContainer}>
            <DynamicImage
              uri={item.avatar}
              style={styles.storyAvatar}
              resizeMode="contain"
              isConnected={isConnected}
              item={item}
              setLoadingPosts={setLoadingPosts}
            />
            <Text style={styles.storyName} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.storiesContent}
      />
    </View>
  );
};
export default memo(RenderStories);
