import NetInfo from '@react-native-community/netinfo';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
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
  Dimensions,
  FlatList,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppName} from '../../Components/CommonData';
import CustomLoadingIndicator from '../../Components/CustomLoadingIndicator';
import CustomVideoPlayer from '../../Components/CustomVideoPlayer';
import {posts, stories} from '../../Components/DummyData';
import DynamicImage from '../../Components/DynamicImage';
import {HomeScreenStyles as styles} from '../../Components/Styles/Styles';
import RenderStories from '../../Components/Stories';
import {NavigationContext} from '../../Services/Hooks/NavigationProvider';

const {width: screenWidth} = Dimensions.get('window');

const HomeScreen = () => {
  const {currentIndex, setSwipeEnabled, topStackIndex} =
    useContext(NavigationContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [likedPosts, setLikedPosts] = useState({});
  const [currentPage, setCurrentPage] = useState({});
  const [viewVisible, setViewVisible] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState({});
  const [isConnected, setIsConnected] = useState(true);
  const [mediaKey, setMediaKey] = useState(0);
  const likeAnimations = useRef({}).current;
  const [hasMessageNotification, setHasMessageNotification] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [gestureCaptured, setGestureCaptured] = useState(false);
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastOffsetY = useRef(0);
  const isHeaderHidden = useRef(false);
  const downThreshold = 50;
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );
  useFocusEffect(
    useCallback(() => {
      // When HomeScreen is focused, set viewVisible to true
      setViewVisible(true);
      return () => {
        // When HomeScreen loses focus, you may pause the video by setting viewVisible to false
        setViewVisible(false);
      };
    }, []),
  );
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setMediaKey(prev => prev + 1);
    });
    return () => unsubscribe();
  }, []);
  const handleLike = postId => {
    if (likedPosts[postId]) {
      setLikedPosts(prev => ({
        ...prev,
        [postId]: false,
      }));

      return;
    }

    setLikedPosts(prev => ({
      ...prev,
      [postId]: true,
    }));

    if (!likeAnimations[postId]) {
      likeAnimations[postId] = new Animated.Value(0);
    }

    Animated.sequence([
      Animated.timing(likeAnimations[postId], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(350),
      Animated.timing(likeAnimations[postId], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      delete likeAnimations[postId];
    });
  };
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Exit the app when on HomeScreen
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );
  const scrollRef = useRef(null);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        scrollRef.current?.setNativeProps({scrollEnabled: false});
      },
      onPanResponderRelease: () => {
        scrollRef.current?.setNativeProps({scrollEnabled: true});
      },
    }),
  ).current;

  const [viewableItems, setViewableItems] = useState([]);
  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    setViewableItems(prevItems => {
      if (JSON.stringify(prevItems) !== JSON.stringify(viewableItems)) {
        return viewableItems;
      }
      return prevItems;
    });
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const lastTapTimes = useRef({});

  const handleDoubleTap = postId => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (
      lastTapTimes.current[postId] &&
      now - lastTapTimes.current[postId] < DOUBLE_TAP_DELAY
    ) {
      handleLike(postId);
      lastTapTimes.current[postId] = 0;
    } else {
      lastTapTimes.current[postId] = now;
    }
  };

  const renderHeader = () => (
    <Animated.View
      style={[styles.navBar, {transform: [{translateY: headerTranslateY}]}]}>
      <Text style={styles.logo}>{AppName}</Text>
      <View style={styles.icons}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Message')}
          style={styles.iconsContainer}>
          <Icon name="paper-plane-outline" size={28} color="#000" />
          {hasMessageNotification && <View style={styles.dotMessage} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconsContainer}
          onPress={() => navigation.navigate('NotificationScreen')}>
          <Icon name="heart-outline" size={28} color="#000" />
          {hasNotification && <View style={styles.dotNotification} />}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
  useEffect(() => {
    if (gestureCaptured) {
      setSwipeEnabled(false);
    } else {
      setSwipeEnabled(true);
    }
  }, [gestureCaptured]);
  const [videoHeights, setVideoHeights] = useState({});

  const handleVideoLoad = (data, itemId) => {
    if (data?.naturalSize?.width && data?.naturalSize?.height) {
      setVideoHeights(prev => {
        if (prev[itemId]) return prev; // Prevent re-setting once it's computed
        const computedHeight =
          (screenWidth * data.naturalSize.height) / data.naturalSize.width;
        return {...prev, [itemId]: computedHeight};
      });
    }
  };

  const renderPost = ({item}) => {
    const isVisible = viewableItems.some(
      viewableItem =>
        viewableItem.key === item.id &&
        currentIndex === 0 &&
        viewVisible &&
        topStackIndex === 1,
    );
    return (
      <View style={styles.post}>
        <View style={styles.postHeader}>
          <View style={styles.postUser}>
            <DynamicImage
              uri={item.avatar}
              style={styles.postAvatar}
              resizeMode="contain"
              isConnected={isConnected}
              item={item}
              setLoadingPosts={setLoadingPosts}
            />
            <Text style={styles.postUsername}>
              {item.username === 'Sponsored' ? 'Sponsored' : item.username}
            </Text>
          </View>
          <TouchableOpacity>
            <Icon name="ellipsis-horizontal" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {item.type === 'image' && (
          <Pressable
            onPress={() => {
              handleDoubleTap(item.id);
            }}
            activeOpacity={0.8}
            style={styles.mediaContainer}>
            <>
              <DynamicImage
                key={`${item.id}-${mediaKey}`}
                uri={item.content}
                style={styles.postImage}
                setLoadingPosts={setLoadingPosts}
                item={item}
                resizeMode="contain"
                isConnected={isConnected}
              />
              {loadingPosts[item.id] && (
                <View style={styles.loadingContainer}>
                  <CustomLoadingIndicator />
                </View>
              )}
              {likedPosts[item.id] && (
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.likeAnimation,
                    {
                      opacity: likeAnimations[item.id] || 0,
                      transform: [
                        {
                          scale: likeAnimations[item.id]
                            ? likeAnimations[item.id].interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.5, 1.2],
                              })
                            : 0,
                        },
                      ],
                    },
                  ]}>
                  <Icon name="heart" size={100} color="#ed4956" />
                </Animated.View>
              )}
            </>
          </Pressable>
        )}

        {item.type === 'video' && (
          <Pressable
            onPress={() => handleDoubleTap(item.id)}
            style={styles.mediaContainer}>
            <CustomVideoPlayer
              key={`${item.id}-${mediaKey}`}
              source={{uri: item.content}}
              style={[
                styles.postImage,
                {height: videoHeights[item.id] || screenWidth},
              ]} // Default to screenWidth until computed
              setLoadingPosts={setLoadingPosts}
              item={item}
              isVisible={isVisible}
              resizeMode="contain"
              isConnected={isConnected}
              onVideoLoad={data => handleVideoLoad(data, item.id)}
            />

            {likedPosts[item.id] && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.likeAnimation,
                  {
                    opacity: likeAnimations[item.id] || 0,
                    transform: [
                      {
                        scale: likeAnimations[item.id]
                          ? likeAnimations[item.id].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.5, 1.2],
                            })
                          : 0,
                      },
                    ],
                  },
                ]}>
                <Icon name="heart" size={100} color="#ed4956" />
              </Animated.View>
            )}
          </Pressable>
        )}
        {item.type === 'carousel' && (
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              nestedScrollEnabled
              onTouchStart={() => {
                setGestureCaptured(true);
              }}
              onMomentumScrollBegin={() => {
                setGestureCaptured(true);
              }}
              onMomentumScrollEnd={() => {
                setGestureCaptured(false);
              }}
              onScroll={event => {
                const offsetX = event.nativeEvent.contentOffset.x;
                const currentPageIndex = Math.round(offsetX / screenWidth);

                setCurrentPage(prev => ({
                  ...prev,
                  [item.id]: currentPageIndex,
                }));
              }}
              scrollEventThrottle={16}>
              {item.content.map((image, index) => (
                <Pressable
                  key={`${item.id}-${index}-${mediaKey}`}
                  onPress={() => handleDoubleTap(item.id)}
                  activeOpacity={0.9}>
                  <DynamicImage
                    uri={image}
                    style={styles.postImage}
                    setLoadingPosts={setLoadingPosts}
                    item={item}
                    resizeMode="contain"
                    isConnected={isConnected}
                  />
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.carouselIndicator}>
              <Text style={styles.carouselIndicatorText}>
                {currentPage[item.id] !== undefined
                  ? currentPage[item.id] + 1
                  : 1}
                /{item.content.length}
              </Text>
            </View>
            {likedPosts[item.id] && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.likeAnimation,
                  {
                    opacity: likeAnimations[item.id] || 0,
                    transform: [
                      {
                        scale: likeAnimations[item.id]
                          ? likeAnimations[item.id].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.5, 1.2],
                            })
                          : 0,
                      },
                    ],
                  },
                ]}>
                <Icon name="heart" size={100} color="#ed4956" />
              </Animated.View>
            )}
          </View>
        )}

        {item.type === 'ad' && (
          <Pressable onPress={() => handleDoubleTap(item.id)}>
            <DynamicImage
              uri={item.content}
              style={styles.postImage}
              resizeMode="contain"
              isConnected={isConnected}
              item={item}
              setLoadingPosts={setLoadingPosts}
            />
            <View style={styles.adLabel}>
              <Text style={styles.adLabelText}>Sponsored</Text>
            </View>
            {likedPosts[item.id] && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.likeAnimation,
                  {
                    opacity: likeAnimations[item.id] || 0,
                    transform: [
                      {
                        scale: likeAnimations[item.id]
                          ? likeAnimations[item.id].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.5, 1.2],
                            })
                          : 0,
                      },
                    ],
                  },
                ]}>
                <Icon name="heart" size={100} color="#ed4956" />
              </Animated.View>
            )}
          </Pressable>
        )}

        <View style={styles.postActions}>
          <View style={styles.actionIcons}>
            <TouchableOpacity onPress={() => handleLike(item.id)}>
              <Icon
                name={likedPosts[item.id] ? 'heart' : 'heart-outline'}
                size={26}
                color={likedPosts[item.id] ? '#ed4956' : '#000'}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="chatbubble-outline" size={26} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="arrow-redo-outline" size={26} color="#000" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <FontAwesomeIcon name="bookmark-o" size={26} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.postDetails}>
          <Text style={styles.likes}>{item.likes} likes</Text>
          <Text style={styles.caption}>
            <Text style={styles.bold}>{item.username}</Text> {item.caption}
          </Text>
          <TouchableOpacity>
            <Text style={styles.comments}>
              View all {item.comments} comments
            </Text>
          </TouchableOpacity>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <RenderStories
            stories={stories}
            isConnected={isConnected}
            setLoadingPosts={setLoadingPosts}
            navigation={navigation}
            setGestureCaptured={setGestureCaptured}
            gestureCaptured={gestureCaptured}
          />
        }
        renderItem={renderPost}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={event => {
          const offsetY = event.nativeEvent.contentOffset.y;
          if (
            !isHeaderHidden.current &&
            offsetY - lastOffsetY.current > downThreshold
          ) {
            Animated.timing(headerTranslateY, {
              toValue: -80,
              duration: 300,
              useNativeDriver: true,
            }).start();
            isHeaderHidden.current = true;
            lastOffsetY.current = offsetY;
          } else if (isHeaderHidden.current && offsetY < lastOffsetY.current) {
            Animated.timing(headerTranslateY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start();
            isHeaderHidden.current = false;
            lastOffsetY.current = offsetY;
          } else {
            lastOffsetY.current = offsetY;
          }
        }}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default HomeScreen;
