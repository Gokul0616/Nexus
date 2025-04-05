import NetInfo from '@react-native-community/netinfo';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import ClipItem from '../../Components/ClipItem';
import Comment from '../../Components/Comment';
import {NavigationContext} from '../../Services/Hooks/NavigationProvider';
import apiClient from '../../Services/api/apiInterceptor';

export default function ClipVideo() {
  const {isConnected, setIsMessage, isMessage} = useContext(NavigationContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [commentVisible, setCommentVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const {width, height: windowHeight} = useWindowDimensions();
  const [videoData, setVideoData] = useState([]);
  const [likeDataOfUser, setLikeDataOfUser] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [hasFullyWatched, setHasFullyWatched] = useState(false);

  const tabBarHeight = useBottomTabBarHeight();
  const availableHeight = windowHeight - insets.bottom;
  const flatListRef = useRef(null);
  const videoRefs = useRef(new Map());
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  const viewabilityConfig = useRef({viewAreaCoveragePercentThreshold: 50});
  const lastTapTimes = useRef({});
  const likeAnimations = useRef({});
  const previousVideoIdRef = useRef(null);
  const videoWatchTimes = useRef(new Map());
  const likeIconScale = useRef(new Animated.Value(1)).current;

  const sendWatchTime = async (videoId, watchTime, fullyWatched = false) => {
    try {
      await apiClient.post('video/watch', {
        videoId,
        watchTime,
        fullyWatched,
      });
    } catch (err) {
      console.log('Error sending watch time', err);
    }
  };
  useEffect(() => {
    return () => {
      const prevId = previousVideoIdRef.current;
      if (prevId) {
        const watchTime = videoWatchTimes.current.get(prevId) || 0;
        sendWatchTime(prevId, watchTime, hasFullyWatched);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('recommendation');
        // const response = await apiClient.get('post/getRecommendation');

        const data = response.data;
        setVideoData(data);

        const likedVideos = data
          .filter(video => video.likedByCurrentUser)
          .map(video => video.videoId);
        setLikeDataOfUser(likedVideos);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsMessage({
          message: error.response?.data?.message || 'Unable to load data',
          heading: 'Error',
          isRight: false,
          rightButtonText: 'OK',
          triggerFunction: () => {},
          setShowAlert: () => {
            isMessage.setShowAlert(false);
          },
          showAlert: true,
        });
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (
        state.type === 'cellular' &&
        (state.details.cellularGeneration === '2g' ||
          state.details.cellularGeneration === '3g')
      ) {
        setAutoplayEnabled(false);
      } else {
        setAutoplayEnabled(true);
      }
    });
    return () => unsubscribe();
  }, []);
  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0].item;
      const newVideoId = visibleItem.videoId;

      const prevId = previousVideoIdRef.current;
      if (prevId && prevId !== newVideoId) {
        const watchTime = videoWatchTimes.current.get(prevId) || 0;
        sendWatchTime(prevId, watchTime, hasFullyWatched);
        videoWatchTimes.current.set(prevId, 0);
      }

      previousVideoIdRef.current = newVideoId;
      setCurrentVideoId(visibleItem.id);
    }
  }, []);
  const handleTimeUpdate = (videoId, time) => {
    videoWatchTimes.current.set(videoId, time);
  };

  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig: viewabilityConfig.current, onViewableItemsChanged},
  ]);

  useEffect(() => {
    videoRefs.current.forEach((ref, id) => {
      if (ref && id !== currentVideoId) {
        ref.seek(0);
        ref.pauseAsync?.();
      }
    });
  }, [currentVideoId]);

  const handleLoadStart = id => {
    setLoadingStates(prev => ({...prev, [id]: true}));
  };

  const handleLoad = id => {
    setLoadingStates(prev => ({...prev, [id]: false}));
  };

  const handleVideoPress = id => {
    if (id === currentVideoId) {
      const videoRef = videoRefs.current.get(id);
      if (videoRef) {
        videoRef.paused ? videoRef.resumeAsync?.() : videoRef.pauseAsync?.();
      }
    }
  };
  const likeIconRef = useRef(null);
  const [likeIconPos, setLikeIconPos] = useState({x: 0, y: 0});
  const animationTranslate = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const animationScale = useRef(new Animated.Value(1)).current;
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const screenCenter = {x: width / 2 - 40, y: windowHeight / 2 - 40}; // adjust icon size offset
  const animationOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    measureLikeIconPosition();
  }, []);
  const triggerLikeAnimation = () => {
    setShowLikeAnimation(true);
    animationTranslate.setValue(screenCenter);
    animationScale.setValue(1);
    animationOpacity.setValue(1);

    // Pulse before flying
    Animated.sequence([
      Animated.timing(animationScale, {
        toValue: 1.3,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animationScale, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(animationTranslate, {
          toValue: {x: likeIconPos.x - 10, y: likeIconPos.y - 10},
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animationScale, {
          toValue: 0.3,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animationOpacity, {
          toValue: 0,
          duration: 300,
          delay: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      pulseLikeIcon();
      setShowLikeAnimation(false);
    });
  };
  const measureLikeIconPosition = () => {
    if (likeIconRef.current) {
      likeIconRef.current.measureInWindow((x, y, width, height) => {
        setLikeIconPos({x, y});
        triggerLikeAnimation({x, y}); // pass position
      });
    }
  };
  const pulseLikeIcon = () => {
    Animated.sequence([
      Animated.timing(likeIconScale, {
        toValue: 1.4,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(likeIconScale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDoubleTap = (id, videoId) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (
      lastTapTimes.current[id] &&
      now - lastTapTimes.current[id] < DOUBLE_TAP_DELAY
    ) {
      if (!likeAnimations.current[id]) {
        likeAnimations.current[id] = new Animated.Value(0);
      }
      measureLikeIconPosition();

      addLike(videoId);

      lastTapTimes.current[id] = 0;
    } else {
      lastTapTimes.current[id] = now;
    }
  };
  const togglingLikes = useRef(new Set());
  const addLike = async videoId => {
    if (togglingLikes.current.has(videoId)) return;
    togglingLikes.current.add(videoId);

    setVideoData(prevData =>
      prevData.map(video => {
        if (video.videoId === videoId && !video.likedByCurrentUser) {
          const currentLikes = video.likes || 0;
          return {...video, likes: currentLikes + 1, likedByCurrentUser: true};
        }
        return video;
      }),
    );

    setLikeDataOfUser(prevData => [...prevData, videoId]);

    try {
      await apiClient.post(`post/addLike`, {videoId});
    } catch (error) {
      console.log('Error adding like:', error);
    } finally {
      togglingLikes.current.delete(videoId);
    }
  };
  const removeLike = async videoId => {
    if (togglingLikes.current.has(videoId)) return;
    togglingLikes.current.add(videoId);

    setVideoData(prevData =>
      prevData.map(video => {
        if (video.videoId === videoId && video.likedByCurrentUser) {
          const currentLikes = video.likes || 0;
          return {
            ...video,
            likes: currentLikes > 0 ? currentLikes - 1 : 0,
            likedByCurrentUser: false,
          };
        }
        return video;
      }),
    );

    try {
      await apiClient.post(`post/removeLike`, {videoId});
    } catch (error) {
      console.log('Error removing like:', error);
    } finally {
      togglingLikes.current.delete(videoId);
    }
  };
  const handleLikeButtonClick = videoId => {
    setLikeDataOfUser(prevData => {
      if (prevData.includes(videoId)) {
        removeLike(videoId);
        return prevData.filter(id => id !== videoId);
      } else {
        addLike(videoId);

        return [...prevData, videoId];
      }
    });
  };
  useEffect(() => {
    if (isFocused) {
      StatusBar.setBackgroundColor('#151515');
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBackgroundColor('#fff');
      StatusBar.setBarStyle('dark-content');
    }
  }, [isFocused]);
  const renderItem = useCallback(
    ({item, index}) => {
      const isPlaying =
        item.id === currentVideoId && isFocused && autoplayEnabled;
      return (
        <ClipItem
          item={item}
          isPlaying={isPlaying}
          isMuted={isMuted}
          onVideoPress={handleVideoPress}
          handleLoadStart={handleLoadStart}
          handleLoad={handleLoad}
          previousVideoIdRef={previousVideoIdRef}
          onTimeUpdate={handleTimeUpdate}
          loadingStates={loadingStates}
          width={width}
          setIsMuted={setIsMuted}
          height={availableHeight - tabBarHeight}
          videoRefs={videoRefs}
          handleDoubleTap={handleDoubleTap}
          isConnected={isConnected}
          likeAnimations={likeAnimations}
          commentVisible={commentVisible}
          sendWatchTime={sendWatchTime}
          navigation={navigation}
          handleLike={handleLikeButtonClick}
          setCommentVisible={setCommentVisible}
          overlayVisible={overlayVisible}
          setOverlayVisible={setOverlayVisible}
          hasFullyWatched={hasFullyWatched}
          likeIconRef={likeIconRef}
          setHasFullyWatched={setHasFullyWatched}
          index={index}
          setLikeIconPos={setLikeIconPos}
          animationTranslate={animationTranslate}
          animationScale={animationScale}
          animationOpacity={animationOpacity}
          likeIconScale={likeIconScale}
        />
      );
    },
    [
      currentVideoId,
      isMuted,
      loadingStates,
      width,
      availableHeight,
      tabBarHeight,
      isFocused,
      autoplayEnabled,
    ],
  );

  return (
    <View style={styles.container}>
      {overlayVisible && (
        <View style={[styles.headerContainer, {top: insets.top + 10}]}>
          <View>
            <Text style={[styles.headerText, styles.inactiveHeader]}>
              For You
            </Text>
          </View>
          <View>
            <Text style={[styles.headerText, styles.activeHeader]}>
              Following
            </Text>
          </View>
        </View>
      )}
      <FlatList
        ref={flatListRef}
        data={videoData}
        key={item => item.id.toString() + item.videoSource}
        renderItem={renderItem}
        scrollEventThrottle={16}
        keyExtractor={item => item.id.toString() + item.videoSource}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="normal"
        disableIntervalMomentum={true}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        snapToInterval={availableHeight - tabBarHeight}
        snapToAlignment="start"
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={false}
      />
      <Comment
        modalVisible={commentVisible}
        setModalVisible={setCommentVisible}
        isConnected={isConnected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 100,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 15,
  },
  activeHeader: {borderBottomWidth: 0.5, borderBottomColor: '#fff'},
  inactiveHeader: {
    opacity: 0.6,
  },
});
