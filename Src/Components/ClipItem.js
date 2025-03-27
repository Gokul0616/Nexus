import React, {memo, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomLoadingIndicator from './CustomLoadingIndicator';
import DynamicImage from './DynamicImage';
import {ClipItemStyles as styles} from './Styles/Styles';
import {TouchableRipple} from 'react-native-paper';
import RNFS from 'react-native-fs';
import {storage} from './CommonData';
import {PanResponder} from 'react-native';
const ClipItem = memo(
  ({
    item,
    isPlaying,
    isMuted,
    onVideoPress,
    handleLoadStart,
    handleLoad,
    loadingStates,
    commentVisible,
    setCommentVisible,
    width,
    height,
    setIsMuted,
    videoRefs,
    handleDoubleTap,
    likeAnimations,
    handleLike,
    isConnected,
    overlayVisible,
    setOverlayVisible,
    navigation,
    onLongPressAction,
  }) => {
    const [pausedLocally, setPausedLocally] = useState(false);
    const [cachedUri, setCachedUri] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [localOverlayVisible, setLocalOverlayVisible] = useState(true);

    const spinValue = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      const cacheVideo = async () => {
        const cacheDir = RNFS.CachesDirectoryPath;
        const fileName = item.videoSource.split('/').pop();
        const filePath = `${cacheDir}/${fileName}`;
        try {
          const exists = await RNFS.exists(filePath);
          if (exists) {
            setCachedUri(`file://${filePath}`);
          } else {
            const downloadOptions = {
              fromUrl: item.videoSource,
              toFile: filePath,
            };
            const result = await RNFS.downloadFile(downloadOptions).promise;
            if (result && result.statusCode === 200) {
              setCachedUri(`file://${filePath}`);
            } else {
              setCachedUri(item.videoSource);
            }
          }
        } catch (error) {
          console.error('Error caching video:', error);
          setCachedUri(item.videoSource);
        }
      };

      cacheVideo();
    }, [item.videoSource]);

    useEffect(() => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    }, [pausedLocally]);

    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const [containerLayout, setContainerLayout] = useState({x: 0, width: 0});

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (!containerLayout.width || videoDuration === 0) return;

        const newX = gestureState.moveX - containerLayout.x;
        const clampedX = Math.max(0, Math.min(newX, containerLayout.width));
        const newTime = (clampedX / containerLayout.width) * videoDuration;
        setCurrentTime(newTime);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (!containerLayout.width || videoDuration === 0) return;

        const newX = gestureState.moveX - containerLayout.x;
        const clampedX = Math.max(0, Math.min(newX, containerLayout.width));
        const newTime = (clampedX / containerLayout.width) * videoDuration;
        const videoRef = videoRefs.current.get(item.id);

        if (videoRef) {
          videoRef.seek(newTime);
          setCurrentTime(newTime);
        }
      },
    });
    const handleLongPress = () => {
      setPausedLocally(true);
      setOverlayVisible(false);
      setLocalOverlayVisible(false);
      if (onLongPressAction) {
        onLongPressAction(item.id);
      }
    };

    const handlePressOut = () => {
      setPausedLocally(false);
      setLocalOverlayVisible(true);
      setOverlayVisible(true);
    };

    const handlePress = () => {
      handleDoubleTap(item.id, item.videoId);
      onVideoPress(item.id);
    };

    const handlePressOfProfile = () => {
      const profileString = storage.getString('profile');
      const profile = JSON.parse(profileString);
      if (profile.username === item.username) {
        navigation.navigate('Profile');
      } else {
        navigation.navigate('OtherProfileScreen', {
          username: item.username,
        });
      }
    };
    return (
      <View style={[styles.container, {width, height}]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handlePress}
          onLongPress={handleLongPress}
          onPressOut={handlePressOut}
          delayLongPress={300}>
          <Video
            key={`video-${item.id}-${isConnected}`}
            ref={ref => videoRefs.current.set(item.id, ref)}
            source={{uri: cachedUri || item.videoSource}}
            poster={item.thumbnail}
            posterResizeMode="cover"
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            paused={!isPlaying || pausedLocally}
            repeat
            muted={isMuted}
            onLoadStart={() => handleLoadStart(item.id)}
            onLoad={data => {
              handleLoad(item.id);

              setVideoDuration(data.duration);
            }}
            onProgress={data => {
              setCurrentTime(data.currentTime);
            }}
            onBuffer={buffer => {}}
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
            ignoreSilentSwitch="obey"
          />
        </Pressable>
        {localOverlayVisible && (
          <View
            style={[styles.progressBarContainer, {width}]}
            onLayout={e => setContainerLayout(e.nativeEvent.layout)}
            {...panResponder.panHandlers}>
            <View
              style={[
                styles.progressBar,
                {
                  width:
                    videoDuration > 0
                      ? (currentTime / videoDuration) * containerLayout.width
                      : 0,
                },
              ]}
            />
          </View>
        )}
        {loadingStates[item.id] && (
          <View style={styles.loadingContainer}>
            <CustomLoadingIndicator />
          </View>
        )}

        {likeAnimations.current[item.id] && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.likeAnimation,
              {
                opacity: likeAnimations.current[item.id],
                transform: [
                  {
                    scale: likeAnimations.current[item.id].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.2],
                    }),
                  },
                ],
              },
            ]}>
            <Icon name="heart" size={100} color="#ed4956" />
          </Animated.View>
        )}

        {localOverlayVisible && (
          <View style={styles.volumeButtonContainer}>
            <Pressable onPress={() => setIsMuted(!isMuted)}>
              <View style={styles.volumeButton}>
                <Icon
                  name={isMuted ? 'volume-mute' : 'volume-high'}
                  size={24}
                  color="#fff"
                />
              </View>
            </Pressable>
          </View>
        )}

        {localOverlayVisible && (
          <View style={styles.bottomContainer}>
            <View style={styles.bottomLeft}>
              <Text
                style={styles.username}
                onPress={() => {
                  handlePressOfProfile();
                }}>
                {item.username}
              </Text>
              <Text style={styles.caption}>{item.caption}</Text>
              <View style={styles.musicRow}>
                <Icon name="musical-notes" size={16} color="#fff" />
                <Text style={styles.musicTitle}>{item.musicTitle}</Text>
              </View>
            </View>
            <View style={styles.bottomRight}>
              <TouchableOpacity
                onPress={() => {
                  handlePressOfProfile();
                }}
                style={styles.profileContainer}>
                <>
                  <DynamicImage
                    uri={item.profilePic}
                    isConnected={isConnected}
                    style={styles.profileImage}
                  />
                  <View style={styles.followIcon}>
                    <Entypo name="plus" size={13} color="#fff" />
                  </View>
                </>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleLike(item.videoId)}
                style={styles.iconWrapper}>
                <>
                  <Icon
                    name="heart"
                    size={32}
                    color={item.likedByCurrentUser ? '#ed4956' : '#fff'}
                  />
                  <Text style={styles.iconText}>{item.likes}</Text>
                </>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCommentVisible(true)}
                style={styles.iconWrapper}>
                <>
                  <Icon name="chatbubble" size={32} color="#fff" />
                  <Text style={styles.iconText}>{item.comments}</Text>
                </>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconWrapper}>
                <>
                  <Icon name="share-social" size={32} color="#fff" />
                  <Text style={styles.iconText}>{item.shares}</Text>
                </>
              </TouchableOpacity>
              <Animated.View
                style={[styles.musicDisk, {transform: [{rotate: spin}]}]}>
                <DynamicImage
                  uri={item.thumbnail}
                  isConnected={isConnected}
                  style={styles.diskImage}
                />
                <View style={styles.overlayLayer} />
                <View style={styles.musicIconOverlay}>
                  <Icon name="musical-notes" size={18} color="#fff" />
                </View>
              </Animated.View>
            </View>
          </View>
        )}
      </View>
    );
  },
);

export default ClipItem;
