import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import apiClient from '../Services/api/apiInterceptor';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {formatNumber} from './CommonData';
import CustomLoadingIndicator from './CustomLoadingIndicator';
import {useDebounce} from '../Services/Hooks/useDebounce';

const VideoCard = ({item, handleProfileNavigate, cardWidth}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => handleProfileNavigate(item)}
      style={[styles.cardContainer, {width: cardWidth}]}>
      <Image source={{uri: item.profilePic}} style={styles.profilePic} />
      <Image
        source={{uri: item.thumbnail}}
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
        <View style={styles.errorContainer}>
          <Ionicons name="image-outline" size={30} color="#bbb" />
          <Text style={styles.errorText}>Failed to load image</Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <View style={{alignSelf: 'flex-end'}}>
          <Text style={styles.title}>@{item.username}</Text>

          <Text style={styles.caption} numberOfLines={2} ellipsizeMode="tail">
            {item.caption}
          </Text>
          <View style={{flexDirection: 'row', gap: 20}}>
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
      </View>
    </TouchableOpacity>
  );
};

const VideosSearchResults = ({searchVal}) => {
  const [videos, setVideos] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {width: deviceWidth} = useWindowDimensions();

  const cardMinWidth = 175;

  const numColumns =
    deviceWidth < 370 ? 2 : Math.floor(deviceWidth / cardMinWidth) || 1;

  const margin = deviceWidth * 0.025;

  const cardWidth = (deviceWidth - margin * (numColumns * 2)) / numColumns;

  const debouncedSearchVal = useDebounce(searchVal, 500);

  useEffect(() => {
    if (debouncedSearchVal.length === 0) {
      return;
    }

    fetchVideos();
  }, [debouncedSearchVal]);
  async function fetchVideos() {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/search?query=${debouncedSearchVal}&type=videos`,
      );
      setVideos(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleProfileNavigate = item => {
    navigation.navigate('VideoDetail', {videoId: item.videoId});
  };

  return (
    <>
      {loading && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',

            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5000,
            width: '100%',
          }}>
          <CustomLoadingIndicator />
        </View>
      )}
      <FlatList
        data={videos}
        numColumns={numColumns}
        key={numColumns}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              fetchVideos();
            }}
          />
        }
        renderItem={({item}) => (
          <View style={{margin: margin}}>
            <VideoCard
              item={item}
              handleProfileNavigate={handleProfileNavigate}
              cardWidth={cardWidth}
            />
          </View>
        )}
        contentContainerStyle={{paddingVertical: 20}}
        keyExtractor={item => item.id}
      />
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#ccc',
    height: 250,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 100,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.15)',
    position: 'absolute',
    bottom: 0,
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    zIndex: 90,
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
  metric: {
    fontSize: 12,
    color: '#fff',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // ensures it appears above other elements
  },
  errorText: {
    color: 'red',
    fontSize: 10,
  },
});

export default VideosSearchResults;
