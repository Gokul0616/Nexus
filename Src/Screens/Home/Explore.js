import React, {useCallback, useRef, useState} from 'react';
import {
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import NexusInput from '../../Components/NexusInput';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {exploreData, exploreCategoriesData} from '../../Components/DummyData';
import CustomHeader from '../../Components/CustomHeader';
import {formatNumber} from '../../Components/CommonData';
import {TouchableRipple} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.5;
const CARD_HEIGHT = 300;

const Explore = () => {
  const [searchVal, setSearchVal] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const navigation = useNavigation();
  const opacity = useRef(new Animated.Value(1)).current;
  const previousY = useRef(0);

  const translateY = useRef(new Animated.Value(0)).current;
  const [showButton, setShowButton] = useState(true);

  // Group data by categories based on exploreCategoriesData objects
  const categorizedData = exploreCategoriesData.reduce((acc, catObj) => {
    acc[catObj.category] = exploreData.filter(item =>
      item.category.includes(catObj.category),
    );
    return acc;
  }, {});

  const naviBack = () => {
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!isSearch) {
          naviBack();
        } else {
          setIsSearch(false);
          setSearchVal('');
        }
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [navigation, isSearch]),
  );

  const lastOffsetY = useRef(0);
  const isSearchHidden = useRef(false);
  const downThreshold = 50;

  const handleScroll = event => {
    const currentY = event.nativeEvent.contentOffset.y;

    if (
      !isSearchHidden.current &&
      currentY - lastOffsetY.current > downThreshold
    ) {
      Animated.timing(translateY, {
        toValue: -80,
        duration: 300,
        useNativeDriver: true,
      }).start();
      isSearchHidden.current = true;
    } else if (isSearchHidden.current && currentY < lastOffsetY.current) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      isSearchHidden.current = false;
    }

    lastOffsetY.current = currentY;
  };

  const handleProfileNavigate = item => {
    console.log(item);
    // Navigation logic for profile details goes here
  };

  const renderVideoItem = ({item}) => (
    <TouchableRipple
      borderless={true}
      rippleColor={'rgba(0, 0, 0, 0.5)'}
      style={styles.videoCard}
      onPress={() => {
        console.log(item);
      }}>
      <>
        <TouchableWithoutFeedback
          onPress={() => {
            handleProfileNavigate(item);
          }}>
          <Image
            source={{uri: item.profilePic}}
            style={[styles.profilePic, {zIndex: 2}]}
          />
        </TouchableWithoutFeedback>
        <Image
          source={{uri: item.videoThumbnail}}
          style={styles.videoThumbnail}
          resizeMode="cover"
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0, 0, 0, 0.1)', zIndex: 1},
          ]}
        />
        <View style={styles.videoInfo}>
          <TouchableWithoutFeedback
            onPress={() => {
              handleProfileNavigate(item);
            }}>
            <Text style={styles.username}>{item.username}</Text>
          </TouchableWithoutFeedback>
          <Text numberOfLines={2} style={styles.caption}>
            {item.caption}
          </Text>
          <View style={styles.metrics}>
            <Text style={styles.metric}>{formatNumber(item.likes)} Likes</Text>
            <Text style={styles.metric}>
              {formatNumber(item.comments)} Comments
            </Text>
          </View>
        </View>
      </>
    </TouchableRipple>
  );

  // Render category section using exploreCategoriesData
  const renderCategorySection = ({item: categoryObj}) => (
    <View style={styles.categorySection}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons
            name={categoryObj.icon}
            size={24}
            color="#000"
            style={styles.categoryIcon}
          />
          <Text style={styles.categoryTitle}>{categoryObj.title}</Text>
        </View>
        <Pressable
          onPress={() =>
            navigation.navigate('Category', {category: categoryObj})
          }>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>
      <FlatList
        data={categorizedData[categoryObj.category]}
        renderItem={renderVideoItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {isSearch && (
        <>
          <CustomHeader
            headerTitle={'Search'}
            leftIconFunction={() => setIsSearch(false)}
          />
          <NexusInput
            placeholder="Search..."
            value={searchVal}
            autofocus={true}
            onChangeText={setSearchVal}
            onFocus={() => setIsSearch(true)}
            style={styles.searchInput}
          />
        </>
      )}

      {!isSearch && (
        <>
          <Animated.View
            style={[
              styles.searchContainer,
              {transform: [{translateY: translateY}]},
            ]}>
            <Pressable
              style={styles.searchMessagesContainer}
              onPress={() => setIsSearch(true)}>
              <View style={styles.searchInputView}>
                <Text style={styles.searchText}>Search</Text>
              </View>
            </Pressable>
          </Animated.View>
          <FlatList
            data={exploreCategoriesData}
            renderItem={renderCategorySection}
            keyExtractor={item => item.category}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            maxToRenderPerBatch={5}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  searchInput: {
    margin: 16,
  },
  content: {
    paddingTop: 90,
    paddingBottom: 20,
  },
  // Sticky search container at the top
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  searchMessagesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInputView: {
    height: 40,
    paddingHorizontal: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#f8f8f8',
  },
  searchText: {
    fontSize: 16,
    color: '#666',
  },
  categorySection: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#666',
    fontWeight: '500',
  },
  carousel: {
    paddingLeft: 16,
  },
  videoCard: {
    width: CARD_WIDTH,
    maxWidth: 500,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  videoThumbnail: {
    width: '100%',
    height: CARD_HEIGHT,
    maxHeight: 800,
  },
  videoInfo: {
    padding: 12,
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  caption: {
    color: '#fff',
    marginBottom: 8,
  },
  metrics: {
    flexDirection: 'row',
    gap: 16,
  },
  metric: {
    fontSize: 12,
    color: '#fff',
  },
});

export default Explore;
