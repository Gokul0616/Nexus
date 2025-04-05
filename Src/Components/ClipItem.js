import React, {memo, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Easing,
  PanResponder,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import CustomLoadingIndicator from './CustomLoadingIndicator';
import DynamicImage from './DynamicImage';
import {ClipItemStyles as styles} from './Styles/Styles';
import {ActivityIndicator, TouchableRipple} from 'react-native-paper';
import RNFS from 'react-native-fs';
import {storage} from './CommonData';
import {PanResponder as RN_PanResponder} from 'react-native';
import apiClient from '../Services/api/apiInterceptor';

const ClipItem = memo(
  ({
    item,
    isPlaying,
    isMuted,
    likeIconRef,
    onVideoPress,
    handleLoadStart,
    handleLoad,
    loadingStates,
    commentVisible,
    setLikeIconPos,
    setCommentVisible,
    width,
    height,
    setIsMuted,
    previousVideoIdRef,
    videoRefs,
    handleDoubleTap,
    likeAnimations,
    handleLike,
    isConnected,
    hasFullyWatched,
    setHasFullyWatched,
    likeIconScale,
    overlayVisible,
    setOverlayVisible,
    navigation,
    onLongPressAction,
    index,
    onTimeUpdate,
    sendWatchTime,
    animationTranslate,
    animationScale,
    animationOpacity,
  }) => {
    const [pausedLocally, setPausedLocally] = useState(false);
    const [cachedUri, setCachedUri] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [localOverlayVisible, setLocalOverlayVisible] = useState(true);
    const [containerLayout, setContainerLayout] = useState({x: 0, width: 0});
    const progressAnim = useRef(new Animated.Value(0)).current;

    const [followLoading, setFollowLoading] = useState(false);
    const profileString = storage.getString('profile');
    const profile = JSON.parse(profileString);
    useEffect(() => {
      if (containerLayout.width && videoDuration) {
        const progressWidth =
          (currentTime / videoDuration) * containerLayout.width;
        Animated.timing(progressAnim, {
          toValue: progressWidth,
          duration: 50,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      }
    }, [currentTime, containerLayout.width, videoDuration]);

    const progressPanResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {},
        onPanResponderMove: evt => {
          if (!containerLayout.width || videoDuration === 0) return;
          const relativeX = evt.nativeEvent.locationX;
          const clampedX = Math.max(
            0,
            Math.min(relativeX, containerLayout.width),
          );
          const newTime = (clampedX / containerLayout.width) * videoDuration;
          const videoRef = videoRefs.current.get(item.id);
          if (videoRef && videoRef.seek) {
            videoRef.seek(newTime);
          }
          setCurrentTime(newTime);
        },
        onPanResponderRelease: evt => {
          if (!containerLayout.width || videoDuration === 0) return;
          const relativeX = evt.nativeEvent.locationX;
          const clampedX = Math.max(
            0,
            Math.min(relativeX, containerLayout.width),
          );
          const newTime = (clampedX / containerLayout.width) * videoDuration;
          const videoRef = videoRefs.current.get(item.id);
          if (videoRef && videoRef.seek) {
            videoRef.seek(newTime);
          }
          setCurrentTime(newTime);
        },
      }),
    ).current;
    const noteAnimations = Array.from({length: 3}).map(() => ({
      translateX: useRef(new Animated.Value(0)).current,
      translateY: useRef(new Animated.Value(0)).current,
      opacity: useRef(new Animated.Value(1)).current,
    }));
    useEffect(() => {
      noteAnimations.forEach(({translateX, translateY, opacity}, index) => {
        const scatter = () => {
          translateX.setValue(0);
          translateY.setValue(0);
          opacity.setValue(1);

          Animated.parallel([
            Animated.timing(translateX, {
              toValue: Math.random() * 40 - 20,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -40 - Math.random() * 30,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]).start(() => scatter());
        };

        setTimeout(scatter, index * 700); // stagger each note
      });
    }, []);

    useEffect(() => {
      const cacheVideo = async () => {
        if (index >= 10) {
          setCachedUri(item.videoSource);
          return;
        }
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
          setCachedUri(item.videoSource);
        }
      };

      cacheVideo();
    }, [item.videoSource, index]);

    const spinValue = useRef(new Animated.Value(0)).current;
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
    const toggleFollow = async () => {
      setFollowLoading(true);
      const profileString = storage.getString('profile');
      const currUser = JSON.parse(profileString);
      const payload = {
        followerId: currUser.userId,
        followeeId: item.userId,
      };
      const response = await apiClient.post('follow/toggleFollow', payload);
      if (response.status === 200) {
        item.followedByCurrentUser = !item.followedByCurrentUser;
      }
      setFollowLoading(false);
    };

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
      if (profile.username === item.username) {
        navigation.navigate('Profile');
      } else {
        navigation.navigate('OtherProfileScreen', {username: item.username});
      }
    };

    const handleVideoEnd = () => {
      if (!hasFullyWatched) {
        setHasFullyWatched(true);
      }
      sendWatchTime(item.videoId, currentTime, true);
      setCurrentTime(0);
      setHasFullyWatched(false);
    };

    const handleVideoPause = () => {
      sendWatchTime(item.videoId, currentTime);
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
            source={{uri: cachedUri || item.videoSource}}
            poster={item.thumbnail}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            paused={!isPlaying || pausedLocally}
            muted={isMuted}
            mixWithOthers={isMuted ? 'mix' : 'inherit'}
            disableFocus={isMuted}
            repeat={true}
            onLoadStart={() => handleLoadStart(item.id)}
            onLoad={data => {
              handleLoad(item.id);
              setVideoDuration(data.duration);
            }}
            onProgress={data => {
              setCurrentTime(data.currentTime);
              onTimeUpdate?.(item.videoId, data.currentTime);
              if (data.duration - data.currentTime < 1) {
                setHasFullyWatched(true);
                console.log('Video has been fully watched');
              } else {
                setHasFullyWatched(false);
              }
            }}
            onEnd={handleVideoEnd}
            onPause={handleVideoPause}
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
            ignoreSilentSwitch="obey"
          />
        </Pressable>
        {/* {localOverlayVisible && (
          <View
            style={[styles.progressBarContainer, {width}]}
            onLayout={e => {
              setContainerLayout(e.nativeEvent.layout);
            }}
            {...progressPanResponder.panHandlers}>
            <Animated.View
              style={[styles.progressBar, {width: progressAnim}]}
            />
          </View>
        )} */}
        {loadingStates[item.id] && (
          <View style={styles.loadingContainer}>
            <CustomLoadingIndicator />
          </View>
        )}
        {likeAnimations.current[item.id] && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: [
                {translateX: animationTranslate.x},
                {translateY: animationTranslate.y},
                {scale: animationScale},
              ],
              opacity: animationOpacity,
            }}>
            <AntDesign name="heart" size={80} color="#ff004f" />
          </Animated.View>
        )}
        {localOverlayVisible && (
          <View style={styles.volumeButtonContainer}>
            <Pressable onPress={() => setIsMuted(!isMuted)}>
              <View style={styles.volumeButton}>
                <Icon
                  name={isMuted ? 'volume-mute' : 'volume-high'}
                  size={20}
                  color="#fff"
                />
              </View>
            </Pressable>
          </View>
        )}
        {localOverlayVisible && (
          <View style={styles.bottomContainer}>
            <View style={styles.bottomLeft}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text style={styles.username} onPress={handlePressOfProfile}>
                  @{item.username}
                </Text>

                {item.userId !== profile.userId && (
                  <TouchableRipple
                    rippleColor={'rgba(0, 0, 0, 0.25)'}
                    onPress={() => {
                      toggleFollow();
                    }}
                    style={styles.followButton}>
                    {followLoading ? (
                      <ActivityIndicator size={14} color="#fff" />
                    ) : (
                      <Text style={styles.followText}>
                        {item.followedByCurrentUser ? 'Following' : 'Follow'}
                      </Text>
                    )}
                  </TouchableRipple>
                )}
              </View>
              <Text style={styles.caption}>{item.caption}</Text>
              <View style={styles.musicRow}>
                <Icon name="musical-notes" size={12} color="#fff" />
                <Text style={styles.musicTitle}>{item.musicTitle}</Text>
              </View>
            </View>
            <View style={styles.bottomRight}>
              <TouchableOpacity
                onPress={handlePressOfProfile}
                style={styles.profileContainer}>
                <>
                  <DynamicImage
                    uri={item.profilePic}
                    isConnected={isConnected}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                  <View style={styles.followIcon}>
                    <Entypo name="plus" size={14} color="#fff" />
                  </View>
                </>
              </TouchableOpacity>
              <Animated.View
                style={{
                  transform: [{scale: likeIconScale}],
                }}>
                <TouchableOpacity
                  ref={likeIconRef}
                  onPress={() => handleLike(item.videoId)}
                  style={styles.iconWrapper}>
                  <>
                    <AntDesign
                      name="heart"
                      size={25}
                      color={item.likedByCurrentUser ? '#ff004f' : '#fff'}
                    />
                    <Text style={styles.iconText}>{item.likes}</Text>
                  </>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity
                onPress={() => setCommentVisible(true)}
                style={styles.iconWrapper}>
                <>
                  <Fontisto name="comments" size={25} color="#fff" />
                  <Text style={styles.iconText}>{item.comments}</Text>
                </>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconWrapper}>
                <>
                  <MaterialCommunityIcons
                    name="share-all-outline"
                    size={25}
                    color="#fff"
                  />
                  <Text style={styles.iconText}>{item.shares}</Text>
                </>
              </TouchableOpacity>
              <Animated.View
                style={[styles.musicDisk, {transform: [{rotate: spin}]}]}>
                <DynamicImage
                  uri={item.thumbnail}
                  isConnected={isConnected}
                  style={styles.diskImage}
                  resizeMode="cover"
                />
                <View style={styles.overlayLayer} />
                <View style={styles.musicIconOverlay}>
                  {noteAnimations.map(
                    ({translateX, translateY, opacity}, i) => (
                      <Animated.View
                        key={i}
                        style={{
                          position: 'absolute',
                          top: -5,
                          left: 5,
                          opacity,
                          transform: [
                            {translateX},
                            {translateY},
                            {scale: opacity}, // shrink as it fades
                          ],
                        }}>
                        <Icon name="musical-notes" size={12} color="#fff" />
                      </Animated.View>
                    ),
                  )}

                  <Icon name="musical-notes" size={15} color="#fff" />
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
