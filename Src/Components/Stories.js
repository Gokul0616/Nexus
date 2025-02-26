import {FlatList, TouchableOpacity, View, Text} from 'react-native';
import DynamicImage from './DynamicImage';
import {memo} from 'react';
import {HomeScreenStyles as styles} from './Styles/Styles';
const RenderStories = ({stories, setLoadingPosts, isConnected}) => {
  return (
    <View style={styles.storiesContainer}>
      <FlatList
        horizontal
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        data={stories}
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
