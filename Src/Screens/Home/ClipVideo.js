import React, {useCallback, useRef, useState, useEffect, memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useWindowDimensions,
  BackHandler,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {reelData} from '../../Components/DummyData';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import CustomLoadingIndicator from '../../Components/CustomLoadingIndicator';

const ReelItem = memo(
  ({
    item,
    isPlaying,
    isMuted,
    onVideoPress,
    handleLoadStart,
    handleLoad,
    loadingStates,
    width,
    height,
    setIsMuted,
    videoRefs,
    handleDoubleTap,
    likeAnimations,
  }) => {
    return (
      <View style={[styles.reelContainer, {width, height}]}>
        <TouchableWithoutFeedback
          onPress={() => {
            handleDoubleTap(item.id);
            onVideoPress(item.id);
          }}>
          <Video
            ref={ref => videoRefs.current.set(item.id, ref)}
            source={{uri: item.videoUrl}}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            paused={!isPlaying}
            repeat
            muted={isMuted}
            onLoadStart={() => handleLoadStart(item.id)}
            onLoad={() => handleLoad(item.id)}
            ignoreSilentSwitch="obey"
          />
        </TouchableWithoutFeedback>

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

        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => setIsMuted(!isMuted)}>
            <Icon
              name={isMuted ? 'volume-mute' : 'volume-high'}
              size={28}
              color="#fff"
              style={styles.muteButton}
              onPress={() => {}}
            />
          </TouchableWithoutFeedback>

          <View style={styles.infoContainer}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="heart" size={24} color="#fff" />
              <Text style={styles.statText}>{item.likesCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="chatbubble" size={24} color="#fff" />
              <Text style={styles.statText}>{item.commentsCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="share-social" size={24} color="#fff" />
              <Text style={styles.statText}>{item.shares}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  },
);

export default function ClipVideo() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const {width, height: windowHeight} = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const availableHeight = windowHeight - insets.bottom;
  const flatListRef = useRef(null);
  const videoRefs = useRef(new Map());
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const viewabilityConfig = useRef({viewAreaCoveragePercentThreshold: 50});
  const lastTapTimes = useRef({});
  const likeAnimations = useRef({});

  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0].item;
      setCurrentVideoId(visibleItem.id);
    }
  }, []);

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

  const handleDoubleTap = id => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (
      lastTapTimes.current[id] &&
      now - lastTapTimes.current[id] < DOUBLE_TAP_DELAY
    ) {
      if (!likeAnimations.current[id]) {
        likeAnimations.current[id] = new Animated.Value(0);
      }
      Animated.sequence([
        Animated.timing(likeAnimations.current[id], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(350),
        Animated.timing(likeAnimations.current[id], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      lastTapTimes.current[id] = 0;
    } else {
      lastTapTimes.current[id] = now;
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'TopTabs'}],
          }),
        );
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  const renderItem = useCallback(
    ({item}) => {
      const isPlaying = item.id === currentVideoId && isFocused;
      return (
        <ReelItem
          item={item}
          isPlaying={isPlaying}
          isMuted={isMuted}
          onVideoPress={handleVideoPress}
          handleLoadStart={handleLoadStart}
          handleLoad={handleLoad}
          loadingStates={loadingStates}
          width={width}
          setIsMuted={setIsMuted}
          height={availableHeight - tabBarHeight}
          videoRefs={videoRefs}
          handleDoubleTap={handleDoubleTap}
          likeAnimations={likeAnimations}
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
    ],
  );

  return (
    <FlatList
      ref={flatListRef}
      data={reelData}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
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
  );
}

const styles = StyleSheet.create({
  reelContainer: {
    backgroundColor: '#000',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  muteButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 25,
    zIndex: 10,
  },
  infoContainer: {
    flex: 1,
    paddingRight: 20,
  },
  username: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
  statsContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  likeAnimation: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    zIndex: 999,
  },
});
