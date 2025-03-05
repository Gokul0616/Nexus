import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  CommonActions,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  BackHandler,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ClipItem from '../../Components/ClipItem';
import {videoData} from '../../Components/DummyData';
import {NavigationContext} from '../../Services/Hooks/NavigationProvider';
import Comment from '../../Components/Comment';

export default function ClipVideo() {
  const {isConnected} = useContext(NavigationContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [commentVisible, setCommentVisible] = useState(false);

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
    }, [navigation]),
  );

  const renderItem = useCallback(
    ({item}) => {
      const isPlaying = item.id === currentVideoId && isFocused;
      return (
        <ClipItem
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
          isConnected={isConnected}
          likeAnimations={likeAnimations}
          commentVisible={commentVisible}
          setCommentVisible={setCommentVisible}
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
    <View style={styles.container}>
      {/* Header similar to TikTok's "For You" / "Following" */}
      <View style={[styles.headerContainer, {top: insets.top + 10}]}>
        <Text style={[styles.headerText, styles.activeHeader]}>For You</Text>
        <Text style={[styles.headerText, styles.inactiveHeader]}>
          Following
        </Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={videoData}
        renderItem={renderItem}
        scrollEventThrottle={16}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 15,
  },
  activeHeader: {
    // borderBottomWidth: 2,
    // borderBottomColor: '#fff',
  },
  inactiveHeader: {
    opacity: 0.6,
  },
});
