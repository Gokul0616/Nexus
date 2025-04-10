import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../Services/api/apiInterceptor';
import { useDebounce } from '../Services/Hooks/useDebounce';
import { formatNumber, storage } from './CommonData';

const VideoCard = ({ item, handleProfileNavigate, cardWidth, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handlePressOfProfile = item => {
    const profileString = storage.getString('profile');
    const profile = JSON.parse(profileString);
    if (profile.username === item.username) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('OtherProfileScreen', { username: item.username });
    }
  };
  return (
    <TouchableOpacity
      onPress={() => handleProfileNavigate(item)}
      style={[styles.cardContainer, { width: cardWidth }]}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
        onLoadStart={() => {
          setLoading(true);
          setError(false);
        }}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />

      {error && (
        <View style={styles.errorContainer} pointerEvents="none">
          <Ionicons name="image-outline" size={30} color="#bbb" />
          <Text style={styles.errorText}>Failed to load image</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={e => {
          e.stopPropagation();
          handlePressOfProfile(item);
        }}
        style={styles.profilePicContainer}>
        <Image source={item.profilePic ? { uri: item.profilePic } : require("../../assets/images/emptyAvatar.png")} style={styles.profilePic} />
      </TouchableOpacity>

      <View style={styles.overlayContainer} />

      <View style={styles.infoContainer}>
        <Text style={styles.title}>@{item.username}</Text>
        <Text style={styles.caption} numberOfLines={2} ellipsizeMode="tail">
          {item.caption}
        </Text>
        <View style={styles.metricContainer}>
          <Text style={styles.metric}>
            {formatNumber(item.likes)}{' '}
            <FontAwesome
              name={item.likedByCurrentUser ? 'heart' : 'heart-o'}
              size={12}
              color={item.likedByCurrentUser ? '#ed4956' : '#fff'}
            />
          </Text>
          <Text style={styles.metric}>
            {formatNumber(item.comments)}{' '}
            <FontAwesome name="comment-o" size={12} color="#fff" />
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const VideosSearchResults = React.forwardRef(
  ({ searchVal, loading, setLoading }, ref) => {
    const [videos, setVideos] = useState([]);
    const navigation = useNavigation();
    const { width: deviceWidth } = useWindowDimensions();

    const cardMinWidth = 175;
    const numColumns =
      deviceWidth < 370 ? 2 : Math.floor(deviceWidth / cardMinWidth) || 1;
    const margin = deviceWidth * 0.025;
    const cardWidth = (deviceWidth - margin * (numColumns * 2)) / numColumns;
    const debouncedSearchVal = useDebounce(searchVal, 500);

    const fetchVideos = async () => {
      if (searchVal.length === 0) return;
      try {
        setLoading(true);
        const response = await apiClient.get(
          `/search?query=${debouncedSearchVal}&type=videos`,
        );
        setVideos(response.data);
      } catch (err) {
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };


    useEffect(() => {
      debouncedSearchVal.length === 0 ? setVideos([]) : fetchVideos();
    }, [debouncedSearchVal]);

    useImperativeHandle(ref, () => ({
      refresh: () => {
        fetchVideos();
      },
    }));

    const handleProfileNavigate = item => {
      navigation.navigate('VideoDetail', { videoId: item.videoId });
    };

    return (
      <>
        {videos.length > 0 && (
          <FlatList
            data={videos}
            numColumns={numColumns}
            nestedScrollEnabled={true}
            scrollEnabled={false}
            key={numColumns}
            renderItem={({ item }) => (
              <View style={{ margin: margin }}>
                <VideoCard
                  item={item}
                  handleProfileNavigate={handleProfileNavigate}
                  cardWidth={cardWidth}
                  navigation={navigation}
                />
              </View>
            )}
            contentContainerStyle={{ paddingVertical: 20 }}
            keyExtractor={item => item.id}
          />
        )}
        {videos.length === 0 && debouncedSearchVal.length > 0 && (
          <View
            style={{
              paddingVertical: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>
              Sorry, No videos were found for "
              <Text style={{ fontWeight: 'bold' }}>{debouncedSearchVal}</Text>".
            </Text>
          </View>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#ccc',
    height: 250,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  profilePicContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10, // ensure this container is on top of the thumbnail
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20, backgroundColor: '#ccc',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 8,
    zIndex: 5,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  caption: {
    fontSize: 12,
    color: '#fff',
  },
  metricContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    gap: 20,
    marginTop: 4,
  },
  metric: {
    fontSize: 12,
    color: '#fff',
  },
  overlayContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    position: 'absolute',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  errorText: {
    color: 'red',
    fontSize: 10,
  },
});

export default VideosSearchResults;
