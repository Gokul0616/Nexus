import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import CustomLoadingIndicator from './CustomLoadingIndicator';
import {formatNumber} from './CommonData';
import {TouchableRipple} from 'react-native-paper';

export const VideoCard = ({
  item,
  isVisible,
  handleProfileNavigate,
  CARD_WIDTH,
}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <TouchableRipple
      onPress={() => console.log(item)}
      rippleColor={'rgba(0, 0, 0, 0.5)'}
      style={{borderRadius: 12}}
      borderless={true}>
      <View style={videoCardStyles.card}>
        <TouchableWithoutFeedback onPress={() => handleProfileNavigate(item)}>
          <Image
            source={{uri: item.profilePic}}
            style={[videoCardStyles.profilePic, {zIndex: 2}]}
          />
        </TouchableWithoutFeedback>
        <View style={videoCardStyles.thumbnailContainer}>
          {isVisible ? (
            <Video
              source={{uri: item.videoSource}}
              style={{width: CARD_WIDTH, height: 250}}
              muted
              repeat
              resizeMode="contain"
              paused={!isVisible}
              viewType={0}
              disableFocus={true}
            />
          ) : (
            <>
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {backgroundColor: 'rgba(0, 0, 0, 0.1)', zIndex: 1},
                ]}
              />
              <Image
                onLoadStart={() => {
                  setLoading(true);
                  setError(false);
                }}
                onLoadEnd={() => setLoading(false)}
                onError={() => {
                  setError(true);
                  setLoading(false);
                }}
                source={{uri: item.videoThumbnail}}
                style={videoCardStyles.thumbnail}
                resizeMode="cover"
              />
              {loading && (
                <View style={videoCardStyles.loadingContainer}>
                  <CustomLoadingIndicator />
                </View>
              )}
              {error && (
                <View style={videoCardStyles.errorContainer}>
                  <Ionicons name="image-outline" size={30} color="#fff" />
                  <Text style={videoCardStyles.errorText}>
                    Image unavailable
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
        <View style={videoCardStyles.info}>
          <TouchableWithoutFeedback onPress={() => handleProfileNavigate(item)}>
            <Text style={videoCardStyles.username}>{item.username}</Text>
          </TouchableWithoutFeedback>
          <Text numberOfLines={2} style={videoCardStyles.caption}>
            {item.caption}
          </Text>
          <View style={videoCardStyles.metrics}>
            <Text style={videoCardStyles.metric}>
              {formatNumber(item.likes)}{' '}
              <FontAwesome name="heart-o" size={12} color="#fff" />
            </Text>
            <Text style={videoCardStyles.metric}>
              {formatNumber(item.comments)}{' '}
              <FontAwesome name="comment-o" size={12} color="#fff" />
            </Text>
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};

const videoCardStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#ccc',
    backgroundColor: '#000',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 8,
    left: 8,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
  },
  info: {
    padding: 8,
    position: 'absolute',
    bottom: 0,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
    fontSize: 14,
  },
  caption: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 8,
  },
  metrics: {
    flexDirection: 'row',
    gap: 10,
  },
  metric: {
    fontSize: 12,
    color: '#fff',
  },
});
